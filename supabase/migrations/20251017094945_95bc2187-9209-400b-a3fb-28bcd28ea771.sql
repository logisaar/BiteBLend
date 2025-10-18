-- Add RLS policies for user_roles table
-- Only admins can view all user roles
CREATE POLICY "Admins can view all user roles" ON user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can insert user roles
CREATE POLICY "Admins can insert user roles" ON user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update user roles
CREATE POLICY "Admins can update user roles" ON user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete user roles
CREATE POLICY "Admins can delete user roles" ON user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'));