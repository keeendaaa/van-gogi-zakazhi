#!/bin/bash
cd "$(dirname "$0")"

SOURCE="/Users/kenda/menu/images"
TARGET="public/menu"

mkdir -p "$TARGET"

# Копируем все изображения
for file in "$SOURCE"/image*.{png,jpg,jpeg}; do
    if [ -f "$file" ]; then
        cp "$file" "$TARGET/"
        echo "Скопировано: $(basename "$file")"
    fi
done

echo ""
echo "Проверка результата:"
ls -1 "$TARGET"/image*.{png,jpg,jpeg} 2>/dev/null | wc -l | xargs echo "Всего файлов в public/menu:"

