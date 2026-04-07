# import re


# def extract_dynamic_fields(text, doc_type=None):

#     data = {}

#     # ===================== CLEAN TEXT =====================
#     text = text.replace("\r", "\n")
#     text = re.sub(r"\s+", " ", text)
#     text = re.sub(
#         r"(INVOICE|RECEIPT|PURCHASE|STATEMENT|PRESCRIPTION|TOTAL|SUBTOTAL|AMOUNT|DATE|ID|ROLL|ACCOUNT)",
#         r"\n\1",
#         text,
#         flags=re.I,
#     )

#     lines = [l.strip() for l in text.split("\n") if l.strip()]
#     full_text = text.upper()

#     # ======================================================
#     # ===================== COMMON FIELDS ==================
#     # ======================================================

#     # Date
#     date_match = re.search(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", text)
#     if date_match:
#         data["Date"] = date_match.group()

#     # Phone
#     phone_match = re.search(r"\b\d{10}\b", text)
#     if phone_match:
#         data["Phone"] = phone_match.group()

#     # Email
#     email_match = re.search(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", text)
#     if email_match:
#         data["Email"] = email_match.group()

#     # GST
#     gst_match = re.search(
#         r"\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b", full_text
#     )
#     if gst_match:
#         data["GST Number"] = gst_match.group()

#     # ======================================================
#     # ===================== DOCUMENT TYPES =================
#     # ======================================================

#     if doc_type:
#         doc_type = doc_type.lower()

# # ---------------- INVOICE ----------------
# if doc_type and doc_type.lower() == "invoice":

#     # -------- Invoice Number --------
#     inv_no = re.search(
#         r"invoice\s*no\.?\s*[:#]?\s*#?\s*([\d ]+)",
#         text,
#         re.I
#     )
#     if inv_no:
#         clean_no = inv_no.group(1).replace(" ", "")
#         data["Invoice No"] = clean_no

#     # -------- Date --------
#     date_match = re.search(
#         r"\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{2,4}",
#         text
#     )
#     if date_match:
#         clean_date = re.sub(r"\s+", "", date_match.group())
#         data["Date"] = clean_date

#     # -------- Due Date --------
#     due_match = re.search(
#         r"due\s*date\s*[:\-]?\s*(\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{2,4})",
#         text,
#         re.I
#     )
#     if due_match:
#         clean_due = re.sub(r"\s+", "", due_match.group(1))
#         data["Due Date"] = clean_due

#     # -------- Total / Subtotal --------
#     total = re.search(
#         r"(subtotal|total)[^\d]*\$?\s*([\d,]+\.\d{2})",
#         text,
#         re.I
#     )
#     if total:
#         data["Total Amount"] = total.group(2)

#     # -------- Phone (10–12 digits) --------
#     phone = re.search(r"\b\d{10,12}\b", text)
#     if phone:
#         data["Phone"] = phone.group()


#     # ================= TABLE EXTRACTION =================
#     table_pattern = r"(\d+)\s+\$?(\d+)\s+\$?(\d+)"
#     matches = re.findall(table_pattern, text)

#     items = []
#     for match in matches:
#         quantity, price, amount = match
#         items.append({
#             "Quantity": quantity,
#             "Price": price,
#             "Amount": amount
#         })

#     if items:
#         data["Items"] = items


#     # ---------------- RECEIPT ----------------
#     elif doc_type == "retail receipt":

#         total = re.search(r"total\s*\$?\s*([\d,]+\.\d{2})", text, re.I)
#         if total:
#             data["Total Paid"] = total.group(1)

#     # ---------------- PURCHASE ORDER ----------------
#     elif doc_type == "purchase order":

#         po_no = re.search(r"(po|purchase order)\s*no\.?\s*[:#]?\s*([\w-]+)", text, re.I)
#         if po_no:
#             data["PO Number"] = po_no.group(2)

#     # ---------------- STUDENT ADMISSION ----------------
#     elif doc_type == "student admission":

#         name = re.search(r"name\s*[:\-]?\s*([A-Za-z ]+)", text, re.I)
#         if name:
#             data["Student Name"] = name.group(1).strip()

#         roll = re.search(r"(roll|registration)\s*no\.?\s*[:\-]?\s*([\w\d-]+)", text, re.I)
#         if roll:
#             data["Roll No"] = roll.group(2)

#     # ---------------- ID CARD ----------------
#     elif doc_type == "id card":

