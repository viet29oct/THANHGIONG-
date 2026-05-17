-- Dev/test admin — password: Admin@123
INSERT INTO users (name, email, password, role, email_verified, created_at)
VALUES (
    'Admin Test',
    'admin@thanhgiong.vn',
    '$2a$10$mAaVP0tZolCXf4uklUQKSOWWXZO1MEvu6QY8HcPCKV969osuI0jg.',
    'SUPER_ADMIN',
    true,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    email_verified = true;
