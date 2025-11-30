import { motion } from 'motion/react';
import { MenuItem } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { getImageUrl } from './imageMap';

interface MenuDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

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
            {getImageUrl(item.name) ? (
              <ImageWithFallback
                src={getImageUrl(item.name)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-[#C41E3A]/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#C41E3A]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-[#C41E3A]/40 text-sm">Фото</p>
                </div>
              </div>
            )}
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