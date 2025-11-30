import { motion } from 'motion/react';
import { MenuItem } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface MenuCardProps {
  item: MenuItem;
  imageUrl: string;
  onClick: () => void;
}

export function MenuCard({ item, imageUrl, onClick }: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md active:shadow-xl transition-shadow duration-300 group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#C41E3A]/5 to-[#FFF8F0]">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <ImageWithFallback
            src={imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        </motion.div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price badge */}
        <motion.div
          className="absolute top-3 right-3 bg-[#C41E3A] text-white px-3 py-1.5 rounded-full shadow-lg text-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
        >
          <span>{item.price} ₽</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[#C41E3A] mb-1.5">{item.name}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full bg-[#C41E3A] rounded-tl-full" />
      </div>
    </motion.div>
  );
}