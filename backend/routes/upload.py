@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # -------- OCR --------
    if file.filename.lower().endswith(".pdf"):
        pages = convert_from_path(filepath, poppler_path=POPPLER_PATH)
        text = ""
        for page in pages:
            text += pytesseract.image_to_string(page)
    else:
        text = pytesseract.image_to_string(Image.open(filepath))

    # -------- Document type --------
    doc_type = detect_document_type(text)
    doc_type = doc_type.strip().lower() if doc_type else None

    # -------- TABLE extraction (FIRST) --------
    table_fields = extract_table_data(filepath)

    # -------- OCR extraction (SECOND) --------
    ocr_fields = extract_dynamic_fields(text, doc_type)

    # -------- MERGE (table wins) --------
    dynamic_fields = table_fields.copy()
    for key, value in ocr_fields.items():
        if key not in dynamic_fields:
            dynamic_fields[key] = value

    # -------- Save to DB --------
    doc_id = collection.insert_one({
        "filename": file.filename,
        "file_hash": generate_file_hash(file),
        "document_type": doc_type,
        "file_type": file_type,
        "confidence": confidence,
        "text": text,
        "fields": dynamic_fields,
        "created_at": datetime.now()
    }).inserted_id

    # -------- Response --------
    return jsonify({
        "status": "success",
        "id": str(doc_id),
        "filename": file.filename,
        "confidence": confidence,
        "document_type": doc_type,
        "fields": dynamic_fields,
        "raw_text": text
    })
