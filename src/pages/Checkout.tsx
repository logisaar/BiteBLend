import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus } from 'lucide-react';

interface SavedAddress {
  id: string;
  full_name: string;
  phone: string;
  alternate_phone: string | null;
  house_details: string;
  road_details: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
}

export default function Checkout() {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [houseDetails, setHouseDetails] = useState('');
  const [roadDetails, setRoadDetails] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('home');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setShowNewAddressForm(true);
      }
    }
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        toast({
          title: "Location accessed",
          description: "Your location has been saved"
        });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let addressId = selectedAddressId;

      // Create new address if selected
      if (selectedAddressId === 'new') {
        const { data: addressData, error: addressError } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            full_name: fullName,
            phone: phone,
            alternate_phone: alternatePhone || null,
            pincode: pincode,
            state: state,
            city: city,
            house_details: houseDetails,
            road_details: roadDetails,
            landmark: landmark || null,
            address_type: addressType
          })
          .select()
          .single();

        if (addressError) throw addressError;
        addressId = addressData.id;
      }

      // Get cart items
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address_id: addressId,
          total_amount: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item: any) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      localStorage.removeItem('cart');

      toast({
        title: "Order placed successfully!",
        description: "You can track your order in Order History"
      });

      navigate(`/orders/${orderData.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Delivery Address</h2>

          {savedAddresses.length > 0 && (
            <div className="space-y-2">
              <Label>Select Address</Label>
              <Select value={selectedAddressId} onValueChange={(value) => {
                setSelectedAddressId(value);
                setShowNewAddressForm(value === 'new');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {savedAddresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.full_name} - {addr.house_details}, {addr.city}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(showNewAddressForm || savedAddresses.length === 0) && (
            <>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
            <Input
              id="alternatePhone"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="secondary" className="w-full" onClick={useMyLocation}>
                <MapPin className="mr-2 h-4 w-4" />
                Use my location
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="houseDetails">House No., Building Name *</Label>
            <Input
              id="houseDetails"
              value={houseDetails}
              onChange={(e) => setHouseDetails(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roadDetails">Road name, Area, Colony *</Label>
            <Input
              id="roadDetails"
              value={roadDetails}
              onChange={(e) => setRoadDetails(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">Add Nearby Famous Shop/Mall/Landmark</Label>
            <Input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type of address</Label>
            <RadioGroup value={addressType} onValueChange={setAddressType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="work" id="work" />
                <Label htmlFor="work">Work</Label>
              </div>
            </RadioGroup>
          </div>
          </>
          )}
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
}
