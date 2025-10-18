import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Package, Truck, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_phone: string | null;
  addresses: {
    full_name: string;
    phone: string;
    house_details: string;
    road_details: string;
    landmark: string | null;
    city: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
  };
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();

      // Subscribe to realtime order updates
      const channel = supabase
        .channel(`order_${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            setOrder(prev => prev ? { ...prev, ...payload.new } : null);
            toast({
              title: 'Order Updated',
              description: `Status: ${payload.new.status}`
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [orderId]);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, addresses(*)')
      .eq('id', orderId)
      .single();

    if (!error && data) {
      setOrder(data);
    }
    setLoading(false);
  };

  const openGoogleMapsTracking = () => {
    if (order?.addresses?.latitude && order?.addresses?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${order.addresses.latitude},${order.addresses.longitude}`;
      window.open(url, '_blank');
    } else {
      toast({
        title: 'Location not available',
        description: 'GPS coordinates not set for this address',
        variant: 'destructive'
      });
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'assigned', label: 'Assigned to Agent', icon: Truck },
    { key: 'picked_up', label: 'Picked Up', icon: Truck },
    { key: 'on_the_way', label: 'On the Way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button className="mt-4" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/orders')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Order #{order.id.slice(0, 8)}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold">₹{order.total_amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Date</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Tracking Status</h3>
        <div className="relative">
          {statusSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.key} className="flex items-start mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    ${isCurrent ? 'ring-4 ring-primary/30 shadow-glow' : ''}
                  `}>
                    <StepIcon className="h-6 w-6" />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`
                      w-0.5 h-16 mt-2
                      ${isCompleted ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-primary mt-1">Current Status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </h3>
        <div className="space-y-2 mb-4">
          <p className="font-semibold">{order.addresses.full_name}</p>
          <p className="text-sm">{order.addresses.phone}</p>
          <p className="text-sm text-muted-foreground">
            {order.addresses.house_details}, {order.addresses.road_details}
            {order.addresses.landmark && `, ${order.addresses.landmark}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.addresses.city}, {order.addresses.state} - {order.addresses.pincode}
          </p>
        </div>
        <Button onClick={openGoogleMapsTracking} className="w-full">
          <MapPin className="h-4 w-4 mr-2" />
          Live Track on Google Maps
        </Button>
      </Card>

      {order.delivery_phone && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Delivery Agent Contact
          </h3>
          <p className="text-lg font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {order.delivery_phone}
          </p>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.open(`tel:${order.delivery_phone}`, '_self')}
          >
            Call Delivery Agent
          </Button>
        </Card>
      )}

      {order.status === 'cancelled' && (
        <Card className="p-6 border-destructive">
          <p className="text-destructive font-semibold">This order has been cancelled</p>
        </Card>
      )}
    </div>
  );
}
