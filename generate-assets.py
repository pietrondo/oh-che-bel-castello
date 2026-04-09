from openai import OpenAI
import os

client = OpenAI(
    api_key="sk-cv-7996507538f446c69cad3f96c6637ee3",
    base_url="https://api.openadapter.in"
)

assets = [
    ("keep", "Medieval royal castle keep, stone fortress with towers, top down view, game asset, clean stylized 2D sprite"),
    ("farm", "Medieval farm with wheat fields and barn, top down view, game asset, clean stylized 2D sprite"),
    ("windmill", "Medieval windmill with rotating blades, top down view, game asset, clean stylized 2D sprite"),
    ("cathedral", "Medieval cathedral church with cross and stained glass, top down view, game asset, clean stylized 2D sprite"),
    ("university", "Medieval university with books and scrolls, top down view, game asset, clean stylized 2D sprite"),
    ("blacksmith", "Medieval blacksmith forge with anvil and hammer, top down view, game asset, clean stylized 2D sprite"),
    ("house", "Medieval peasant house with thatched roof, top down view, game asset, clean stylized 2D sprite"),
    ("barracks", "Medieval military barracks with weapons and shields, top down view, game asset, clean stylized 2D sprite"),
    ("lumber_mill", "Medieval lumber mill with saw and logs, top down view, game asset, clean stylized 2D sprite"),
    ("stone_quarry", "Medieval stone quarry with blocks and tools, top down view, game asset, clean stylized 2D sprite"),
]

os.makedirs("public/assets/buildings", exist_ok=True)

for name, prompt in assets:
    print(f"Generating {name}...")
    try:
        response = client.images.generate(
            model="qwen-image-2512",
            prompt=prompt,
            n=1,
            size="512x512",
        )
        image_url = response.data[0].url
        print(f"  URL: {image_url}")
        
        import requests
        img_data = requests.get(image_url).content
        with open(f"public/assets/buildings/{name}.png", 'wb') as f:
            f.write(img_data)
        print(f"  Saved to public/assets/buildings/{name}.png")
    except Exception as e:
        print(f"  Error: {e}")

print("\nDone!")
