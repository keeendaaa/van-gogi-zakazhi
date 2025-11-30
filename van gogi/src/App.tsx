import { useState } from 'react';
import { MenuHeader } from './components/MenuHeader';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuGrid } from './components/MenuGrid';
import { MenuItem } from './components/types';
import { BottomNav } from './components/BottomNav';
import { Recommendations } from './components/Recommendations';
import { AIWaiter } from './components/AIWaiter';
import { MenuDetailModal } from './components/MenuDetailModal';

const menuItems: MenuItem[] = [
  // Закуски
  {
    id: 1,
    name: 'Брускетта с томатами',
    description: 'Хрустящий хлеб с сочными томатами, базиликом и оливковым маслом',
    price: 450,
    category: 'appetizers',
    image: 'bruschetta tomatoes'
  },
  {
    id: 2,
    name: 'Сырная тарелка',
    description: 'Ассорти из французских и итальянских сыров с медом и орехами',
    price: 890,
    category: 'appetizers',
    image: 'cheese platter'
  },
  {
    id: 3,
    name: 'Карпаччо из говядины',
    description: 'Тонко нарезанная мраморная говядина с рукколой и пармезаном',
    price: 720,
    category: 'appetizers',
    image: 'beef carpaccio'
  },
  {
    id: 4,
    name: 'Тартар из лосося',
    description: 'Свежий лосось с авокадо, каперсами и лимонной заправкой',
    price: 850,
    category: 'appetizers',
    image: 'salmon tartare'
  },
  
  // Основные блюда
  {
    id: 5,
    name: 'Стейк Рибай',
    description: 'Мраморная говядина 300г с овощами гриль и соусом демиглас',
    price: 1850,
    category: 'mains',
    image: 'ribeye steak'
  },
  {
    id: 6,
    name: 'Ризотто с белыми грибами',
    description: 'Кремовое ризотто с трюфельным маслом и пармезаном',
    price: 980,
    category: 'mains',
    image: 'mushroom risotto'
  },
  {
    id: 7,
    name: 'Филе лосося',
    description: 'На подушке из шпината с лимонным соусом',
    price: 1350,
    category: 'mains',
    image: 'grilled salmon'
  },
  {
    id: 8,
    name: 'Утиная грудка',
    description: 'С апельсиновым соусом и картофельным пюре с трюфелем',
    price: 1450,
    category: 'mains',
    image: 'duck breast'
  },
  
  // Десерты
  {
    id: 9,
    name: 'Тирамису',
    description: 'Классический итальянский десерт с маскарпоне',
    price: 520,
    category: 'desserts',
    image: 'tiramisu dessert'
  },
  {
    id: 10,
    name: 'Крем-брюле',
    description: 'Нежный ванильный крем с карамельной корочкой',
    price: 480,
    category: 'desserts',
    image: 'creme brulee'
  },
  {
    id: 11,
    name: 'Шоколадный фондан',
    description: 'Теплый шоколадный кекс с жидким центром и мороженым',
    price: 580,
    category: 'desserts',
    image: 'chocolate fondant'
  },
  {
    id: 12,
    name: 'Панна-котта',
    description: 'С ягодным соусом и свежей мятой',
    price: 450,
    category: 'desserts',
    image: 'panna cotta'
  },
  
  // Напитки
  {
    id: 13,
    name: 'Эспрессо',
    description: 'Крепкий ароматный кофе из отборных зерен',
    price: 180,
    category: 'drinks',
    image: 'espresso coffee'
  },
  {
    id: 14,
    name: 'Капучино',
    description: 'Классический капучино с воздушной молочной пенкой',
    price: 220,
    category: 'drinks',
    image: 'cappuccino coffee'
  },
  {
    id: 15,
    name: 'Лимонад домашний',
    description: 'Освежающий лимонад с мятой и свежими ягодами',
    price: 280,
    category: 'drinks',
    image: 'fresh lemonade'
  },
  {
    id: 16,
    name: 'Красное вино',
    description: 'Французское бордо, бокал',
    price: 450,
    category: 'drinks',
    image: 'red wine glass'
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'recommendations' | 'menu' | 'ai'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      <MenuHeader />
      
      {activeTab === 'menu' && (
        <>
          <CategoryTabs 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <MenuGrid items={filteredItems} onItemClick={setSelectedItem} />
        </>
      )}

      {activeTab === 'recommendations' && <Recommendations onItemClick={setSelectedItem} />}
      
      {activeTab === 'ai' && <AIWaiter />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {selectedItem && (
        <MenuDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}