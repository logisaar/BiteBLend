import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { requestNotificationPermission } from '@/utils/notifications';
import { useToast } from '@/hooks/use-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  active: boolean;
}

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOffers();
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOffers(data);
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast({ title: 'Notifications Enabled', description: 'You\'ll receive updates about new offers!' });
    } else {
      toast({ title: 'Permission Denied', description: 'Please enable notifications in your browser settings.', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Special Offers</h1>
        {!notificationsEnabled && (
          <Button onClick={handleEnableNotifications} variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        )}
      </div>

      {offers.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No active offers at the moment. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="p-6 hover:shadow-glow transition-all bg-gradient-secondary">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-lg">
                  {offer.discount}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Promo Code</p>
                <p className="font-mono font-bold text-primary">{offer.code}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
