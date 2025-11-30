export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'drinks';
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
