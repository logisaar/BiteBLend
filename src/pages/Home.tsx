import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import RestaurantShowcase from '@/components/RestaurantShowcase';
import { Coffee, Dessert, Pizza, Wine, IceCream, Utensils, Soup, Star } from 'lucide-react';

export default function Home() {
  const categories = [
    { title: 'Starters', icon: Soup, category: 'starter' },
    { title: 'Main Course', icon: Pizza, category: 'main_course' },
    { title: 'Desserts', icon: Dessert, category: 'dessert' },
    { title: 'Mocktails', icon: Wine, category: 'mocktail' },
    { title: 'Cold Drinks', icon: IceCream, category: 'cold_drink' },
    { title: 'Hot Drinks', icon: Coffee, category: 'hot_drink' },
    { title: 'Snacks', icon: Utensils, category: 'snack' },
    { title: 'Special', icon: Star, category: 'special' },
  ];

  return (
    <div className="container mx-auto px-4 space-y-12">
      <HeroCarousel />
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.category}
              title={category.title}
              icon={category.icon}
              category={category.category}
            />
          ))}
        </div>
      </section>

      <RestaurantShowcase />
    </div>
  );
}