#         id_no = re.search(r"id\s*no\.?\s*[:\-]?\s*([\w\d-]+)", text, re.I)
#         if id_no:
#             data["ID Number"] = id_no.group(1)

#         name = re.search(r"name\s*[:\-]?\s*([A-Za-z ]+)", text, re.I)
#         if name:
#             data["Name"] = name.group(1).strip()

#     # ---------------- BANK STATEMENT ----------------
#     elif doc_type == "bank statement":

#         acc = re.search(r"account\s*no\.?\s*[:\-]?\s*([\d]+)", text, re.I)
#         if acc:
#             data["Account Number"] = acc.group(1)

#         balance = re.search(r"(closing balance|available balance)\s*[:\-]?\s*\$?([\d,]+\.\d{2})", text, re.I)
#         if balance:
#             data["Balance"] = balance.group(2)

#     # ---------------- MEDICAL PRESCRIPTION ----------------
#     elif doc_type == "medical prescription":

#         patient = re.search(r"patient\s*name\s*[:\-]?\s*([A-Za-z ]+)", text, re.I)
#         if patient:
#             data["Patient Name"] = patient.group(1)

#         doctor = re.search(r"dr\.?\s*([A-Za-z ]+)", text, re.I)
#         if doctor:
#             data["Doctor"] = doctor.group(1)

#     # ======================================================
#     # ================= TABLE FORMAT OUTPUT ================
#     # ======================================================

#     return data

import re


def extract_dynamic_fields(text, doc_type=None):

    data = {}

    # Preserve original text BEFORE cleaning
    original_text = text

# Normalize line endings
    text = text.replace("\r", "\n")
    clean_text = re.sub(r"\s+", " ", text)


    full_text = text.upper()

    # Normalize doc_type
    if doc_type:
        doc_type = doc_type.lower()

    # ======================================================
    # ===================== COMMON FIELDS ==================
    # ======================================================

    # Date (flexible with spaces)
    # Step 1: If DOB not found → try labeled Date
    # ---------- DOB ----------
    dob = re.search(
       r"(?:d[\.\s]*[o0][\.\s]*b|date\s*of\s*birth)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
       text,
       re.I
    )

    if dob:
     data["DOB"] = dob.group(1)


# ---------- DATE ----------
    if "DOB" not in data:
        date_match = re.search(
        r"(?:date|Date|DATE)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s*[A-Za-z]+,?\s*\d{4})",
        text,
        re.I
    )

        if date_match:
          data["Date"] = re.sub(r"\s+", " ", date_match.group(1))


# ---------- FALLBACK ----------
    if "Date" not in data and "DOB" not in data:
     date_match = re.search(
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        text
    )

     if date_match:
       data["Date"] = date_match.group()


    
#     phone = None

#     # 1️⃣ Priority: with "ph" or "phone"
#     match = re.search(
#     r"(?:ph|phone|tel|CONTACT)\s*[:\-]?\s*(\d{2,4}[-\s]?\d{6,8}|\d{3}[-\s]\d{3}[-\s]\d{4}|\d{10})",
#     text,
#     re.IGNORECASE
#      )

#     if match:
#       phone = match.group(1)

#      # 2️⃣ Fallback: general formats (only if above not found)
#     if not phone:
#      match = re.search(
#         r"\b\d{3}[-\s]\d{3}[-\s]\d{4}\b|\b\d{10}\b",
#         text
#     )
#     if match:
#         phone = match.group()

# # 3️⃣ Save result
#     if phone:
#      data["Phone"] = phone


    phone = None

# ================= PRIORITY (WITH LABEL) =================
    match = re.search(
    r"(?:phone|ph|tel|contact)\s*[:\-]?\s*([\+\d][\d\s\-]{8,15})",
    text,
    re.IGNORECASE
)

    if match:
     raw = match.group(1)
     phone = re.sub(r"\D", "", raw)


# ================= FALLBACK (ALL FORMATS) =================
    if not phone:
     match = re.search(
        r"\+?\d{1,3}[\s\-]?\d{5}[\s\-]?\d{5}|"   # +91 85911 65541
        r"\b\d{5}[\s\-]\d{5}\b|"                # 85911 65541
        r"\b\d{2}[\s\-]\d{3}[\s\-]\d{2}[\s\-]\d{3}\b|"  # 85 911 65 541
        r"\b\d{3}[-\s]\d{3}[-\s]\d{4}\b|"       # 123-456-7890
        r"\b\d{2,4}[-]\d{6,8}\b|"               # 022-12345678
        r"\b\d{10}\b",                         # 1234567890
        text
    )

    if match:
        raw = match.group()
        phone = re.sub(r"\D", "", raw)


