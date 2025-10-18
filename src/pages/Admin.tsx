import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AdminOrderManagement from './AdminOrderManagement';
import AdminInsights from './AdminInsights';
import AdminOffers from './AdminOffers';
import AdminAgents from './AdminAgents';
import AdminOrders from './AdminOrders';
import { LogOut } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin-login');
      return;
    }

    // Verify admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      navigate('/admin-login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="manage">
          <AdminOrderManagement />
        </TabsContent>

        <TabsContent value="agents">
          <AdminAgents />
        </TabsContent>

        <TabsContent value="offers">
          <AdminOffers />
        </TabsContent>

        <TabsContent value="insights">
          <AdminInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
