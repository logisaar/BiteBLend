import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchMenuItems();
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive'
      });
    } else {
      setItems(data || []);
    }
  };

  const addToCart = (item: MenuItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((i: any) => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast({
      title: 'Added to cart',
      description: `${item.name} added to your cart`
    });
  };

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'starter', label: 'Starters' },
    { value: 'main_course', label: 'Main Course' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'mocktail', label: 'Mocktails' },
    { value: 'cold_drink', label: 'Cold Drinks' },
    { value: 'hot_drink', label: 'Hot Drinks' },
    { value: 'snack', label: 'Snacks' },
    { value: 'special', label: 'Special' },
  ];

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu</h1>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-card transition-all">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-primary">${item.price}</span>
                <Button onClick={() => addToCart(item)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No items found in this category
        </div>
      )}
    </div>
  );
}
