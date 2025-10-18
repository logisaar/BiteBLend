import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop",
    title: "Delicious Meals"
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=500&fit=crop",
    title: "Fresh Ingredients"
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=500&fit=crop",
    title: "Fast Delivery"
  }
];

export default function HeroCarousel() {
  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
                <h2 className="text-3xl md:text-4xl font-bold p-6 text-foreground">
                  {image.title}
                </h2>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
