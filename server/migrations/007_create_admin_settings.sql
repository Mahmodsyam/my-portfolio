CREATE TABLE IF NOT EXISTS admin_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO admin_settings (setting_key, setting_value) VALUES
('notification_email', ''),
('default_status', 'new'),
('max_file_size_mb', '10'),
('max_files_per_request', '5'),
('language', 'ar'),
('theme', 'dark');
