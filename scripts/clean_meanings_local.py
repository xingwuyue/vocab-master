import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "vocabulary-data.js"
OUT_PATH = ROOT / "vocabulary-data.cleaned.js"

# 清洗规则 - 最终版：提取第一条简洁中文释义
def clean_meaning(raw: str) -> str:
    if not raw:
        return "暂无释义"
    
    # 1. 替换所有换行为空格，去掉 HTML 标签和反斜杠
    text = re.sub(r"<[^>]+>", "", raw)
    text = re.sub(r"\\", " ", text)  # 去掉反斜杠
    text = re.sub(r"\r?\n", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    
    # 2. 按分号或中文分号拆分
    parts = re.split(r"[;；]", text)
    parts = [p.strip() for p in parts if p.strip()]
    
    # 3. 优先找中文释义
    for p in parts:
        # 去掉词性前缀
        clean = re.sub(r"^(n|v|adj|adv|prep|conj|pron|det|art|int|interj)\.?\s*", "", p, flags=re.I)
        # 如果包含中文
        if re.search(r"[\u4e00-\u9fff]", clean):
            # 提取中文部分（到第一个英文词或标点前）
            match = re.search(r"([\u4e00-\u9fff][^a-zA-Z]*)", clean)
            if match:
                cn = match.group(1).strip()
                # 去掉末尾的逗号、句号等
                cn = re.sub(r"[，。！？；、]+$", "", cn)
                if cn and len(cn) <= 25:
                    return cn
    
    # 4. 如果没有中文，取第一条释义
    if parts:
        first = parts[0]
        first = re.sub(r"^(n|v|adj|adv|prep|conj|pron|det|art|int|interj)\.?\s*", "", first, flags=re.I)
        first = first.strip()
        if first:
            # 截断到第一个逗号或括号前
            first = re.split(r"[,\(]", first)[0].strip()
            if len(first) > 40:
                first = first[:37] + "..."
            return first
    
    return "暂无释义"


def main():
    # 读取原始数据
    raw = DATA_PATH.read_text(encoding="utf-8")
    match = re.search(r"const vocabularyData = (.*);", raw, re.S)
    if not match:
        print("❌ 无法解析 vocabulary-data.js")
        sys.exit(1)
    
    vocab = json.loads(match.group(1))
    
    # 清洗每个词条
    total = 0
    cleaned = 0
    for stage in vocab:
        for entry in vocab[stage]:
            total += 1
            old = entry.get("meaning", "")
            new = clean_meaning(old)
            if new != old:
                cleaned += 1
            entry["meaning"] = new
    
    print(f"[OK] 处理完成：{total} 个词条，{cleaned} 个被清洗")
    
    # 写入新文件
    meta = {
        "source": "wordfreq + ECDICT (cleaned by local rules)",
        "generated_at": "2026-02-06",
        "total_words": total,
        "cleaned_count": cleaned,
    }
    content = "// Auto-generated vocabulary data (cleaned)\n"
    content += f"// {json.dumps(meta, ensure_ascii=False)}\n\n"
    content += "const vocabularyData = " + json.dumps(vocab, ensure_ascii=False) + ";\n"
    
    OUT_PATH.write_text(content, encoding="utf-8")
    print(f"[FILE] 已写入：{OUT_PATH}")
    
    # 显示几个示例
    print("\n=== 清洗前后示例 ===")
    samples = []
    for stage in ["1", "2", "3"]:
        for entry in vocab[stage][:2]:
            samples.append((entry["word"], clean_meaning(entry.get("meaning", ""))))
    for word, meaning in samples[:6]:
        print(f"{word:<15} -> {meaning}")


if __name__ == "__main__":
    main()
