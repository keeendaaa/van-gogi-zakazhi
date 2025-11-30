#!/usr/bin/env python3
import json
import shutil
from pathlib import Path

# Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# Собираем все файлы
needed = set()
mapping = {}
for s in menu['sections']:
    for i in s['items']:
        if i.get('photos'):
            fname = Path(i['photos'][0]).name
            needed.add(fname)
            if i['name'] not in mapping:
                mapping[i['name']] = fname

# Копируем
src = Path('/Users/kenda/menu/images')
dst = Path('public/menu')
dst.mkdir(parents=True, exist_ok=True)

for fname in needed:
    if (src/fname).exists():
        shutil.copy2(src/fname, dst/fname)

# Проверяем реальные файлы
real_files = {f.stem: f.suffix for f in dst.glob('image*.*')}

# Обновляем imageMap.ts
content = """// Image map для всех блюд меню
// Локальные изображения из menu.json

const baseUrl = import.meta.env.BASE_URL || '/vangogi/';

const imageMapData: Record<string, string> = {
"""

for name, fname in sorted(mapping.items()):
    base = Path(fname).stem
    ext = real_files.get(base, Path(fname).suffix)
    fname = f"{base}{ext}"
    content += f"  '{name.replace(chr(39), chr(92)+chr(39))}': `${{baseUrl}}menu/{fname}`,\n"

content += """};

export const imageMap: Record<string, string> = imageMapData;

export function getImageUrl(itemName: string): string {
  return imageMap[itemName] || '';
}
"""

Path('src/components/imageMap.ts').write_text(content, encoding='utf-8')

