CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('BILLING', 'SHIPPING')),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);
CREATE INDEX idx_addresses_type ON addresses (type);
ALTER TABLE addresses
  ADD CONSTRAINT fk_addresses_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
-- Add a unique constraint to ensure that only one default address per user
ALTER TABLE addresses
  ADD CONSTRAINT uq_addresses_user_id_type UNIQUE (user_id, type, is_default)
  WHERE is_default = true;
-- Add a trigger to update the updated_at field on every update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now() AT TIME ZONE 'utc';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_update_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
