#!/usr/bin/env python3
import json
import shutil
from pathlib import Path

# Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# Собираем все уникальные файлы
files_to_copy = set()
for section in menu['sections']:
    for item in section['items']:
        if item.get('photos'):
            for photo in item['photos']:
                files_to_copy.add(Path(photo).name)

print(f"Найдено {len(files_to_copy)} уникальных файлов в menu.json")

# Копируем
source = Path('/Users/kenda/menu/images')
target = Path('public/menu')
target.mkdir(parents=True, exist_ok=True)

copied = 0
for fname in sorted(files_to_copy):
    src_file = source / fname
    tgt_file = target / fname
    
    if src_file.exists():
        shutil.copy2(src_file, tgt_file)
        copied += 1
        print(f"✓ {fname}")
    else:
        print(f"✗ {fname} (не найден)")

print(f"\nСкопировано: {copied} из {len(files_to_copy)}")

