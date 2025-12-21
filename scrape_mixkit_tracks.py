import requests
from bs4 import BeautifulSoup

URL = "https://mixkit.co/free-stock-music/ambient/"
N = 60

resp = requests.get(URL)
soup = BeautifulSoup(resp.text, "html.parser")
tracks = []
for card in soup.select(".js-track-card"):
    title = card.select_one(".card__title")
    artist = card.select_one(".card__artist")
    audio = card.select_one("audio")
    if title and artist and audio and audio.has_attr("src"):
        tracks.append({
            "title": title.text.strip(),
            "artist": artist.text.replace("By ", "").strip(),
            "url": audio["src"].strip()
        })

with open("matrix_tracks_snippet.txt", "w", encoding="utf-8") as f:
    for t in tracks[:N]:
        f.write(f'{{ title: "{t["title"]}", artist: "{t["artist"]}", url: "{t["url"]}" }},\n')
print(f"Wrote {len(tracks[:N])} tracks to matrix_tracks_snippet.txt")