# ================= REMOVE COUNTRY CODE =================
    if phone and len(phone) == 12 and phone.startswith("91"):
     phone = phone[2:]


# ================= FINAL SAVE =================
    if phone and len(phone) == 10:
     data["Phone"] = phone


    
    # 🔥 Fix OCR spacing
    text = re.sub(r"\s*@\s*", "@", text)

# ================= EMAIL =================
    email_match = re.search(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
    text
)

    email_domain = None

    if email_match:
     email = email_match.group()
     data["Email"] = email

    # Extract domain from email
     email_domain = email.split("@")[-1].lower()


# ================= WEBSITE =================

# Remove email from text
    clean_text = re.sub(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
    "",
    text
)

    website_match = re.search(
    r"\b(?:https?://|www\.)[A-Za-z0-9-]+\.[A-Za-z]{2,}\b",
    clean_text,
    re.I
)

    if website_match:
     website = website_match.group().lower()

    # ❌ Ignore if same as email domain
     if website != email_domain:
        data["Website"] = website






    # GST
    gst_match = re.search(
        r"\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b", full_text
    )
    if gst_match:
        data["GST Number"] = gst_match.group()

    # ======================================================
    # ===================== DOCUMENT TYPES =================
    # ======================================================

    # ---------------- INVOICE ----------------
    if doc_type == "invoice":
    
        # Invoice Number
        inv_no = re.search(
            r"invoice\s*no\.?\s*[:#]?\s*#?\s*([\d ]+)",
            text,
            re.I
        )
        if inv_no:
            clean_no = inv_no.group(1).replace(" ", "")
            data["Invoice No"] = clean_no
        

        # -------- Billed To (Name Only) --------
#     billed_match = re.search(
#     r"billed\s*to\s*[:\-]?\s*([A-Za-z ]{3,})",
#     text,
#     re.I
# )

#     if billed_match:
#       billed_name = billed_match.group(1).strip()

#     billed_name = re.split(
#         r"invoice|date|due|subtotal|total",
#         billed_name,
#         flags=re.I
#     )[0].strip()

#     data["Billed To"] = billed_name

# -------- Billed To (Name Only) --------
    billed_name = ""   # ALWAYS define first

    billed_match = re.search(
    r"billed\s*to\s*[:\-]?\s*([A-Za-z ]{3,})",
    text,
    re.I
)

    if billed_match:
     billed_name = billed_match.group(1).strip()

    billed_name = re.split(
        r"invoice|date|due|subtotal|total",
        billed_name,
        flags=re.I
    )[0].strip()

    if billed_name:
        data["Billed To"] = billed_name



# # -------- From (Name Only) --------
#     from_match = re.search(
#         r"from\s*[:\-]?\s*([A-Za-z ]{3,})",
#         text,
#          re.I
# )

#     from_name = ""   # Always define first (VERY IMPORTANT)

#     if from_match:
#       from_name = from_match.group(1).strip()

#     from_name = re.split(
#         r"invoice|date|due|subtotal|total|billed",
#         from_name,
#         flags=re.I
#     )[0].strip()

#     if from_name:
#      data["From"] = from_name

#     # Remove extra words like Invoice, Date, etc.
#     billed_name = re.split(r"invoice|date|due|subtotal|total", billed_name, flags=re.I)[0].strip()

#     data["Billed To"] = billed_name


    # Normalize text first (VERY IMPORTANT for OCR)
    clean_text = re.sub(r"\s+", " ", text)

    # Due Date Extraction
    due_match = re.search(
    r"(?i)due\s*-?\s*date\s*[:\-]?\s*(\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{2,4})",
    clean_text
)

    if due_match:
        clean_due = re.sub(r"\s+", "", due_match.group(1))
        data["Due Date"] = clean_due

