import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus, User, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  house_details: string;
  road_details: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  latitude?: number;
  longitude?: number;
}

interface Profile {
  name: string;
  phone: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    house_details: '',
    road_details: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'home'
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id);

    if (!error && data) {
      setAddresses(data);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({ title: 'Location captured', description: 'Your location has been saved' });
        },
        (error) => {
          toast({ title: 'Error', description: 'Could not get your location', variant: 'destructive' });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('addresses')
      .insert({
        user_id: user?.id,
        ...formData
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Address added successfully' });
      fetchAddresses();
      setOpen(false);
      setFormData({
        full_name: '',
        phone: '',
        house_details: '',
        road_details: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        address_type: 'home'
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="h-6 w-6" />
          Profile Details
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-lg font-semibold">{profile?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {profile?.phone || 'Not set'}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Saved Addresses
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="house_details">House/Flat/Block No.</Label>
                <Input
                  id="house_details"
                  value={formData.house_details}
                  onChange={e => setFormData({ ...formData, house_details: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="road_details">Road/Area/Colony</Label>
                <Input
                  id="road_details"
                  value={formData.road_details}
                  onChange={e => setFormData({ ...formData, road_details: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address_type">Address Type</Label>
                <select
                  id="address_type"
                  value={formData.address_type}
                  onChange={e => setFormData({ ...formData, address_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Capture Current Location
              </Button>
              <Button type="submit" className="w-full">Save Address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <Card className="p-6 col-span-2">
            <p className="text-muted-foreground text-center">No addresses saved yet</p>
          </Card>
        ) : (
          addresses.map(address => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  {address.address_type}
                </span>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">{address.full_name}</p>
                <p className="text-sm">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.house_details}, {address.road_details}
                  {address.landmark && `, ${address.landmark}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
