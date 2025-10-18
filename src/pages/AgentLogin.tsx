import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Truck } from 'lucide-react';

export default function AgentLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('delivery_agents')
        .select('*')
        .eq('phone', phone)
        .eq('password_hash', password)
        .eq('active', true)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: 'Error',
          description: 'Invalid phone number or password. Contact admin for credentials.',
          variant: 'destructive'
        });
      } else {
        localStorage.setItem('agentAuth', data.id);
        toast({ title: 'Success', description: `Welcome ${data.name}!` });
        navigate('/agent');
      }
    } catch (error) {
      console.error('Agent login error:', error);
      toast({
        title: 'Error',
        description: 'Login failed. Please try again.',
        variant: 'destructive'
      });
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Truck className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Delivery Agent Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          Contact admin to get your credentials
        </p>
      </Card>
    </div>
  );
}
