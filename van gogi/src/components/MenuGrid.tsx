import { motion } from 'motion/react';
import { MenuItem } from './types';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

const imageMap: Record<string, string> = {
  'bruschetta tomatoes': 'https://images.unsplash.com/photo-1630230596557-ad07b433f5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVzY2hldHRhJTIwdG9tYXRvZXN8ZW58MXx8fHwxNzY0NTIyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'cheese platter': 'https://images.unsplash.com/photo-1589881210718-42da05899fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBwbGF0dGVyfGVufDF8fHx8MTc2NDQzNzkwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'beef carpaccio': 'https://images.unsplash.com/photo-1727243866425-3bf2cbf7480a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwY2FycGFjY2lvfGVufDF8fHx8MTc2NDUyMjgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'salmon tartare': 'https://images.unsplash.com/photo-1763376360111-3597e5877517?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjB0YXJ0YXJlfGVufDF8fHx8MTc2NDUyMjgwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'ribeye steak': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWJleWUlMjBzdGVha3xlbnwxfHx8fDE3NjQ1MjI4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'mushroom risotto': 'https://images.unsplash.com/photo-1609770424775-39ec362f2d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNocm9vbSUyMHJpc290dG98ZW58MXx8fHwxNzY0NDg1NTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'grilled salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2NDUwNjQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'duck breast': 'https://images.unsplash.com/photo-1577271141104-b6bd7b76b8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWNrJTIwYnJlYXN0fGVufDF8fHx8MTc2NDUyMjgwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'tiramisu dessert': 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzY0NDk0MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'creme brulee': 'https://images.unsplash.com/photo-1676300184943-09b2a08319a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVtZSUyMGJydWxlZXxlbnwxfHx8fDE3NjQ0OTQwMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'chocolate fondant': 'https://images.unsplash.com/photo-1505252929202-c4f39cda4d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBmb25kYW50fGVufDF8fHx8MTc2NDUyMjgwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'panna cotta': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5uYSUyMGNvdHRhfGVufDF8fHx8MTc2NDUyMjgwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'espresso coffee': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZXxlbnwxfHx8fDE3NjQ0NDAwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'cappuccino coffee': 'https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlfGVufDF8fHx8MTc2NDUyMDAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'fresh lemonade': 'https://images.unsplash.com/photo-1665582295782-eecc2e25b74f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxlbW9uYWRlfGVufDF8fHx8MTc2NDUxMzc4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'red wine glass': 'https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwZ2xhc3N8ZW58MXx8fHwxNzY0NTIyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

export function MenuGrid({ items, onItemClick }: MenuGridProps) {
  return (
    <div className="max-w-6xl mx-auto px-3 py-4">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <MenuCard item={item} imageUrl={imageMap[item.image]} onClick={() => onItemClick(item)} />
          </motion.div>
        ))}
      </motion.div>

      {items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#C41E3A]/60 text-lg">Блюда не найдены</p>
        </div>
      )}
    </div>
  );
}