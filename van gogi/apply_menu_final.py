#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import shutil
from pathlib import Path
import sys

print("Применение данных из menu.json...")
print("-" * 60)

# Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# Собираем все изображения из menu.json
image_mapping = {}
for section in menu['sections']:
    for item in section['items']:
        if item.get('photos') and len(item['photos']) > 0:
            photo_path = item['photos'][0]
            file_name = Path(photo_path).name
            dish_name = item['name']
            # Используем первое изображение для каждого блюда
            if dish_name not in image_mapping:
                image_mapping[dish_name] = file_name

print(f"Найдено {len(image_mapping)} блюд с изображениями в menu.json")

# Копируем все изображения
source_dir = Path('/Users/kenda/menu/images')
target_dir = Path('public/menu')
target_dir.mkdir(parents=True, exist_ok=True)

needed_files = set(image_mapping.values())
copied_count = 0

print("\nКопирование изображений...")
for file_name in needed_files:
    source_file = source_dir / file_name
    target_file = target_dir / file_name
    
    if source_file.exists():
        shutil.copy2(source_file, target_file)
        copied_count += 1
        print(f"  ✓ {file_name}")
    else:
        print(f"  ✗ {file_name} (не найден в исходной папке)")

print(f"\nСкопировано: {copied_count} из {len(needed_files)} файлов")

# Проверяем результат
existing_files = {f.name for f in target_dir.glob('image*.*')}
missing = needed_files - existing_files

if missing:
    print(f"\n⚠️  Отсутствуют ({len(missing)}):")
    for f in sorted(missing):
        print(f"  {f}")
else:
    print("\n✓ Все необходимые файлы скопированы!")

# Обновляем imageMap.ts
print("\nОбновление imageMap.ts...")

content = """// Image map для всех блюд меню
// Локальные изображения из menu.json

const baseUrl = import.meta.env.BASE_URL || '/vangogi/';

const imageMapData: Record<string, string> = {
"""

for dish_name, file_name in sorted(image_mapping.items()):
    escaped_name = dish_name.replace("'", "\\'")
    content += f"  '{escaped_name}': `${{baseUrl}}menu/{file_name}`,\n"

content += """};

export const imageMap: Record<string, string> = imageMapData;

// Функция для получения URL изображения по названию блюда
export function getImageUrl(itemName: string): string {
  return imageMap[itemName] || '';
}
"""

image_map_path = Path('src/components/imageMap.ts')
image_map_path.write_text(content, encoding='utf-8')

print(f"✓ imageMap.ts обновлен с {len(image_mapping)} блюдами")
print("\n" + "=" * 60)
print("Готово! Все данные из menu.json применены.")
print("=" * 60)

