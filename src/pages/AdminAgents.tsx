import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, User, Phone } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  phone: string;
  agent_number: number;
  active: boolean;
  capacity: number;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    active: true,
    capacity: 3
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('delivery_agents')
      .select('*')
      .order('agent_number');

    if (!error && data) {
      setAgents(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAgent) {
      // Update existing agent
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        active: formData.active,
        capacity: formData.capacity
      };

      if (formData.password) {
        updateData.password_hash = formData.password; // In production, this should be hashed
      }

      const { error } = await supabase
        .from('delivery_agents')
        .update(updateData)
        .eq('id', editingAgent.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Agent updated successfully' });
        fetchAgents();
        resetForm();
      }
    } else {
      // Get next agent number
      const { data: lastAgent } = await supabase
        .from('delivery_agents')
        .select('agent_number')
        .order('agent_number', { ascending: false })
        .limit(1)
        .single();

      const nextAgentNumber = lastAgent ? lastAgent.agent_number + 1 : 1;

      const { error } = await supabase
        .from('delivery_agents')
        .insert({
          name: formData.name,
          phone: formData.phone,
          password_hash: formData.password, // In production, this should be hashed
          agent_number: nextAgentNumber,
          active: formData.active,
          capacity: formData.capacity
        });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: `Agent created with ID: Agent${nextAgentNumber}` });
        fetchAgents();
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', password: '', active: true, capacity: 3 });
    setEditingAgent(null);
    setOpen(false);
  };

  const startEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      phone: agent.phone,
      password: '',
      active: agent.active,
      capacity: agent.capacity
    });
    setOpen(true);
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('delivery_agents')
      .update({ active: !currentStatus })
      .eq('id', agentId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Agent status updated' });
      fetchAgents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Agents</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAgent ? 'Edit Agent' : 'Create Agent'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password {editingAgent && '(leave blank to keep current)'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAgent}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity (Orders per day)</Label>
                <Select 
                  value={formData.capacity.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) })}
                >
                  <SelectTrigger id="capacity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
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
                {editingAgent ? 'Update' : 'Create'} Agent
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <Card key={agent.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">Agent #{agent.agent_number}</p>
                    <p className="text-sm flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {agent.phone}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${agent.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {agent.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(agent)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant={agent.active ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => toggleAgentStatus(agent.id, agent.active)}
                >
                  {agent.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
