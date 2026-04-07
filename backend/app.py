from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import hashlib
import re
from bson import ObjectId
from flask import jsonify
from utils.document_type import detect_document_type
from utils.extract_fields import extract_dynamic_fields




app = Flask(__name__)
CORS(CORS(app, resources={r"/*": {"origins": "*"}}))




# ---------------- CONFIG ----------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# POPPLER_PATH = r"C:\poppler-25.12.0\Library\bin"


# ---------------- MONGODB ----------------
# client = MongoClient("mongodb://localhost:27017/")
# db = client["datavision_ai"]
# collection = db["documents"]

client = MongoClient("mongodb+srv://anjali:anjali1234@cluster1.wpcxvhd.mongodb.net/datavision?retryWrites=true&w=majority")
db = client["datavision"]
collection = db["documents"]


# ---------------- HASH FUNCTION ----------------
def generate_file_hash(file):
    file.stream.seek(0)
    hash_md5 = hashlib.md5()
    for chunk in iter(lambda: file.stream.read(4096), b""):
        hash_md5.update(chunk)
    file.stream.seek(0)
    return hash_md5.hexdigest()






#  ---------------- ADD CONFIDENCE CALCULATION ----------------


def calculate_confidence(text):
    if not text.strip():
        return 0


    words = text.split()
    valid_words = [w for w in words if w.isalpha()]


    confidence = (len(valid_words) / len(words)) * 100
    return round(confidence, 2)




# ---------------- UPLOAD API ----------------
@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400


    file = request.files["file"]
    file_hash = generate_file_hash(file)


    if collection.find_one({"file_hash": file_hash}):
        return jsonify({"status": "duplicate"}), 409


    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)


    text = ""


    if file.filename.lower().endswith(".pdf"):
        pages = convert_from_path(filepath)
        for page in pages:
            text += pytesseract.image_to_string(page)
            file_type = "PDF"
    else:
        text = pytesseract.image_to_string(Image.open(filepath))
        file_type = "IMAGE"
   
    confidence = calculate_confidence(text)






    # ✅ ADD HERE
    doc_type = detect_document_type(text)
    dynamic_fields = extract_dynamic_fields(text)


    # ---------- DOCUMENT ----------
    doc = {
        "filename": file.filename,
        "file_hash": file_hash,
        "file_type": file_type,
        "user_id": request.form.get("user_id"),  # ✅ ADD THIS
        "confidence": confidence,
        "document_type": doc_type,
        "raw_text": text,
        "fields": dynamic_fields,     # ✅ EXTRACTED
        "created_at": datetime.now()
    }


    # ---------- SAVE ----------
    result = collection.insert_one(doc)


    # ---------- RESPONSE ----------
    return jsonify({
        "id": str(result.inserted_id),   # 🔥 VERY IMPORTANT
        "filename": file.filename,
        "confidence": confidence,
        "raw_text": text,                 # ✅ RAW OCR OUTPUT
        "fields": dynamic_fields
    })


# ---------------- DOCUMENT LIST ----------------
@app.route("/documents", methods=["GET"])
def get_documents():
    docs = collection.find().sort("created_at", -1)


    result = []
    for d in docs:
        result.append({
            "id": str(d["_id"]),        # 🔥 VERY IMPORTANT
            "filename": d["filename"],
            "created_at": d["created_at"]
        })


    return jsonify(result)




# ---------------- SINGLE DOCUMENT ----------------
@app.route("/document/<id>", methods=["GET"])
def get_single_document(id):
    doc = collection.find_one({"_id": ObjectId(id)})


    if not doc:
        return jsonify({"error": "Not found"}), 404


    return jsonify({
    "id": str(doc["_id"]),
    "filename": doc["filename"],
    "fields": doc.get("fields", {}),
    "raw_text": doc.get("raw_text") or doc.get("text") or "",
    "created_at": doc["created_at"]
})








# ---------------- REPROCESS ----------------
@app.route("/reprocess/<id>", methods=["GET"])
def reprocess(id):
    doc = collection.find_one({"_id": ObjectId(id)})
    if not doc:
        return jsonify({"error": "Not found"}), 404


    new_fields = extract_dynamic_fields(
    doc["text"],
    doc["document_type"].strip().lower()
    )


    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"fields": new_fields}}
    )


    return jsonify({
        "status": "success",
        "id": str(doc["_id"]),
        "filename": doc["filename"],
        "raw_text": doc["text"],     # ✅ SEND RAW OCR
        "fields": new_fields
    })




#  ---------------- ANALYTICS API  ----------------


@app.route("/analytics", methods=["GET"])
def analytics():
    total_docs = collection.count_documents({})


    pdf_count = collection.count_documents({"file_type": "PDF"})
    image_count = collection.count_documents({"file_type": "IMAGE"})


    last_doc = collection.find().sort("created_at", -1).limit(1)
    last_upload = "N/A"


    confidences = []


    for d in collection.find():
        if "confidence" in d:
            confidences.append(d["confidence"])


    avg_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 0


    for d in last_doc:
        last_upload = d["created_at"].strftime("%d %b %Y")


    return jsonify({
        "total_documents": total_docs,
        "pdf_files": pdf_count,
        "image_files": image_count,
        "average_confidence": avg_confidence,
        "last_upload": last_upload
    })


# ---------------- UPDATE FIELDS ----------------
@app.route("/update/<id>", methods=["POST"])
def update_document(id):
    data = request.json


    if not data or "fields" not in data:
        return jsonify({"error": "No data provided"}), 400


    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"fields": data["fields"]}}
    )


    return jsonify({"status": "updated"})




# ---------------- DELETE SINGLE DOCUMENT ----------------
@app.route("/document/<id>", methods=["DELETE"])
def delete_document(id):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})


        if result.deleted_count == 0:
            return jsonify({"error": "Document not found"}), 404


        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# ---------------- DELETE ALL DOCUMENTS ----------------
@app.route("/documents", methods=["DELETE"])
def delete_all_documents():


    collection.delete_many({})
    return jsonify({"status": "all documents deleted"})



# ---------------- Admin user access ----------------


# ---------------- ADMIN USERS ----------------
@app.route("/admin/users", methods=["GET"])
def get_users():
    print("🔥 Admin users API called")  # DEBUG

    try:
        users_collection = client["datavision"]["users"]

        users = users_collection.find()

        result = []
        for user in users:
            result.append({
                "id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role", "user")
            })

        return jsonify({"users": result})



    except Exception as e:
        return jsonify({"message": str(e)}), 500



# ---------------- RUN ----------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))

