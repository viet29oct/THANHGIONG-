UPDATE users SET
  name = 'Admin Test',
  password = '$2a$10$mAaVP0tZolCXf4uklUQKSOWWXZO1MEvu6QY8HcPCKV969osuI0jg.',
  role = 'SUPER_ADMIN',
  email_verified = true
WHERE email = 'admin@thanhgiong.vn';

INSERT INTO users (name, email, password, role, email_verified, created_at)
SELECT 'Admin Test', 'admin@thanhgiong.vn',
  '$2a$10$mAaVP0tZolCXf4uklUQKSOWWXZO1MEvu6QY8HcPCKV969osuI0jg.',
  'SUPER_ADMIN', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@thanhgiong.vn');
