import { Star } from 'lucide-react';
import { Card } from './ui/card';

export default function RestaurantShowcase() {
  return (
    <section className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="overflow-hidden group cursor-pointer">
          <div className="relative h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
              alt="Restaurant Interior"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Elegant Ambiance</h3>
              <p className="text-white/90">Experience fine dining in our beautifully designed space</p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">What Our Customers Say</h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm italic">"Amazing food and exceptional service! The best restaurant in town."</p>
                <p className="text-xs text-muted-foreground mt-2">- Sarah Johnson</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm italic">"Incredible flavors and beautiful presentation. Will definitely come back!"</p>
                <p className="text-xs text-muted-foreground mt-2">- Michael Chen</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative h-[250px] rounded-xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=500&fit=crop"
            alt="Chef Preparing"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
            <p className="text-white font-semibold">Expert Chefs</p>
          </div>
        </div>

        <div className="relative h-[250px] rounded-xl overflow-hidden group cursor-pointer md:translate-y-6">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=500&fit=crop"
            alt="Fresh Ingredients"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
            <p className="text-white font-semibold">Fresh Ingredients</p>
          </div>
        </div>

        <div className="relative h-[250px] rounded-xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&h=500&fit=crop"
            alt="Cozy Atmosphere"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
            <p className="text-white font-semibold">Cozy Atmosphere</p>
          </div>
        </div>
      </div>
    </section>
  );
}
