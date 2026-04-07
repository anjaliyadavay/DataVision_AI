# from paddleocr import PaddleOCR
# import re

# ocr = PaddleOCR(use_angle_cls=True, lang="en")

# def extract_table_data(image_path):
#     result = ocr.ocr(image_path, cls=True)

#     rows = []
#     for line in result[0]:
#         text = line[1][0]
#         rows.append(text.lower())

#     data = {}

#     for i, row in enumerate(rows):
#         # ---- TOTAL ----
#         if "total" in row:
#             amt = re.search(r"[$€£]?\d{1,3}(?:,\d{3})*(?:\.\d{2})?", row)
#             if amt:
#                 data["Total Amount"] = amt.group()

#         # ---- DISCOUNT ----
#         if "discount" in row:
#             amt = re.search(r"[-]?\s*[$€£]\s?\d+(?:,\d{3})*(?:\.\d{2})?", row)
#             pct = re.search(r"\d+\s*%", row)

#             if amt:
#                 data["Discount"] = amt.group().replace(" ", "")
#             elif pct:
#                 data["Discount"] = pct.group()

#     return data
