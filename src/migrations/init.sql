

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `methods` varchar(255) NOT NULL,
  `data` varchar(255) NOT NULL,
  `result` int NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a1196a1956403417fe3a0343390` (`userId`),
  CONSTRAINT `FK_a1196a1956403417fe3a0343390` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


BEGIN;
COMMIT;


DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `acl` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


BEGIN;
COMMIT;


DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` int NOT NULL,
  `photo` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_a24972ebd73b106250713dcddd` (`userId`),
  CONSTRAINT `FK_a24972ebd73b106250713dcddd9` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


BEGIN;
COMMIT;


DROP TABLE IF EXISTS `role_menus`;
CREATE TABLE `role_menus` (
  `menuId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`menuId`,`rolesId`),
  KEY `IDX_b447ba2d495fdf8e4a489afa3f` (`menuId`),
  KEY `IDX_135e41fb3c98312c5f171fe9f1` (`rolesId`),
  CONSTRAINT `FK_135e41fb3c98312c5f171fe9f1c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_b447ba2d495fdf8e4a489afa3fc` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


BEGIN;
COMMIT;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


BEGIN;
INSERT INTO `roles` (`id`, `name`) VALUES (1, '管理员用户');
INSERT INTO `roles` (`id`, `name`) VALUES (2, '普通用户');
COMMIT;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `createdBy` int DEFAULT NULL COMMENT '创建者',
  `updatedAt` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `updatedBy` int DEFAULT NULL COMMENT '修改者',
  `deletedAt` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `deletedBy` int DEFAULT NULL COMMENT '删除者',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles` (
  `userId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`userId`,`rolesId`),
  KEY `IDX_776b7cf9330802e5ef5a8fb18d` (`userId`),
  KEY `IDX_21db462422f1f97519a29041da` (`rolesId`),
  CONSTRAINT `FK_21db462422f1f97519a29041da0` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_776b7cf9330802e5ef5a8fb18dc` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SET FOREIGN_KEY_CHECKS = 1;