# -------- Professional Total Detection --------
    currency_symbols = r"[\$₹€£]?"

    total_matches = re.findall(
       rf"(subtotal|total)[^\d]*{currency_symbols}\s*([\d,]+(?:\.\d{{1,2}})?)",
       text,
        re.I
)

    if total_matches:
    # Always take the LAST total (usually final payable amount)
      final_total = total_matches[-1][1]

    # Remove commas
      final_total = final_total.replace(",", "")

      data["Total Amount"] = float(final_total)





    # ---------------- RECEIPT ----------------
    elif doc_type == "retail receipt":

        total = re.search(r"total\s*\$?\s*([\d,]+\.\d{2})", text, re.I)
        if total:
            data["Total Paid"] = total.group(1)
        # ---------- Receipt Number ----------
    receipt_no = re.search(
        r"(receipt\s*(no|#))\s*[:\-]?\s*([\d]+)",
        text,
        re.I,
    )
    if receipt_no:
        data["Receipt Number"] = receipt_no.group(3)

# ------------------- time 
# 🔥 Clean OCR text
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)

    time_value = None

# 1️⃣ FULL TIME RANGE (with label)
    time_match = re.search(
    r"time\s*[:\-]?\s*(\d{1,2}:\d{2}\s*(?:AM|PM)\s*(?:to|-)\s*\d{1,2}:\d{2}\s*(?:AM|PM))",
    text,
    re.I
)

    if time_match:
     time_value = time_match.group(1)

# 2️⃣ SINGLE TIME WITH LABEL
    if not time_value:
     single_time_label = re.search(
        r"time\s*[:\-]?\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))",
        text,
        re.I
    )
     if single_time_label:
        time_value = single_time_label.group(1)

# 3️⃣ ANY SINGLE TIME (NO LABEL)  🔥 IMPORTANT FIX
     if not time_value:
      single_time = re.search(
        r"\b\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b",
        text,
        re.I
    )
     if single_time:
        time_value = single_time.group()

# ✅ SAVE
    if time_value:
     data["Time"] = time_value



    # ---------- Cashier ----------
    cashier = re.search(
        r"cashier\s*[:\-]?\s*([A-Za-z ]+)",
        text,
        re.I
    )
    if cashier:
        data["Cashier"] = cashier.group(1).strip()


       # ---------- Payment Mode ----------
    payment = re.search(
        r"(paid by|payment mode)[^\w]*(cash|card|credit card|debit card|upi)",
        text,
        re.I
    )
    if payment:
        data["Payment Mode"] = payment.group(2)

       # ---------- Store Name ----------
    store = re.search(r"^([A-Z ]{3,})", text, re.MULTILINE)
    if store:
        data["Name"] = store.group(1).strip()


        
        

    # ---------------- PURCHASE ORDER ----------------
    elif doc_type == "purchase order":

        po_no = re.search(
            r"(po|purchase order)\s*no\.?\s*[:#]?\s*([\w-]+)",
            text,
            re.I
        )
        if po_no:
            data["PO Number"] = po_no.group(2)

    # ---------------- STUDENT ADMISSION ----------------
    elif doc_type == "student admission":

        # name = re.search(r"name\s*[:\-]?\s*([A-Za-z ]+)", text, re.I)
        # if name:
        #     data["Student Name"] = name.group(1).strip()

        roll = re.search(
            r"(roll|registration)\s*no\.?\s*[:\-]?\s*([\w\d-]+)",
            text,
            re.I
        )
        if roll:
            data["Roll No"] = roll.group(2)





    # ---------- ID Card ----------


    elif doc_type == "id card":



    # ---------- ID NUMBER ----------
     id_no = re.search(
        r"(id\s*no|id|roll\s*no|emp\s*id|student\s*id)\s*[:\-]?\s*([\w\d-]+)",
        text,
        re.I
    )
     if id_no:
        data["ID Number"] = id_no.group(2)

    # ---------- GENDER ----------
    gender = re.search(
        r"\b(male|female|other)\b",
        text,
        re.I
    )
    if gender:
        data["Gender"] = gender.group(1).capitalize()



# ---------- COURSE ----------
    
    course = re.search(
       r"course\s*[:\-]?\s*(.+)",
    text,
    re.I
)

    if course:
     clean_course = course.group(1)

    # Stop at next field (important for OCR)
     clean_course = re.split(
        r"\b(name|dob|date|id|no|gender|phone|email)\b",
        clean_course,
        flags=re.I
    )[0].strip()

     data["Course"] = clean_course


    # # ---------- ORGANIZATION ----------
    # org = re.search(
    #     r"(college|university|company|school)\s*[:\-]?\s*([A-Za-z ]+)",
    #     text,
    #     re.I
    # )
    # if org:
    #     data["Organization"] = org.group(2).strip()







    # ---------------- Poster  ----------------

