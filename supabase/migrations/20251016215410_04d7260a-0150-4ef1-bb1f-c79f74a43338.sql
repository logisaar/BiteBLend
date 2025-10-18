-- Update orders table to show delivery phone
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_agent ON orders(delivery_agent_id);

-- Update delivery_agents table to allow agents to view their assigned orders
ALTER TABLE delivery_agents ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Add RLS policy for agents to view their assigned orders
CREATE POLICY "Agents can view their assigned orders" ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM delivery_agents
    WHERE delivery_agents.id = orders.delivery_agent_id
  )
);

-- Add RLS policy for agents to update their assigned orders
CREATE POLICY "Agents can update their assigned orders" ON orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM delivery_agents
    WHERE delivery_agents.id = orders.delivery_agent_id
  )
);

-- Add policy for delivery_agents table to allow admins to manage
CREATE POLICY "Admins can manage delivery agents" ON delivery_agents
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add policy for admins to insert delivery agents
CREATE POLICY "Admins can insert delivery agents" ON delivery_agents
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));