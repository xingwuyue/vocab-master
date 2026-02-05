import json
import os
import re
import time
from pathlib import Path
from typing import Dict, List

try:
    from openai import OpenAI
except Exception as exc:  # pragma: no cover
    raise RuntimeError("Missing openai package. Install: pip install openai") from exc

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "vocabulary-data.js"
OUT_PATH = ROOT / "vocabulary-data.cleaned.js"
STATE_PATH = ROOT / "scripts" / "clean_meanings_state.json"

MODEL = os.getenv("VOCAB_GPT_MODEL", "gpt-4o-mini")
BATCH_SIZE = int(os.getenv("VOCAB_GPT_BATCH", "50"))
SLEEP_SEC = float(os.getenv("VOCAB_GPT_SLEEP", "0.3"))

SYSTEM_PROMPT = """你是词典编辑。请把英文单词的释义清洗为“字典级、简洁、可直接背诵”的中文释义。
要求：
1) 只输出中文释义，不要多余解释。
2) 保持短句，优先一条核心义项。
3) 不要包含词性标记（n./v./adj.）或编号。
4) 若原始释义为空或太烂，写“暂无释义”。
"""

USER_TEMPLATE = """请清洗下列单词释义，输出 JSON 数组，对应输入顺序。
输入 JSON：{items}
输出 JSON 数组格式：[{{"word": "...", "meaning": "..."}}, ...]
"""


def load_vocab() -> Dict:
    raw = DATA_PATH.read_text(encoding="utf-8")
    match = re.search(r"const vocabularyData = (.*);", raw, re.S)
    if not match:
        raise ValueError("Could not parse vocabulary-data.js")
    return json.loads(match.group(1))


def save_vocab(vocab: Dict) -> None:
    meta = {
        "source": "wordfreq + ECDICT (cleaned by GPT)",
        "generated_at": time.strftime("%Y-%m-%d"),
        "total_words": sum(len(v) for v in vocab.values()),
        "model": MODEL,
    }
    content = "// Auto-generated vocabulary data\n"
    content += f"// {json.dumps(meta, ensure_ascii=False)}\n\n"
    content += "const vocabularyData = " + json.dumps(vocab, ensure_ascii=False) + ";\n"
    OUT_PATH.write_text(content, encoding="utf-8")


def load_state() -> Dict:
    if not STATE_PATH.exists():
        return {"done": {}}
    return json.loads(STATE_PATH.read_text(encoding="utf-8"))


def save_state(state: Dict) -> None:
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def chunk_items(items: List[Dict], size: int):
    for i in range(0, len(items), size):
        yield items[i:i+size]


def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Please set OPENAI_API_KEY to run this script.")

    client = OpenAI(api_key=api_key)
    vocab = load_vocab()
    state = load_state()

    for stage, words in vocab.items():
        stage_key = str(stage)
        done_idx = set(state.get("done", {}).get(stage_key, []))
        pending = [
            {"idx": i, "word": w["word"], "meaning": w.get("meaning", "")}
            for i, w in enumerate(words)
            if i not in done_idx
        ]
        if not pending:
            continue

        for batch in chunk_items(pending, BATCH_SIZE):
            items = [
                {"word": b["word"], "meaning": b["meaning"]}
                for b in batch
            ]
            prompt = USER_TEMPLATE.format(items=json.dumps(items, ensure_ascii=False))
            resp = client.responses.create(
                model=MODEL,
                input=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            )
            text = resp.output_text
            try:
                cleaned = json.loads(text)
            except Exception:
                # Try to extract JSON array
                m = re.search(r"\[(.*)\]", text, re.S)
                if not m:
                    raise ValueError(f"Invalid model output: {text[:200]}")
                cleaned = json.loads("[" + m.group(1) + "]")

            # Map cleaned meanings back
            for b, c in zip(batch, cleaned):
                vocab[stage][b["idx"]]["meaning"] = (c.get("meaning") or "暂无释义").strip()
                done_idx.add(b["idx"])

            state.setdefault("done", {})[stage_key] = sorted(done_idx)
            save_state(state)
            time.sleep(SLEEP_SEC)

    save_vocab(vocab)
    print(f"Wrote cleaned vocab to: {OUT_PATH}")


if __name__ == "__main__":
    main()
