// Скрипт для создания Word документа с меню и фотографиями
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, WidthType } = require('docx');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Читаем данные блюд из App.tsx
const appPath = path.join(__dirname, 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// Извлекаем блюда
const menuItems = [];
const itemMatches = appContent.matchAll(/{\s*id:\s*(\d+),\s*name:\s*'([^']+)',\s*description:\s*'([^']*)',\s*price:\s*(\d+),\s*category:\s*'([^']+)',/g);

for (const match of itemMatches) {
  menuItems.push({
    id: parseInt(match[1]),
    name: match[2],
    description: match[3],
    price: parseInt(match[4]),
    category: match[5]
  });
}

// Читаем imageMap
const imageMapPath = path.join(__dirname, 'src', 'components', 'imageMap.ts');
const imageMapContent = fs.readFileSync(imageMapPath, 'utf8');
const imageMap = {};

// Извлекаем URL изображений
const imageMatches = imageMapContent.matchAll(/'([^']+)':\s*'([^']+)'/g);
for (const match of imageMatches) {
  imageMap[match[1]] = match[2];
}

console.log(`Найдено блюд: ${menuItems.length}`);
console.log(`Найдено изображений: ${Object.keys(imageMap).length}\n`);

// Функция для скачивания изображения
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      reject(new Error('Invalid URL'));
      return;
    }
    
    const protocol = url.startsWith('https') ? https : require('http');
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (response) => {
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
      
      fileStream.on('error', reject);
    });
    
    request.on('error', reject);
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Группируем блюда по категориям
const categories = {
  'appetizers': 'ЗАКУСКИ',
  'mains': 'ОСНОВНЫЕ БЛЮДА',
  'desserts': 'ДЕСЕРТЫ',
  'drinks': 'НАПИТКИ'
};

const groupedItems = {
  'appetizers': [],
  'mains': [],
  'desserts': [],
  'drinks': []
};

menuItems.forEach(item => {
  if (groupedItems[item.category]) {
    groupedItems[item.category].push(item);
  }
});

// Создаем временную директорию для изображений
const tempImagesDir = path.join(__dirname, 'temp-images');
if (!fs.existsSync(tempImagesDir)) {
  fs.mkdirSync(tempImagesDir, { recursive: true });
}

async function createWordDocument() {
  const children = [];
  
  // Заголовок
  children.push(
    new Paragraph({
      text: "МЕНЮ РЕСТОРАНА ВАН ГОГИ",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Обрабатываем каждую категорию
  for (const [categoryKey, categoryName] of Object.entries(categories)) {
    const items = groupedItems[categoryKey];
    if (items.length === 0) continue;

    // Заголовок категории
    children.push(
      new Paragraph({
        text: categoryName,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    // Обрабатываем каждое блюдо
    for (const item of items) {
      const imageUrl = imageMap[item.name];
      
      // Название блюда
      children.push(
        new Paragraph({
          text: item.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 }
        })
      );

      // Изображение
      if (imageUrl) {
        try {
          const imageFilename = `${item.id}-${item.name.replace(/[^a-z0-9а-яё]/gi, '-').toLowerCase().substring(0, 30)}.png`;
          const imagePath = path.join(tempImagesDir, imageFilename);
          
          // Скачиваем изображение, если еще не скачано
          if (!fs.existsSync(imagePath)) {
            console.log(`  Скачиваю: ${item.name}`);
            await downloadImage(imageUrl, imagePath);
            await new Promise(resolve => setTimeout(resolve, 200)); // Задержка между запросами
          }

          // Добавляем изображение в документ
          const imageBuffer = fs.readFileSync(imagePath);
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            })
          );
        } catch (error) {
          console.error(`  Ошибка при скачивании изображения для ${item.name}:`, error.message);
        }
      }

      // Описание
      if (item.description) {
        children.push(
          new Paragraph({
            text: item.description,
            spacing: { after: 100 }
          })
        );
      }

      // Цена
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Цена: ${item.price} ₽`,
              bold: true,
              size: 24,
              color: "C41E3A"
            })
          ],
          spacing: { after: 300 }
        })
      );
    }
  }

  // Создаем документ
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  // Сохраняем документ
  const outputPath = path.join(__dirname, 'Меню_Ван_Гоги.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`\n✅ Word документ создан: ${outputPath}`);
  
  // Удаляем временные изображения
  fs.rmSync(tempImagesDir, { recursive: true, force: true });
  console.log(`✓ Временные файлы удалены`);
}

createWordDocument().catch(console.error);

