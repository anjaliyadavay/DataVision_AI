import cv2
import pytesseract

def preprocess_image(image_path):
    img = cv2.imread(image_path)

    # 1. Resize (improves accuracy)
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 2. Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Remove noise
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 4. Threshold (black-white)
    thresh = cv2.threshold(
        blur, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    return thresh


def extract_text(image_path):
    processed = preprocess_image(image_path)

    custom_config = r'--oem 3 --psm 6'

    text = pytesseract.image_to_string(
        processed,
        config=custom_config
    )

    return text
