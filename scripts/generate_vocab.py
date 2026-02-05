import csv
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "scripts" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

ECDICT_URL = "https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv"

WORD_LIMIT = 30000
STAGES = [
    (1, 1000),
    (2, 2000),
    (3, 2000),
    (4, 5000),
    (5, 20000),
]

WORD_PATTERN = re.compile(r"^[a-zA-Z][a-zA-Z\-']+$")


def download(url: str, dest: Path) -> None:
    if dest.exists():
        return
    print(f"Downloading {url} ...")
    with urllib.request.urlopen(url) as resp:
        dest.write_bytes(resp.read())


def load_wordfreq(limit: int) -> list[str]:
    try:
        from wordfreq import top_n_list
    except Exception as exc:
        raise RuntimeError("wordfreq is required. Please install with: pip install wordfreq") from exc

    words = []
    for word in top_n_list("en", limit * 2):
        if WORD_PATTERN.match(word):
            words.append(word)
        if len(words) >= limit:
            break
    return words


def load_ecdict(path: Path) -> dict:
    entries = {}
    with path.open("r", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            word = row.get("word")
            if not word:
                continue
            entries[word] = {
                "phonetic": row.get("phonetic") or "",
                "definition": row.get("definition") or "",
                "translation": row.get("translation") or "",
                "example": row.get("example") or "",
            }
    return entries


def pick_meaning(entry: dict) -> str:
    translation = (entry.get("translation") or "").strip()
    definition = (entry.get("definition") or "").strip()
    if translation:
        return translation
    if definition:
        return definition
    return ""


def build_vocab(words: list[str], ecdict: dict) -> dict:
    vocab = {}
    idx = 0
    for stage, count in STAGES:
        stage_words = []
        for _ in range(count):
            if idx >= len(words):
                break
            w = words[idx]
            idx += 1
            entry = ecdict.get(w, {})
            stage_words.append({
                "word": w,
                "phonetic": entry.get("phonetic", ""),
                "meaning": pick_meaning(entry),
                "example": "",
                "exampleCN": "",
            })
        vocab[stage] = stage_words
    return vocab


def main():
    ecdict_path = DATA_DIR / "ecdict.csv"

    download(ECDICT_URL, ecdict_path)

    words = load_wordfreq(WORD_LIMIT)
    if len(words) < WORD_LIMIT:
        print(f"Warning: only loaded {len(words)} words")

    ecdict = load_ecdict(ecdict_path)
    vocab = build_vocab(words, ecdict)

    output_path = ROOT / "vocabulary-data.js"
    meta = {
        "source": "wordfreq + ECDICT",
        "generated_at": "2026-02-05",
        "total_words": sum(len(v) for v in vocab.values()),
    }
    content = "// Auto-generated vocabulary data\n"
    content += f"// {json.dumps(meta, ensure_ascii=False)}\n\n"
    content += "const vocabularyData = " + json.dumps(vocab, ensure_ascii=False) + ";\n"

    output_path.write_text(content, encoding="utf-8")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
