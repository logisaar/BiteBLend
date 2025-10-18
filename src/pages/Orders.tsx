import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Package } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  delivery_agents: {
    name: string;
    phone: string;
  } | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        delivery_agents(name, phone)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      assigned: 'bg-indigo-500',
      picked_up: 'bg-cyan-500',
      on_the_way: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      <h1 className="text-3xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button onClick={() => navigate('/menu')}>Start Ordering</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="p-6 cursor-pointer hover:shadow-card transition-all"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order ID: {order.id.slice(0, 8)}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${order.total_amount.toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                    Track Order
                  </Button>
                </div>
                {order.delivery_agents && (
                  <div className="mt-2 p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Delivery Agent</p>
                    <p className="font-medium">{order.delivery_agents.name}</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_agents.phone}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
