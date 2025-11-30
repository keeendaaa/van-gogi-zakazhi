#!/usr/bin/env python3
import json
import shutil
from pathlib import Path

print("=" * 60)
print("ФИНАЛЬНОЕ ПРИМЕНЕНИЕ ДАННЫХ ИЗ menu.json")
print("=" * 60)

# 1. Читаем menu.json
with open('menu.json', 'r', encoding='utf-8') as f:
    menu = json.load(f)

# 2. Собираем все файлы и создаем маппинг
image_mapping = {}
all_files = set()

for section in menu['sections']:
    for item in section['items']:
        if item.get('photos') and len(item['photos']) > 0:
            photo_path = item['photos'][0]
            file_name = Path(photo_path).name
            dish_name = item['name']
            all_files.add(file_name)
            if dish_name not in image_mapping:
                image_mapping[dish_name] = file_name

print(f"\n1. Найдено {len(image_mapping)} блюд с изображениями")
print(f"   Уникальных файлов: {len(all_files)}")

# 3. Копируем все файлы
source_dir = Path('/Users/kenda/menu/images')
target_dir = Path('public/menu')
target_dir.mkdir(parents=True, exist_ok=True)

print(f"\n2. Копирование файлов из {source_dir} в {target_dir}...")
copied = 0
missing = []

for file_name in sorted(all_files):
    source_file = source_dir / file_name
    target_file = target_dir / file_name
    
    if source_file.exists():
        shutil.copy2(source_file, target_file)
        copied += 1
        print(f"   ✓ {file_name}")
    else:
        missing.append(file_name)
        print(f"   ✗ {file_name} (не найден)")

print(f"\n   Скопировано: {copied} из {len(all_files)}")
if missing:
    print(f"   Не найдено: {len(missing)}")

# 4. Проверяем реальные файлы в целевой папке
existing_files = {f.name for f in target_dir.glob('image*.*')}
print(f"\n3. В public/menu теперь {len(existing_files)} файлов")

# 5. Обновляем imageMap.ts с правильными расширениями
print(f"\n4. Обновление imageMap.ts...")

# Проверяем реальные расширения файлов
file_extensions = {}
for f in target_dir.glob('image*.*'):
    file_extensions[f.stem] = f.suffix

content = """// Image map для всех блюд меню
// Локальные изображения из menu.json

const baseUrl = import.meta.env.BASE_URL || '/vangogi/';

const imageMapData: Record<string, string> = {
"""

for dish_name, file_name in sorted(image_mapping.items()):
    # Исправляем расширение если нужно
    base_name = Path(file_name).stem
    if base_name in file_extensions:
        actual_ext = file_extensions[base_name]
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

print(f"   ✓ imageMap.ts обновлен с {len(image_mapping)} блюдами")

# 6. Финальная проверка
still_missing = all_files - existing_files
if still_missing:
    print(f"\n⚠️  ВНИМАНИЕ: Все еще отсутствуют ({len(still_missing)}):")
    for f in sorted(still_missing):
        print(f"   {f}")
else:
    print(f"\n✓ ВСЕ ФАЙЛЫ УСПЕШНО СКОПИРОВАНЫ!")

print("\n" + "=" * 60)
print("ГОТОВО!")
print("=" * 60)

