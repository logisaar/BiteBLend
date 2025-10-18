import { Menu, ShoppingCart, User } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function TopNav() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Offers', path: '/offers' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
    { label: 'Order History', path: '/orders' },
    { label: 'Admin', path: '/admin' },
    { label: 'Agent', path: '/agent' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              {user && (
                <Button variant="destructive" onClick={() => signOut()}>
                  Sign Out
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          BiteBLend
        </h1>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate(user ? '/profile' : '/auth')}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
