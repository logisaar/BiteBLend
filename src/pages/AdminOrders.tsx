import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminOrders() {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    preparing: 0,
    assigned: 0,
    picked_up: 0,
    on_the_way: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrderStats();

    // Subscribe to realtime order updates
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrderStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrderStats = async () => {
    const statuses: Array<'pending' | 'confirmed' | 'preparing' | 'assigned' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'> = 
      ['pending', 'confirmed', 'preparing', 'assigned', 'picked_up', 'on_the_way', 'delivered', 'cancelled'];
    const newStats: any = {};

    for (const status of statuses) {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);
      newStats[status] = count || 0;
    }

    setStats(newStats);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Package className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Package className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preparing</p>
              <p className="text-2xl font-bold">{stats.preparing}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold">{stats.assigned}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <Package className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Picked Up</p>
              <p className="text-2xl font-bold">{stats.picked_up}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <Package className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On the Way</p>
              <p className="text-2xl font-bold">{stats.on_the_way}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{stats.delivered}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Package className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
