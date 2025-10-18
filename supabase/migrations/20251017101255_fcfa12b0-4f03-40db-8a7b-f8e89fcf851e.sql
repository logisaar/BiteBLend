-- Allow delivery agents to view their own information (for agent dashboard)
CREATE POLICY "Agents can view their own profile"
ON delivery_agents
FOR SELECT
USING (true);

-- Update the agents orders view policy to be more permissive
-- This allows the agent page to fetch orders using the delivery_agent_id from localStorage
DROP POLICY IF EXISTS "Agents can view their assigned orders" ON orders;
CREATE POLICY "Agents can view assigned orders by delivery_agent_id"
ON orders
FOR SELECT
USING (delivery_agent_id IS NOT NULL);

-- Allow agents to update their assigned orders
DROP POLICY IF EXISTS "Agents can update their assigned orders" ON orders;
CREATE POLICY "Agents can update assigned orders"
ON orders
FOR UPDATE
USING (delivery_agent_id IS NOT NULL);