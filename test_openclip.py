import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from backend.models.openclip.image_embedder import processImageEmbedding
import requests
from PIL import Image
import io

# ✅ Reliable image URL + headers
url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
}

print("📥 Downloading image...")
response = requests.get(url, headers=headers, timeout=10)

if response.status_code != 200:
    raise Exception(f"❌ Download failed. Status: {response.status_code} - {response.reason}")

image_bytes = response.content

print("🖼️ Validating image...")
try:
    img = Image.open(io.BytesIO(image_bytes))
    img.verify()
    img = Image.open(io.BytesIO(image_bytes))
    print(f"✅ Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
except Exception as e:
    raise Exception(f"❌ Invalid image: {str(e)}")

print("🧠 Generating embedding...")
embedding = processImageEmbedding(image_bytes)

print("🎉 SUCCESS!")
print(f"📏 Embedding length: {len(embedding)}")
print(f"🔢 First 5 values: {embedding[:5]}")
