CREATE TABLE IF NOT EXISTS project_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_number VARCHAR(20) NOT NULL UNIQUE,
  client_id INT NOT NULL,
  project_name VARCHAR(255),
  project_type ENUM('website','ecommerce','web_application','management_system','pos_system','database_system','ui_ux_design','wordpress','other') NOT NULL DEFAULT 'other',
  description TEXT NOT NULL,
  budget ENUM('under_100','100_300','300_500','500_1000','1000_plus','not_sure') DEFAULT 'not_sure',
  deadline ENUM('asap','1_2_weeks','1_month','1_3_months','flexible') DEFAULT 'flexible',
  additional_requirements TEXT,
  status ENUM('new','reviewing','contacted','in_progress','completed','rejected','archived') NOT NULL DEFAULT 'new',
  priority ENUM('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
