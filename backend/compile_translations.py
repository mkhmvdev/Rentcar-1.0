"""locale/ ichidagi .po fayllarni .mo ga kompilyatsiya qiladi.

Django'ning `compilemessages` buyrug'i GNU gettext (msgfmt) talab qiladi; bu skript esa
faqat Python bilan ishlaydi:  venv/bin/python compile_translations.py
"""

import ast
import pathlib
import struct

LOCALE_DIR = pathlib.Path(__file__).resolve().parent / "locale"


def parse_po(path):
    """[(msgctxt, msgid, msgid_plural, [msgstr...])] ro'yxatini qaytaradi."""
    entries, cur, key = [], {}, None

    def flush():
        if "msgid" in cur:
            strs = [cur[k] for k in sorted(k for k in cur if k.startswith("msgstr"))]
            entries.append((cur.get("msgctxt"), cur["msgid"], cur.get("msgid_plural"), strs))
        cur.clear()

    for raw in path.read_text(encoding="utf-8").splitlines() + [""]:
        line = raw.strip()
        if not line:
            flush()
            key = None
            continue
        if line.startswith("#"):
            continue
        if line.startswith('"'):
            cur[key] += ast.literal_eval(line)
            continue
        key, _, value = line.partition(" ")
        cur[key] = ast.literal_eval(value)
    flush()
    return entries


def write_mo(entries, path):
    pairs = []
    for ctx, msgid, plural, strs in entries:
        if not any(strs) and msgid:
            continue  # tarjima qilinmagan
        key = msgid if plural is None else f"{msgid}\0{plural}"
        if ctx:
            key = f"{ctx}\x04{key}"
        pairs.append((key.encode(), "\0".join(strs).encode()))
    pairs.sort()
    n = len(pairs)
    keys_start = 7 * 4
    values_start = keys_start + n * 8
    data_start = values_start + n * 8
    key_table, value_table, blob = [], [], b""
    for k, _ in pairs:
        key_table.append((len(k), data_start + len(blob)))
        blob += k + b"\0"
    for _, v in pairs:
        value_table.append((len(v), data_start + len(blob)))
        blob += v + b"\0"
    out = struct.pack("Iiiiiii", 0x950412DE, 0, n, keys_start, values_start, 0, 0)
    out += b"".join(struct.pack("ii", *t) for t in key_table)
    out += b"".join(struct.pack("ii", *t) for t in value_table)
    path.write_bytes(out + blob)


if __name__ == "__main__":
    for po in sorted(LOCALE_DIR.rglob("*.po")):
        entries = parse_po(po)
        write_mo(entries, po.with_suffix(".mo"))
        print(f"{po.relative_to(LOCALE_DIR)}: {len(entries)} ta yozuv")
