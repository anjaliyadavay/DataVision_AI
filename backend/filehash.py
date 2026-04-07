# filehash.py
import hashlib

def generate_file_hash(file):
    hasher = hashlib.sha256()
    file.stream.seek(0)

    while chunk := file.stream.read(8192):
        hasher.update(chunk)

    file.stream.seek(0)
    return hasher.hexdigest()
