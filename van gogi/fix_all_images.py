#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import shutil
from pathlib import Path

print("=" * 60)
print("Копирование изображений из menu.json")
print("=" * 60)

# Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# Собираем все изображения из menu.json
images_from_json = {}
for section in menu['sections']:
    for item in section['items']:
        if item.get('photos') and len(item['photos']) > 0:
            photo_path = item['photos'][0]
            file_name = Path(photo_path).name
            dish_name = item['name']
            images_from_json[dish_name] = file_name

print(f'\nВ menu.json найдено {len(images_from_json)} блюд с изображениями')

# Проверяем исходную папку
source_dir = Path('/Users/kenda/menu/images')
source_files = {f.name: f for f in source_dir.glob('image*.*')}
print(f'В исходной папке: {len(source_files)} файлов')

# Проверяем целевую папку
target_dir = Path('public/menu')
target_dir.mkdir(parents=True, exist_ok=True)
target_files = {f.name for f in target_dir.glob('image*.*')}
print(f'В целевой папке: {len(target_files)} файлов')

# Копируем все файлы из menu.json
print('\nКопирование файлов...')
copied = 0
missing_source = []

for dish_name, img_name in images_from_json.items():
    if img_name in source_files:
        source_file = source_files[img_name]
        target_file = target_dir / img_name
        
        if not target_file.exists():
            shutil.copy2(source_file, target_file)
            print(f'  ✓ Скопировано: {img_name}')
            copied += 1
        else:
            # Обновляем если исходный файл новее
            if source_file.stat().st_mtime > target_file.stat().st_mtime:
                shutil.copy2(source_file, target_file)
                print(f'  ↻ Обновлено: {img_name}')
                copied += 1
    else:
        missing_source.append(img_name)
        print(f'  ✗ Не найден в исходной папке: {img_name}')

print(f'\nСкопировано/обновлено: {copied} файлов')
if missing_source:
    print(f'⚠️  Не найдено в исходной папке: {len(missing_source)} файлов')

# Проверяем результат
target_files_after = {f.name for f in target_dir.glob('image*.*')}
needed_files = set(images_from_json.values())
still_missing = needed_files - target_files_after

if still_missing:
    print(f'\n⚠️  Все еще отсутствуют ({len(still_missing)}):')
    for img in sorted(still_missing):
        print(f'  {img}')
else:
    print('\n✓ Все файлы из menu.json теперь в public/menu!')

# Обновляем imageMap.ts
print("\n" + "=" * 60)
print("Обновление imageMap.ts")
print("=" * 60)

image_map_content = """// Image map для всех блюд меню
// Локальные изображения из menu.json

const baseUrl = import.meta.env.BASE_URL || '/vangogi/';

const imageMapData: Record<string, string> = {
"""

# Создаем маппинг по порядку из menu.json
seen_names = {}
for section in menu['sections']:
    for item in section['items']:
        if item.get('photos') and len(item['photos']) > 0:
            name = item['name']
            file_name = Path(item['photos'][0]).name
            
            # Используем первое изображение для каждого блюда
            if name not in seen_names:
                seen_names[name] = file_name
                escaped_name = name.replace("'", "\\'")
                image_map_content += f"  '{escaped_name}': `${{baseUrl}}menu/{file_name}`,\n"

image_map_content += """};

export const imageMap: Record<string, string> = imageMapData;

// Функция для получения URL изображения по названию блюда
export function getImageUrl(itemName: string): string {
  return imageMap[itemName] || '';
}
"""

with open('src/components/imageMap.ts', 'w', encoding='utf-8') as f:
    f.write(image_map_content)

print(f'✓ imageMap.ts обновлен с {len(seen_names)} блюдами')
print("\n" + "=" * 60)
print("Готово!")
print("=" * 60)

