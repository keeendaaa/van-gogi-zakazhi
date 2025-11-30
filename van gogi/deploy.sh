#!/bin/bash
set -e

SSH_HOST="root@92.255.79.122"
SSH_PASS="j6NJuUz^JBu+vr"
DEPLOY_PATH="/var/www/zakazhi.online/vangogi"
BUILD_DIR="./build"

echo "🔍 Шаг 1: Проверяю структуру сервера..."

# Проверяем структуру сервера
WEB_ROOT=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_HOST" "
  if [ -d /var/www/zakazhi.online ]; then
    echo '/var/www/zakazhi.online'
  elif [ -d /home/www/zakazhi.online ]; then
    echo '/home/www/zakazhi.online'
  elif [ -d /var/www/html ]; then
    echo '/var/www/html'
  else
    echo 'NOT_FOUND'
  fi
")

if [ "$WEB_ROOT" = "NOT_FOUND" ]; then
  echo "❌ Не найдена корневая директория. Проверяю другие варианты..."
  sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_HOST" "
    echo 'Содержимое /var/www:'
    ls -la /var/www/ 2>/dev/null || echo 'Нет доступа к /var/www'
    echo ''
    echo 'Содержимое /home:'
    ls -la /home/ 2>/dev/null | head -10
    echo ''
    echo 'Конфигурация nginx:'
    ls -la /etc/nginx/sites-enabled/ 2>/dev/null | head -5 || echo 'Nginx не найден'
  "
  exit 1
fi

echo "✅ Найдена корневая директория: $WEB_ROOT"

# Проверяем существующие поддомены/сайты
echo ""
echo "🔍 Шаг 2: Проверяю существующие сайты и поддомены..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_HOST" "
  echo 'Существующие директории в $WEB_ROOT:'
  ls -la $WEB_ROOT/ 2>/dev/null | head -20
  echo ''
  echo 'Конфигурация nginx (если есть):'
  grep -r 'server_name' /etc/nginx/sites-enabled/ 2>/dev/null | head -10 || echo 'Nginx конфиги не найдены'
"

# Создаем директорию для деплоя
echo ""
echo "📁 Шаг 3: Создаю директорию для деплоя..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_HOST" "
  mkdir -p $DEPLOY_PATH
  echo 'Директория создана: $DEPLOY_PATH'
  ls -la $DEPLOY_PATH
"

# Проверяем, что build директория существует
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Директория build не найдена. Запускаю сборку..."
  npm run build
fi

# Копируем файлы
echo ""
echo "📤 Шаг 4: Копирую файлы на сервер..."
sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no -r "$BUILD_DIR"/* "$SSH_HOST:$DEPLOY_PATH/"

echo ""
echo "✅ Деплой завершен!"
echo "📍 Файлы задеплоены в: $DEPLOY_PATH"
echo ""
echo "⚠️  Следующие шаги:"
echo "   1. Настройте веб-сервер (nginx/apache) для обслуживания $DEPLOY_PATH"
echo "   2. Убедитесь, что путь /vangogi/ настроен в конфигурации"
echo "   3. Проверьте доступность по адресу zakazhi.online/vangogi/"
