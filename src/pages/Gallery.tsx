import { useState } from 'react';
import { Card } from '@/components/ui/card';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    title: 'Elegant Dining',
    category: 'Interior'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    title: 'Gourmet Dishes',
    category: 'Food'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800',
    title: 'Cozy Ambiance',
    category: 'Interior'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    title: 'Chef Special',
    category: 'Food'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    title: 'Modern Interior',
    category: 'Interior'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    title: 'Delicious Spread',
    category: 'Food'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    title: 'Bar Setup',
    category: 'Interior'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1562059392-096320bccc7e?w=800',
    title: 'Signature Cocktails',
    category: 'Drinks'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    title: 'Refreshing Mocktails',
    category: 'Drinks'
  }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const categories = ['All', 'Interior', 'Food', 'Drinks'];
  
  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Our Gallery
        </h1>
        <p className="text-muted-foreground">Experience the ambiance and delights</p>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card hover:bg-primary/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image, idx) => (
          <Card
            key={image.id}
            className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-elegant"
            onClick={() => setSelectedImage(idx)}
            style={{
              animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
            }}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl font-bold mb-1">{image.title}</h3>
                  <p className="text-white/80 text-sm">{image.category}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={filteredImages[selectedImage].url}
            alt={filteredImages[selectedImage].title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <h3 className="text-white text-2xl font-bold mb-2">
              {filteredImages[selectedImage].title}
            </h3>
            <p className="text-white/80">{filteredImages[selectedImage].category}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
