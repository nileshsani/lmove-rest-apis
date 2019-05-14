CREATE DATABASE IF NOT EXISTS lmove_db;
USE lmove_db;

CREATE USER 'appuser'@'%' IDENTIFIED BY 'hakunamatata';
GRANT ALL PRIVILEGES ON lmove_db.* TO 'appuser'@'%';

CREATE TABLE IF NOT EXISTS orders (
    first_name varchar(25)
);