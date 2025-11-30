// Скрипт для создания маппинга изображений из docx к блюдам
const fs = require('fs');
const path = require('path');

// Читаем текущий imageMap
const imageMapPath = path.join(__dirname, 'src/components/imageMap.ts');
const imageMapContent = fs.readFileSync(imageMapPath, 'utf8');

// Извлекаем все названия блюд из imageMap
const dishNames = [];
const nameMatches = imageMapContent.match(/'([^']+)':/g);
if (nameMatches) {
  nameMatches.forEach(match => {
    const name = match.match(/'([^']+)':/)[1];
    dishNames.push(name);
  });
}

// Получаем список всех изображений
const menuDir = path.join(__dirname, 'src/assets/menu');
const images = fs.readdirSync(menuDir)
  .filter(f => f.match(/\.(png|jpg|jpeg)$/i))
  .sort((a, b) => {
    // Сортируем по номеру изображения
    const numA = parseInt(a.match(/image(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/image(\d+)/)?.[1] || '0');
    return numA - numB;
  });

console.log(`Найдено ${dishNames.length} блюд и ${images.length} изображений`);

// Создаем новый imageMap с локальными путями
const newImageMap = {};
dishNames.forEach((dishName, index) => {
  if (index < images.length) {
    const imageName = images[index];
    // Используем относительный путь от src
    newImageMap[dishName] = `/src/assets/menu/${imageName}`;
  } else {
    // Если изображений меньше чем блюд, используем первое доступное
    newImageMap[dishName] = images.length > 0 ? `/src/assets/menu/${images[0]}` : '';
  }
});

// Генерируем новый imageMap.ts
let newContent = `// Image map для всех блюд меню
// Локальные изображения из docx файла

const imageMapData: Record<string, string> = {
`;

Object.entries(newImageMap).forEach(([name, path]) => {
  newContent += `  '${name}': '${path}',\n`;
});

newContent += `};

export const imageMap: Record<string, string> = imageMapData;

// Функция для получения URL изображения по названию блюда
export function getImageUrl(itemName: string): string {
  return imageMap[itemName] || '';
}
`;

// Сохраняем
fs.writeFileSync(imageMapPath, newContent, 'utf8');
console.log(`✓ imageMap.ts обновлен с ${Object.keys(newImageMap).length} блюдами`);

