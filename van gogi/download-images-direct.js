// Скрипт для скачивания изображений напрямую с Tilda CDN
const https = require('https');
const fs = require('fs');
const path = require('path');

// Создаем директорию для изображений
const imagesDir = path.join(__dirname, 'src', 'assets', 'menu');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Функция для скачивания изображения
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Получаем список блюд из App.tsx и создаем маппинг
// Используем Unsplash для placeholder изображений грузинской кухни
const menuItems = require('./src/App.tsx'); // Это не сработает, нужно другой подход

// Создаем imageMap с URL изображений грузинской кухни из Unsplash
const imageMap = {};

// Генерируем URL для каждого блюда на основе его названия
function getImageUrlForDish(name) {
  // Используем поиск по ключевым словам
  const keywords = {
    'хинкали': 'dumpling',
    'хачапури': 'cheese-bread',
    'салат': 'salad',
    'суп': 'soup',
    'стейк': 'steak',
    'рыба': 'fish',
    'курица': 'chicken',
    'мясо': 'meat',
    'овощи': 'vegetables',
    'десерт': 'dessert',
    'выпечка': 'bread',
  };
  
  const nameLower = name.toLowerCase();
  let keyword = 'food';
  
  for (const [ru, en] of Object.entries(keywords)) {
    if (nameLower.includes(ru)) {
      keyword = en;
      break;
    }
  }
  
  // Используем Unsplash Source API для получения изображений
  return `https://source.unsplash.com/800x600/?${keyword},georgian-food`;
}

// Альтернатива: используем реальные изображения с сайта через их CDN
// Нужно получить реальные URL из сетевых запросов

console.log('Для получения реальных изображений нужно:');
console.log('1. Открыть сайт van-gogi.ru в браузере');
console.log('2. Открыть DevTools -> Network');
console.log('3. Найти запросы к optim.tildacdn.com или static.tildacdn.com');
console.log('4. Скопировать URL изображений');

// Вместо этого создадим скрипт, который будет использовать placeholder
// но с возможностью замены на реальные URL

const placeholderImageMap = {};

// Читаем App.tsx чтобы получить список блюд
const appContent = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');
const menuMatches = appContent.match(/name:\s*'([^']+)'/g);

if (menuMatches) {
  menuMatches.forEach((match, index) => {
    const name = match.match(/name:\s*'([^']+)'/)[1];
    placeholderImageMap[name] = getImageUrlForDish(name);
  });
}

// Сохраняем маппинг
const imageMapPath = path.join(__dirname, 'image-map-placeholder.json');
fs.writeFileSync(imageMapPath, JSON.stringify(placeholderImageMap, null, 2));
console.log(`\n✓ Placeholder imageMap сохранен: ${imageMapPath}`);
console.log(`   Всего блюд: ${Object.keys(placeholderImageMap).length}`);

