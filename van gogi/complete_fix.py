#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import shutil
from pathlib import Path

print("=" * 70)
print("ПОЛНОЕ ПРИМЕНЕНИЕ ДАННЫХ ИЗ menu.json")
print("=" * 70)

# 1. Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# 2. Собираем все файлы и маппинг
image_mapping = {}
all_files = set()

for section in menu['sections']:
    for item in section['items']:
        if item.get('photos') and len(item['photos']) > 0:
            photo_path = item['photos'][0]
            file_name = Path(photo_path).name
            all_files.add(file_name)
            dish_name = item['name']
            if dish_name not in image_mapping:
                image_mapping[dish_name] = file_name

print(f"\n✓ Найдено {len(image_mapping)} блюд с изображениями")
print(f"✓ Уникальных файлов: {len(all_files)}")

# 3. Копируем ВСЕ файлы
source_dir = Path('/Users/kenda/menu/images')
target_dir = Path('public/menu')
target_dir.mkdir(parents=True, exist_ok=True)

print(f"\n📁 Копирование файлов...")
copied = 0
errors = []

for file_name in sorted(all_files):
    source_file = source_dir / file_name
    target_file = target_dir / file_name
    
    try:
        if source_file.exists():
            shutil.copy2(source_file, target_file)
            copied += 1
            print(f"  ✓ {file_name}")
        else:
            errors.append(f"{file_name} (не найден в исходной папке)")
            print(f"  ✗ {file_name} (не найден)")
    except Exception as e:
        errors.append(f"{file_name} (ошибка: {e})")
        print(f"  ✗ {file_name} (ошибка)")

print(f"\n📊 Результат: скопировано {copied} из {len(all_files)}")

# 4. Проверяем реальные файлы в целевой папке
existing_files = {f.name for f in target_dir.glob('image*.*')}
print(f"📊 Файлов в public/menu: {len(existing_files)}")

# Проверяем расширения реальных файлов
file_ext_map = {}
for f in target_dir.glob('image*.*'):
    file_ext_map[f.stem] = f.suffix

# 5. Обновляем imageMap.ts с правильными расширениями
print(f"\n📝 Обновление imageMap.ts...")

content = """// Image map для всех блюд меню
// Локальные изображения из menu.json

const baseUrl = import.meta.env.BASE_URL || '/vangogi/';

const imageMapData: Record<string, string> = {
"""

for dish_name, file_name in sorted(image_mapping.items()):
    # Исправляем расширение на основе реального файла
    base_name = Path(file_name).stem
    if base_name in file_ext_map:
        actual_ext = file_ext_map[base_name]
        file_name = f"{base_name}{actual_ext}"
    
    escaped_name = dish_name.replace("'", "\\'")
    content += f"  '{escaped_name}': `${{baseUrl}}menu/{file_name}`,\n"

content += """};

export const imageMap: Record<string, string> = imageMapData;

// Функция для получения URL изображения по названию блюда
export function getImageUrl(itemName: string): string {
  return imageMap[itemName] || '';
}
"""

with open('src/components/imageMap.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✓ imageMap.ts обновлен с {len(image_mapping)} блюдами")

# 6. Финальная проверка
still_missing = all_files - existing_files
if still_missing:
    print(f"\n⚠️  ВНИМАНИЕ: Отсутствуют ({len(still_missing)}):")
    for f in sorted(still_missing):
        print(f"   {f}")
    print("\nПопытка скопировать недостающие файлы...")
    for fname in still_missing:
        src = source_dir / fname
        dst = target_dir / fname
        if src.exists():
            try:
                shutil.copy2(src, dst)
                print(f"  ✓ Скопирован: {fname}")
            except Exception as e:
                print(f"  ✗ Ошибка при копировании {fname}: {e}")
    
    # Повторная проверка
    existing_files_after = {f.name for f in target_dir.glob('image*.*')}
    still_missing_after = all_files - existing_files_after
    if still_missing_after:
        print(f"\n❌ Все еще отсутствуют: {len(still_missing_after)} файлов")
    else:
        print(f"\n✅ Все файлы успешно скопированы!")
else:
    print(f"\n✅ ВСЕ ФАЙЛЫ УСПЕШНО СКОПИРОВАНЫ!")

if errors:
    print(f"\n⚠️  Ошибки ({len(errors)}):")
    for err in errors:
        print(f"   {err}")

print("\n" + "=" * 70)
print("✅ ГОТОВО! Все данные применены.")
print("=" * 70)

