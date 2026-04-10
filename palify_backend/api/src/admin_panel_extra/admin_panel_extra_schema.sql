CREATE TABLE IF NOT EXISTS admin_business_states (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL UNIQUE,
  admin_status ENUM('pending','approved','rejected','blocked','suspended') NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_business_states_business
    FOREIGN KEY (business_id) REFERENCES businesses(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_business_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  business_id INT NOT NULL UNIQUE,
  plan_id INT NULL,
  subscription_type ENUM('default','free_months','lifetime','override') NOT NULL DEFAULT 'default',
  duration_months INT NULL,
  is_lifetime TINYINT(1) NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_business_subscriptions_business
    FOREIGN KEY (business_id) REFERENCES businesses(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_admin_business_subscriptions_plan
    FOREIGN KEY (plan_id) REFERENCES subscriptions(id)
    ON DELETE SET NULL
);

INSERT INTO admin_business_states (business_id, admin_status, reviewed_at)
SELECT
  b.id,
  CASE WHEN b.is_active = 1 THEN 'approved' ELSE 'blocked' END,
  NOW()
FROM businesses b
LEFT JOIN admin_business_states abs ON abs.business_id = b.id
WHERE abs.business_id IS NULL;
