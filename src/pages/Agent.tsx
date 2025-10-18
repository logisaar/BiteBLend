import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, MapPin, User, Phone, LogOut } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  addresses: {
    full_name: string;
    phone: string;
    house_details: string;
    road_details: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
  };
  profiles: {
    name: string;
    phone: string;
  };
}

export default function Agent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agentId, setAgentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAgentId = localStorage.getItem('agentAuth');
    if (!storedAgentId) {
      navigate('/agent-login');
      return;
    }
    setAgentId(storedAgentId);
  }, [navigate]);

  useEffect(() => {
    if (!agentId) return;
    fetchAssignedOrders();

    // Realtime subscription
    const channel = supabase
      .channel('agent_orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAssignedOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  const fetchAssignedOrders = async () => {
    if (!agentId) return;
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        addresses(full_name, phone, house_details, road_details, landmark, city, state, pincode),
        profiles(name, phone)
      `)
      .eq('delivery_agent_id', agentId)
      .in('status', ['assigned', 'picked_up', 'on_the_way'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus as any })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Order status updated' });
      fetchAssignedOrders();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      assigned: 'bg-indigo-500',
      picked_up: 'bg-cyan-500',
      on_the_way: 'bg-orange-500',
      delivered: 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleLogout = () => {
    localStorage.removeItem('agentAuth');
    navigate('/agent-login');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delivery Agent Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Agent Dashboard</h2>
            <p className="text-sm text-muted-foreground">Active Orders: {orders.length}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assigned Orders</h2>
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No orders assigned yet</p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'PPP p')}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'picked_up')}
                      disabled={order.status !== 'assigned'}
                    >
                      Picked Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'on_the_way')}
                      disabled={order.status !== 'picked_up'}
                    >
                      On the Way
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={order.status !== 'on_the_way'}
                    >
                      Delivered
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.profiles.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.profiles.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{order.addresses.full_name}</p>
                        <p>{order.addresses.house_details}, {order.addresses.road_details}</p>
                        {order.addresses.landmark && <p>Landmark: {order.addresses.landmark}</p>}
                        <p>{order.addresses.city}, {order.addresses.state} - {order.addresses.pincode}</p>
                        <p className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {order.addresses.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
