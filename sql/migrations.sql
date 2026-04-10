-- ============================================================
-- PALIFY ADMIN PANEL — Required Database Migrations
-- Run these SQL statements on your palify_database
-- ============================================================

-- 1. Add is_admin column to users table (for admin login)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) NOT NULL DEFAULT 0;

-- Set yourself as admin (replace with your email)
-- UPDATE users SET is_admin = 1 WHERE email_address = 'your_admin@email.com';

-- 2. Create admin_business_states table (for business approve/reject/block)
CREATE TABLE IF NOT EXISTS admin_business_states (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  business_id   INT NOT NULL,
  admin_status  ENUM('pending','approved','rejected','blocked','suspended') NOT NULL DEFAULT 'pending',
  notes         TEXT,
  reviewed_at   DATETIME,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_business (business_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 3. Create admin_business_subscriptions table (for subscription control)
CREATE TABLE IF NOT EXISTS admin_business_subscriptions (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  business_id       INT NOT NULL,
  plan_id           INT,
  subscription_type ENUM('default','free_months','lifetime','override') NOT NULL DEFAULT 'default',
  duration_months   INT,
  is_lifetime       TINYINT(1) NOT NULL DEFAULT 0,
  starts_at         DATETIME,
  ends_at           DATETIME,
  status            ENUM('active','inactive','expired') NOT NULL DEFAULT 'inactive',
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_business (business_id),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id)     REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- 4. Verify your subscriptions table has required columns
-- If not exists, create a basic one:
CREATE TABLE IF NOT EXISTS subscriptions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  price         DECIMAL(10,2) DEFAULT 0,
  duration_days INT DEFAULT 30,
  features      TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans if empty
INSERT IGNORE INTO subscriptions (id, name, price, duration_days, features)
VALUES
  (1, 'Free',    0,     0,   'Basic listing'),
  (2, 'Basic',   499,   30,  'Basic listing, Analytics'),
  (3, 'Pro',     999,   30,  'Full features, Priority support'),
  (4, 'Premium', 1999,  30,  'All features, Dedicated support');

-- ============================================================
-- VERIFICATION QUERIES (run to check setup)
-- ============================================================
-- SELECT id, full_name, email_address, is_admin FROM users LIMIT 10;
-- SELECT * FROM admin_business_states LIMIT 5;
-- SELECT * FROM subscriptions;
