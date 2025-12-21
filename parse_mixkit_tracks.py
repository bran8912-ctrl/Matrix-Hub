import re
import os

# This script will read the Mixkit output from /tmp/matrix_new_tracks.txt and print out JS objects for playlist use.
# Run this in your devcontainer after fetching the tracks.

SRC = "/tmp/matrix_new_tracks.txt"
N = 60

def main():
    if not os.path.exists(SRC):
        print(f"File not found: {SRC}")
        return
    with open(SRC, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip()]
    for i, line in enumerate(lines[:N]):
        parts = line.split("|")
        if len(parts) == 3:
            title, artist, url = [p.strip() for p in parts]
            print(f'{{ title: "{title}", artist: "{artist}", url: "{url}" }},')
        else:
            print(f"// Could not parse: {line}")

if __name__ == "__main__":
    main()
