def detect_document_type(text):
    t = text.lower()

    # 📚 LIBRARY / TABLE DETECTION (ADD THIS)
    if (
        "accession" in t and
        "call number" in t and
        "author" in t and
        "publisher" in t
    ):
        return "Library"

    # 🧾 Invoice
    if "invoice" in t or "gst" in t or "tax invoice" in t:
        return "invoice"

    # 🧾 Receipt
    if "receipt" in t or "paid" in t:
        return "Receipt"

    # 🎟 Voucher
    if "voucher" in t or "coupon" in t or "discount" in t:
        return "Voucher"

    # 📜 Certificate
    if "certificate" in t:
        return "Certificate"

    # 🎓 College Form
    if "roll" in t or "enrollment" in t or "admission" in t:
        return "College_Form"

    # 🪪 ID Card
    if "id card" in t or "employee id" in t:
        return "ID_Card"

    return "Unknown"
