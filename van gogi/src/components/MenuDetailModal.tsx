import { motion } from 'motion/react';
import { MenuItem } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MenuDetailModalProps {
  item: MenuItem;
  onClose: () => void;
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

export function MenuDetailModal({ item, onClose }: MenuDetailModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg active:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-[#C41E3A]" />
          </button>

          {/* Image */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#C41E3A]/5 to-[#FFF8F0]">
            <ImageWithFallback
              src={imageMap[item.image]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-[#C41E3A]">{item.name}</h2>
              <div className="bg-[#C41E3A] text-white px-3 py-1.5 rounded-full shrink-0 text-sm">
                <span>{item.price} ₽</span>
              </div>
            </div>

            <p className="text-gray-600 mb-5 text-sm">
              {item.description}
            </p>

            {/* Additional details */}
            <div className="border-t border-[#C41E3A]/10 pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#C41E3A] rounded-full"></div>
                <span className="text-gray-700 text-sm">Время приготовления: 15-20 минут</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#C41E3A] rounded-full"></div>
                <span className="text-gray-700 text-sm">Порция: 250г</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#C41E3A] rounded-full"></div>
                <span className="text-gray-700 text-sm">Калорийность: {Math.floor(Math.random() * 400 + 200)} ккал</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  );
}