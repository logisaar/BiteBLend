import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import { sendNotification, requestNotificationPermission } from '@/utils/notifications';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  active: boolean;
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discount: '',
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOffers();
    requestNotificationPermission();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOffers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOffer) {
      const { error } = await supabase
        .from('offers')
        .update(formData)
        .eq('id', editingOffer.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Offer updated successfully' });
        fetchOffers();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('offers')
        .insert(formData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Offer created successfully' });
        fetchOffers();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Offer deleted' });
      fetchOffers();
    }
  };

  const handleNotify = (offer: Offer) => {
    sendNotification(
      `New Offer: ${offer.title}`,
      `${offer.description} Use code: ${offer.code}`
    );
    toast({ title: 'Notification Sent', description: 'Users have been notified' });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', code: '', discount: '', active: true });
    setEditingOffer(null);
    setOpen(false);
  };

  const startEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discount: offer.discount,
      active: offer.active
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Offers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Promo Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="e.g., 20%, Free Shipping"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={checked => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingOffer ? 'Update' : 'Create'} Offer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(offer => (
          <Card key={offer.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{offer.title}</h3>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-primary">{offer.code}</span>
                <span className="text-sm">{offer.discount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${offer.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {offer.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(offer)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNotify(offer)}
                  disabled={!offer.active}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(offer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
