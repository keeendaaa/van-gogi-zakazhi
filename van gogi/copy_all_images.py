#!/usr/bin/env python3
import shutil
from pathlib import Path
import sys

source = Path('/Users/kenda/menu/images')
target = Path('public/menu')
target.mkdir(parents=True, exist_ok=True)

# Получаем все изображения
images = list(source.glob('image*.*'))
print(f'Найдено {len(images)} изображений в исходной папке')

copied = []
failed = []

for img in images:
    try:
        target_file = target / img.name
        shutil.copy2(img, target_file)
        copied.append(img.name)
        print(f'✓ Скопировано: {img.name}')
    except Exception as e:
        failed.append((img.name, str(e)))
        print(f'✗ Ошибка при копировании {img.name}: {e}')

print(f'\nИтого: скопировано {len(copied)}, ошибок {len(failed)}')

# Проверяем результат
existing = list(target.glob('image*.*'))
print(f'\nВ папке public/menu теперь {len(existing)} файлов')

if len(existing) < len(images):
    print('\n⚠️  Не все файлы скопированы!')
    missing = set(img.name for img in images) - set(f.name for f in existing)
    print(f'Отсутствуют: {sorted(missing)}')
else:
    print('\n✓ Все файлы успешно скопированы!')

