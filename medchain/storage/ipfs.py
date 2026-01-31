import requests
import os
import hashlib

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET = os.getenv("PINATA_SECRET")

def upload_to_ipfs(file):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET
    }

    files = {"file": file}

    response = requests.post(url, files=files, headers=headers)
    cid = response.json()["IpfsHash"]

    file.seek(0)
    file_hash = hashlib.sha256(file.read()).hexdigest()

    return cid, file_hash