# ---------------- POSTER / FLYER ----------------
    elif doc_type == "poster":

    # ---------- TITLE (Big Heading) ----------
     lines = text.split("\n")
     for line in lines:
        if len(line.strip()) > 5 and line.isupper():
            data["Title"] = line.strip()
            break

    # ---------- EVENT NAME ----------
    event = re.search(
    r"(festival.*?|concert.*?|party.*?|event.*?)(?=\d{1,2}\s*[A-Za-z]|central|ticket|www|$)",
    text,
    re.I
)

    if event:
     clean_event = event.group(1).strip()
     data["Event"] = clean_event


    # ---------- DATE ----------
    date = re.search(
        r"\b\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}",
        text,
        re.I
    )
    if date:
        data["Date"] = date.group()

    # ---------- TIME ----------
    # time = re.search(
    #     r"\d{1,2}:\d{2}\s*(AM|PM)",
    #     text,
    #     re.I
    # )
    # if time:
    #     data["Time"] = time.group()

    # ---------- LOCATION ----------
    location = re.search(
    r"(central park|beach|club|road|nagar|delhi|mumbai|chennai)",
    text,
    re.I
)

    if location:
     data["Location"] = location.group(1).strip()


    # ---------- PRICE / OFFER ----------
    price = re.search(
        r"\$\d+|\d+\s*%|\d+\s*rs",
        text,
        re.I
    )
    if price:
        data["Price / Offer"] = price.group()

    # # ---------- WEBSITE ----------
    # website = re.search(
    #     r"(www\.[\w\.]+)",
    #     text,
    #     re.I
    # )
    # if website:
    #     data["Website"] = website.group()

    # ---------- PHONE ----------
    phone = re.search(r"\b\d{10}\b", text)
    if phone:
        data["Phone"] = phone.group()




    # ---------------- BANK STATEMENT ----------------
    elif doc_type == "bank statement":

     acc = re.search(
            r"account\s*no\.?\s*[:\-]?\s*([\d]+)",
            text,
            re.I
        )
     if acc:
            data["Account Number"] = acc.group(1)

    balance = re.search(
            r"(closing balance|available balance)\s*[:\-]?\s*\$?([\d,]+\.\d{2})",
            text,
            re.I
        )
    if balance:
            data["Balance"] = balance.group(2)

    # ---------------- MEDICAL PRESCRIPTION ----------------
    elif doc_type == "medical prescription":

        patient = re.search(
            r"patient\s*name\s*[:\-]?\s*([A-Za-z ]+)",
            text,
            re.I
        )
        if patient:
            data["Patient Name"] = patient.group(1)

        doctor = re.search(r"dr\.?\s*([A-Za-z ]+)", text, re.I)
        if doctor:
            data["Doctor"] = doctor.group(1)

    # # ================= SMART ADDRESS EXTRACTION =================

    # address_lines = []
    # capture = False

    # # Split using comma also because OCR removes line breaks
    # raw_parts = re.split(r",|\n", text)

    # for part in raw_parts:
    #     line = part.strip()

    #     # Start capturing if line contains keywords OR pin code
    #     if re.search(r"(road|rd|street|st|nagar|colony|lane|chawl|pool|mumbai|delhi|india|\d{6})", line, re.I):
    #         capture = True

    #     if capture:
    #         # Stop conditions
    #         if re.search(r"(phone|email|invoice|total|amount|date|gst|signature)", line, re.I):
    #             break

    #         address_lines.append(line)

    #         # Stop if PIN code found
    #         if re.search(r"\d{6}", line):
    #             break

    # if address_lines:
    #     data["Address"] = ", ".join(address_lines)



# ================= SMART ADDRESS EXTRACTION =================

    address_match = re.search(
    r"(?:add|address)\s*[:\-]?\s*(.+)",
    text,
    re.I
)

    if address_match:
     address = address_match.group(1)

    # 🔥 Stop at unwanted words
     address = re.split(
        r"\b(phone|email|invoice|total|amount|date|gst|signature|account|bank|item|payment|from)\b",
        address,
        flags=re.I
    )[0]

    # 🔥 Clean extra symbols
     address = address.strip(" ,.-")

     data["Address"] = address



    return data
