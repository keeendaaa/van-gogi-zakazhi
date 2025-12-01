import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { MenuHeader } from './components/MenuHeader';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuGrid } from './components/MenuGrid';
import { MenuItem } from './components/types';
import { BottomNav } from './components/BottomNav';
import { Recommendations } from './components/Recommendations';
import { AIWaiter } from './components/AIWaiter';
import { MenuDetailModal } from './components/MenuDetailModal';
import { LoadingScreen } from './components/LoadingScreen';

const menuItems: MenuItem[] = [
  // Основные блюда
  {
    id: 1,
    name: 'Хинкали с говядиной и свининой',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 2,
    name: 'Хинкали с телятиной',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 3,
    name: 'Хинкали с бараниной',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 4,
    name: 'Хинкали с бараниной и брынзой',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 5,
    name: 'Хинкали с грибами',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 6,
    name: 'Хинкали с сыром',
    description: '',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  // Закуски
  {
    id: 7,
    name: 'Бакинские томаты с имеретинским сыром и соусом песто',
    description: '',
    price: 325,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 8,
    name: 'Сельдь с теплым картофелем и луком',
    description: '',
    price: 295,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 9,
    name: 'Ассорти из грузинского домашнего сыра',
    description: '',
    price: 685,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 10,
    name: 'Грузинские соленья',
    description: '',
    price: 410,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 11,
    name: 'Ассорти из свежих овощей',
    description: '',
    price: 375,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 12,
    name: 'Тарелка к пиву',
    description: '',
    price: 525,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 13,
    name: 'Мясное плато',
    description: '',
    price: 855,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 15,
    name: 'Хрустящие баклажаны с соусом Тай Чили',
    description: '',
    price: 465,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 16,
    name: 'Ассорти пхали',
    description: '',
    price: 610,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 17,
    name: 'Рулетики из баклажанов с начинкой из грецких орехов',
    description: '',
    price: 435,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 18,
    name: 'Шампиньоны запечённые с сыром',
    description: '',
    price: 425,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 19,
    name: 'Сырные палочки в хрустящей панировке',
    description: '',
    price: 335,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 20,
    name: 'Салат из бакинских томатов и огурцов',
    description: '',
    price: 415,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 21,
    name: 'Цезарь с курицей',
    description: '',
    price: 435,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 22,
    name: 'Цезарь с креветками',
    description: '',
    price: 545,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 23,
    name: 'Фирменный Салат Ван Гоги',
    description: '',
    price: 585,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 24,
    name: 'Теплый салат с языком',
    description: '',
    price: 525,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 25,
    name: 'Салат Тбилиси от Шеф-повара',
    description: '',
    price: 495,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 26,
    name: 'Салат из хрустящих баклажанов с сыром Страчателла',
    description: '',
    price: 665,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 31,
    name: 'Харчо',
    description: '',
    price: 400,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 32,
    name: 'Кюфта по-Турецки с нутом',
    description: '',
    price: 425,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 33,
    name: 'Борщ с салом и чесночком',
    description: '',
    price: 395,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 35,
    name: 'Суп тыквенный',
    description: '',
    price: 355,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 36,
    name: 'Куриный суп с домашней лапшой',
    description: '',
    price: 325,
    category: 'appetizers',
    image: 'default'
  },
  // Соусы
  {
    id: 63,
    name: 'Ткемали',
    description: '',
    price: 80,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 64,
    name: 'Аджика',
    description: '',
    price: 80,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 65,
    name: 'Томатный',
    description: '',
    price: 80,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 66,
    name: 'Сметана',
    description: '',
    price: 80,
    category: 'appetizers',
    image: 'default'
  },
  // Основные блюда
  {
    id: 37,
    name: 'Буглама из ягненка',
    description: '',
    price: 795,
    category: 'mains',
    image: 'default'
  },
  {
    id: 38,
    name: 'Говурма из ягнёнка',
    description: '',
    price: 785,
    category: 'mains',
    image: 'default'
  },
  {
    id: 39,
    name: 'Долма',
    description: '',
    price: 675,
    category: 'mains',
    image: 'default'
  },
  {
    id: 40,
    name: 'Оджахури из свинины',
    description: '',
    price: 585,
    category: 'mains',
    image: 'default'
  },
  {
    id: 41,
    name: 'Оджахури из телятины',
    description: '',
    price: 645,
    category: 'mains',
    image: 'default'
  },
  {
    id: 42,
    name: 'Цыпленок тапака с толченным картофелем',
    description: '',
    price: 915,
    category: 'mains',
    image: 'default'
  },
  {
    id: 43,
    name: 'Чкмерули',
    description: '',
    price: 595,
    category: 'mains',
    image: 'default'
  },
  {
    id: 44,
    name: 'Стейк из мраморной говядины с картофелем по-деревенски',
    description: '',
    price: 985,
    category: 'mains',
    image: 'default'
  },
  {
    id: 45,
    name: 'Филе судака на овощной подушке',
    description: '',
    price: 795,
    category: 'mains',
    image: 'default'
  },
  {
    id: 46,
    name: 'Терпуг Камчатский запечённый',
    description: '',
    price: 795,
    category: 'mains',
    image: 'default'
  },
  {
    id: 47,
    name: 'Треска во фритюре с кисло-сладким соусом и картошкой фри',
    description: '',
    price: 690,
    category: 'mains',
    image: 'default'
  },
  // Десерты
  {
    id: 52,
    name: 'Грузинский Шоти',
    description: '',
    price: 70,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 53,
    name: 'Хачапури по - Аджарски',
    description: '',
    price: 385,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 54,
    name: 'Хачапури по - Мегрельски',
    description: '',
    price: 415,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 55,
    name: 'Хачапури по - Мегрельски на компанию',
    description: '',
    price: 695,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 56,
    name: 'Кубдари',
    description: '',
    price: 355,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 57,
    name: 'Кубдари на компанию',
    description: '',
    price: 625,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 58,
    name: 'Хачапури по-Турецки',
    description: '',
    price: 425,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 59,
    name: 'Гюзлама с курицей и сыром на одного',
    description: '',
    price: 350,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 60,
    name: 'Гюзлама с курицей и сыром на компанию',
    description: '',
    price: 685,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 61,
    name: 'Чебурек',
    description: '',
    price: 275,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 62,
    name: 'Кутабы',
    description: '',
    price: 255,
    category: 'desserts',
    image: 'default'
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'recommendations' | 'menu' | 'ai'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Функция для рандомизации массива (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Рандомизируем блюда при изменении категории
  const filteredItems = useMemo(() => {
    const items = selectedCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory);
    return shuffleArray(items);
  }, [selectedCategory, menuItems]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
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

      {activeTab === 'recommendations' && <Recommendations menuItems={menuItems} onItemClick={setSelectedItem} />}
      
      {activeTab === 'ai' && <AIWaiter menuItems={menuItems} onItemClick={setSelectedItem} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AnimatePresence>
        {selectedItem && (
          <MenuDetailModal 
            key={selectedItem.id}
            item={selectedItem}
            menuItems={menuItems}
            onClose={() => setSelectedItem(null)}
            onItemClick={setSelectedItem}
          />
        )}
      </AnimatePresence>
        </div>
      )}
    </>
  );
}