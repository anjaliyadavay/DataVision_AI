@app.route("/documents", methods=["GET"])
def get_documents():
    docs = collection.find()

    documents = []
    for d in docs:
        documents.append({
            "id": str(d["_id"]),
            "filename": d["filename"],
            "created_at": d["created_at"]
        })

    return jsonify(documents)
