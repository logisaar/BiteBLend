import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  category: string;
}

export default function CategoryCard({ title, icon: Icon, category }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/menu?category=${category}`)}
      className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300 bg-gradient-secondary border-border"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-center">{title}</h3>
      </div>
    </Card>
  );
}
