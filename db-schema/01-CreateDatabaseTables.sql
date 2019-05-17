CREATE DATABASE IF NOT EXISTS lmove_db;
USE lmove_db;

CREATE USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'hakunamatata';
GRANT ALL PRIVILEGES ON lmove_db.* TO 'appuser'@'%';

CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `distance` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;