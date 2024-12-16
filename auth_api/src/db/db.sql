
-- 删除现有的用户表（如果存在）
DROP TABLE IF EXISTS tb_admin;

-- 创建用户表
CREATE TABLE IF NOT EXISTS tb_admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    extra_info TEXT

);

-- 删除现有的token表（如果存在）
DROP TABLE IF EXISTS tb_token;

-- 创建token表
CREATE TABLE IF NOT EXISTS tb_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tokenCode TEXT NOT NULL,
    days INTEGER NOT NULL,
    extra_info TEXT
);

CREATE INDEX idx_tokenCode ON tb_token (tokenCode);

-- 删除现有的auth表（如果存在）
DROP TABLE IF EXISTS tb_auth;

-- 创建auth表
CREATE TABLE IF NOT EXISTS tb_auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deviceCode TEXT NOT NULL,
    tokenCode TEXT NOT NULL,
    usedTime INTEGER,
    expiryTime INTEGER,
    isBanned BOOLEAN NOT NULL DEFAULT 0,
    extra_info TEXT
);
CREATE INDEX idx_deviceCode ON tb_auth (deviceCode);


-- 删除现有的token修改日志表（如果存在）
DROP TABLE IF EXISTS tb_tklog;
-- 创建token修改日志表
CREATE TABLE IF NOT EXISTS tb_tklog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    addTime INTEGER,
    tokens TEXT
);

INSERT INTO tb_admin (username, password, extra_info) 
VALUES ('admin@', '123456@', '');
