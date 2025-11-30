import { motion } from 'motion/react';
import { MenuItem } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, TrendingUp, Heart } from 'lucide-react';
import { getImageUrl } from './imageMap';

interface RecommendationsProps {
  onItemClick: (item: MenuItem) => void;
}

const recommendedItems: (MenuItem & { reason: string; badge: string })[] = [
  {
    id: 5,
    name: 'Стейк Рибай',
    description: 'Мраморная говядина 300г с овощами гриль и соусом демиглас',
    price: 1850,
    category: 'mains',
    image: 'ribeye steak',
    reason: 'Самое популярное блюдо недели',
    badge: 'popular'
  },
  {
    id: 4,
    name: 'Тартар из лосося',
    description: 'Свежий лосось с авокадо, каперсами и лимонной заправкой',
    price: 850,
    category: 'appetizers',
    image: 'salmon tartare',
    reason: 'Выбор шеф-повара',
    badge: 'chef'
  },
  {
    id: 9,
    name: 'Тирамису',
    description: 'Классический итальянский десерт с маскарпоне',
    price: 520,
    category: 'desserts',
    image: 'tiramisu dessert',
    reason: 'Любимое гостями',
    badge: 'favorite'
  },
  {
    id: 6,
    name: 'Ризотто с белыми грибами',
    description: 'Кремовое ризотто с трюфельным маслом и пармезаном',
    price: 980,
    category: 'mains',
    image: 'mushroom risotto',
    reason: 'Новое в меню',
    badge: 'new'
  },
];

const badgeConfig = {
  popular: { icon: TrendingUp, label: 'Популярное', color: 'bg-orange-500' },
  chef: { icon: Star, label: 'От шефа', color: 'bg-yellow-500' },
  favorite: { icon: Heart, label: 'Любимое', color: 'bg-pink-500' },
  new: { icon: Star, label: 'Новинка', color: 'bg-green-500' },
};

export function Recommendations({ onItemClick }: RecommendationsProps) {
  return (
    <div className="max-w-6xl mx-auto px-3 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-5">
          <h2 className="text-[#C41E3A] mb-1">Рекомендации для вас</h2>
          <p className="text-gray-600 text-sm">
            Специально подобранные блюда от нашего шеф-повара
          </p>
        </div>

        <div className="space-y-3">
          {recommendedItems.map((item, index) => {
            const badge = badgeConfig[item.badge as keyof typeof badgeConfig];
            const BadgeIcon = badge.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => onItemClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow-md active:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#C41E3A]/5 to-[#FFF8F0]">
                    {getImageUrl(item.name) ? (
                      <ImageWithFallback
                        src={getImageUrl(item.name)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#C41E3A]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className={`absolute top-1.5 left-1.5 ${badge.color} text-white px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[10px]`}>
                      <BadgeIcon className="w-2.5 h-2.5" />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-[#C41E3A] mb-0.5 text-base">{item.name}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-1">
                        {item.description}
                      </p>
                      <p className="text-[#C41E3A]/70 text-xs italic">
                        {item.reason}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#C41E3A] text-sm">{item.price} ₽</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#C41E3A] text-white px-3 py-1.5 rounded-lg text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick(item);
                        }}
                      >
                        Подробнее
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}