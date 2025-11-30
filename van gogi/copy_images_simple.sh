#!/bin/bash
cd "$(dirname "$0")"

SOURCE="/Users/kenda/menu/images"
TARGET="public/menu"

mkdir -p "$TARGET"

echo "Копирование изображений из $SOURCE в $TARGET..."

count=0
for file in "$SOURCE"/image*.{png,jpg,jpeg}; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$TARGET/$filename"
        echo "Скопировано: $filename"
        ((count++))
    fi
done

echo ""
echo "Всего скопировано: $count файлов"
echo "Проверка:"
ls -1 "$TARGET"/image*.{png,jpg,jpeg} 2>/dev/null | wc -l | xargs echo "Файлов в $TARGET:"

