import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { user, signUp, signIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 7000);

    const interval = setInterval(() => {
      if (!user) {
        setOpen(true);
      }
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await signIn(phone, password);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setOpen(false);
        toast({
          title: "Welcome back!",
          description: "You're now signed in."
        });
      }
    } else {
      if (!name || !phone || !password) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive"
        });
        return;
      }

      const { error } = await signUp(name, phone, password);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setOpen(false);
        toast({
          title: "Welcome!",
          description: "Your account has been created."
        });
      }
    }
  };

  if (user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Sign In' : 'Create Account'}</DialogTitle>
          <DialogDescription>
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Register to start ordering delicious food'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? 'Sign In' : 'Register'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
