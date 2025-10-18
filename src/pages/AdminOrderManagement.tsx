import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, User, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  user_id: string;
  address_id: string;
  delivery_agent_id: string | null;
  delivery_notes: string | null;
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
  delivery_agents: {
    name: string;
    phone: string;
  } | null;
}

interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  active: boolean;
}

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchAgents();

    // Realtime subscription
    const channel = supabase
      .channel('admin_orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter, dateFilter]);

  const fetchOrders = async () => {
    let query = supabase
      .from('orders')
      .select(`
        *,
        addresses(full_name, phone, house_details, road_details, landmark, city, state, pincode),
        profiles(name, phone),
        delivery_agents(name, phone)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter as any);
    }

    if (dateFilter) {
      const startOfDay = new Date(dateFilter);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateFilter);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.gte('created_at', startOfDay.toISOString()).lte('created_at', endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      setOrders(data as any);
    }
  };

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('delivery_agents')
      .select('*')
      .eq('active', true)
      .order('name');

    if (!error && data) {
      setAgents(data);
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
      fetchOrders();
    }
  };

  const assignAgent = async (orderId: string, agentId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ delivery_agent_id: agentId, status: 'assigned' as any })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Agent assigned successfully' });
      fetchOrders();
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        
        <div className="flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="on_the_way">On the Way</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {dateFilter && (
            <Button variant="ghost" onClick={() => setDateFilter(undefined)}>
              Clear Date
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
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
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      disabled={order.status !== 'pending'}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      disabled={order.status !== 'confirmed'}
                    >
                      Preparing
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={['delivered', 'cancelled'].includes(order.status)}
                    >
                      Cancel
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

                  <div className="space-y-2">
                    {order.delivery_agents ? (
                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="text-sm font-medium mb-1">Assigned Agent</p>
                        <p className="font-semibold">{order.delivery_agents.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.delivery_agents.phone}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium mb-2">Assign Delivery Agent</p>
                        <Select onValueChange={(value) => assignAgent(order.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} - {agent.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
