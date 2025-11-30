import { useState, useEffect } from 'react';
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
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 2,
    name: 'Хинкали с телятиной',
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 3,
    name: 'Хинкали с бараниной',
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 4,
    name: 'Хинкали с бараниной и брынзой',
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 5,
    name: 'Хинкали с грибами',
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  {
    id: 6,
    name: 'Хинкали с сыром',
    description: '3 шт',
    price: 300,
    category: 'mains',
    image: 'default'
  },
  // Закуски
  {
    id: 7,
    name: 'Бакинские томаты с имеретинским сыром и соусом песто',
    description: '210 г',
    price: 325,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 8,
    name: 'Сельдь с теплым картофелем и луком',
    description: '250 г',
    price: 295,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 9,
    name: 'Ассорти из грузинского домашнего сыра',
    description: '200 г',
    price: 685,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 10,
    name: 'Грузинские соленья',
    description: '250 г',
    price: 410,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 11,
    name: 'Ассорти из свежих овощей',
    description: '200 г',
    price: 375,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 12,
    name: 'Тарелка к пиву',
    description: '330 г',
    price: 525,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 13,
    name: 'Мясное плато',
    description: '300 г',
    price: 855,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 14,
    name: 'Ростбиф',
    description: '100 г',
    price: 635,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 15,
    name: 'Хрустящие баклажаны с соусом Тай Чили',
    description: '300 г',
    price: 465,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 16,
    name: 'Ассорти пхали',
    description: '270 г',
    price: 610,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 17,
    name: 'Рулетики из баклажанов с начинкой из грецких орехов',
    description: '270 г',
    price: 435,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 18,
    name: 'Шампиньоны запечённые с сыром',
    description: '200 г',
    price: 425,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 19,
    name: 'Сырные палочки в хрустящей панировке',
    description: '180 г',
    price: 335,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 20,
    name: 'Салат из бакинских томатов и огурцов',
    description: '280 г',
    price: 415,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 21,
    name: 'Цезарь с курицей',
    description: '210 г',
    price: 435,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 22,
    name: 'Цезарь с креветками',
    description: '200 г',
    price: 545,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 23,
    name: 'Фирменный Салат Ван Гоги',
    description: '230 г',
    price: 585,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 24,
    name: 'Теплый салат с языком',
    description: '200 г',
    price: 525,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 25,
    name: 'Салат Тбилиси от Шеф-повара',
    description: '200 г',
    price: 495,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 26,
    name: 'Салат из хрустящих баклажанов с сыром Страчателла',
    description: '220 г',
    price: 665,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 27,
    name: 'Салат из булгура со свежими овощами',
    description: '200 г',
    price: 385,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 28,
    name: 'Салат Тевзи',
    description: '200 г',
    price: 595,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 29,
    name: 'Салат Мамали',
    description: '200 г',
    price: 410,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 30,
    name: 'Салат из ростбифа',
    description: '210 г',
    price: 770,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 31,
    name: 'Харчо',
    description: '300 г',
    price: 400,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 32,
    name: 'Кюфта по-Турецки с нутом',
    description: '400 г',
    price: 425,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 33,
    name: 'Борщ с салом и чесночком',
    description: '300/200 г',
    price: 395,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 34,
    name: 'Суп Дюшбара - Говырма',
    description: '300 г',
    price: 415,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 35,
    name: 'Суп тыквенный',
    description: '350 г',
    price: 355,
    category: 'appetizers',
    image: 'default'
  },
  {
    id: 36,
    name: 'Куриный суп с домашней лапшой',
    description: '350 г',
    price: 325,
    category: 'appetizers',
    image: 'default'
  },
  // Основные блюда
  {
    id: 37,
    name: 'Буглама из ягненка',
    description: '350 г',
    price: 545,
    category: 'mains',
    image: 'default'
  },
  {
    id: 38,
    name: 'Говурма из ягнёнка',
    description: '350 г',
    price: 495,
    category: 'mains',
    image: 'default'
  },
  {
    id: 39,
    name: 'Долма',
    description: '250 г',
    price: 675,
    category: 'mains',
    image: 'default'
  },
  {
    id: 40,
    name: 'Оджахури из свинины',
    description: '350 г',
    price: 445,
    category: 'mains',
    image: 'default'
  },
  {
    id: 41,
    name: 'Оджахури из телятины',
    description: '350 г',
    price: 560,
    category: 'mains',
    image: 'default'
  },
  {
    id: 42,
    name: 'Цыпленок тапака с мятым картофелем',
    description: '450 г',
    price: 635,
    category: 'mains',
    image: 'default'
  },
  {
    id: 43,
    name: 'Чкмерули',
    description: '300 г',
    price: 595,
    category: 'mains',
    image: 'default'
  },
  {
    id: 44,
    name: 'Стейк из мраморной говядины с картофелем по-деревенски',
    description: '350 г',
    price: 890,
    category: 'mains',
    image: 'default'
  },
  {
    id: 45,
    name: 'Стейк из свиной шеи с капустой по-гурийски',
    description: '350 г',
    price: 790,
    category: 'mains',
    image: 'default'
  },
  {
    id: 46,
    name: 'Филе судака на овощной подушке',
    description: '300 г',
    price: 725,
    category: 'mains',
    image: 'default'
  },
  {
    id: 47,
    name: 'Терпуг Камчатский запечённый',
    description: '400 г',
    price: 690,
    category: 'mains',
    image: 'default'
  },
  {
    id: 48,
    name: 'Треска во фритюре с кисло-сладким соусом и картошкой фри',
    description: '250 г',
    price: 690,
    category: 'mains',
    image: 'default'
  },
  {
    id: 49,
    name: 'Киресуз из телятины',
    description: '350 г',
    price: 590,
    category: 'mains',
    image: 'default'
  },
  {
    id: 50,
    name: 'Овощи на пару',
    description: '130 г',
    price: 215,
    category: 'mains',
    image: 'default'
  },
  {
    id: 51,
    name: 'Мятый картофель с чесноком',
    description: '150 г',
    price: 215,
    category: 'mains',
    image: 'default'
  },
  // Десерты
  {
    id: 52,
    name: 'Грузинский Шоти',
    description: '1 шт',
    price: 70,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 53,
    name: 'Хачапури по - Аджарски',
    description: '320 г',
    price: 385,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 54,
    name: 'Хачапури по - Мегрельски',
    description: '270 г',
    price: 415,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 55,
    name: 'Хачапури по - Мегрельски на компанию',
    description: '500 г',
    price: 695,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 56,
    name: 'Кубдари',
    description: '250 г',
    price: 355,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 57,
    name: 'Кубдари на компанию',
    description: '500 г',
    price: 625,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 58,
    name: 'Хачапури по-Турецки',
    description: '330 г',
    price: 425,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 59,
    name: 'Гюзлама с курицей и сыром',
    description: '250 г',
    price: 350,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 60,
    name: 'Гюзлама с курицей и сыром на компанию',
    description: '500 г',
    price: 685,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 61,
    name: 'Чебурек',
    description: '180 г',
    price: 275,
    category: 'desserts',
    image: 'default'
  },
  {
    id: 62,
    name: 'Кутабы',
    description: '130 г',
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

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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

      {activeTab === 'recommendations' && <Recommendations onItemClick={setSelectedItem} />}
      
      {activeTab === 'ai' && <AIWaiter />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AnimatePresence>
        {selectedItem && (
          <MenuDetailModal 
            key={selectedItem.id}
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
        </div>
      )}
    </>
  );
}