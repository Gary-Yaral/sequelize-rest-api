/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.32-MariaDB : Database - anis_reserva
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`anis_reserva` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `anis_reserva`;

/*Table structure for table `chair_detail` */

DROP TABLE IF EXISTS `chair_detail`;

CREATE TABLE `chair_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` double NOT NULL,
  `price` double NOT NULL,
  `packageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chairId` (`itemId`),
  KEY `chair_detail_ibfk_2` (`packageId`),
  CONSTRAINT `chair_detail_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `chair_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chair_detail_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `chair_detail` */

insert  into `chair_detail`(`id`,`itemId`,`quantity`,`total`,`price`,`packageId`) values (82,68,1,0,0,31),(83,75,1,0,0,31),(84,68,1,0,0,32),(85,75,1,0,0,32);

/*Table structure for table `chair_type` */

DROP TABLE IF EXISTS `chair_type`;

CREATE TABLE `chair_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `chair_type` */

insert  into `chair_type`(`id`,`name`,`price`,`description`,`image`) values (68,'Silla plastica 2',1.25,'Silla de plastico con espaldar de huequitos','Chair-Type-1709585192697-ba58290e-ad47-4464-a398-4b0df192d0e1..jpg'),(69,'Silla plastica 1',1,'Silla plastica marron espaldar sin huequitos','Chair-Type-1707500635940-b5615366-9906-408e-94e5-81cb7bc4e8a6..jpg'),(75,'Silla de metal',1.5,'Silla de metal color gris','Chair-Type-1709585132025-5bc395be-0dd2-4d52-8c16-09fa61e7f45f..jpg');

/*Table structure for table `decoration_detail` */

DROP TABLE IF EXISTS `decoration_detail`;

CREATE TABLE `decoration_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` double NOT NULL,
  `price` double NOT NULL,
  `packageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chairId` (`itemId`),
  KEY `packageId` (`packageId`),
  CONSTRAINT `decoration_detail_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `decoration_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `decoration_detail_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `decoration_detail` */

/*Table structure for table `decoration_type` */

DROP TABLE IF EXISTS `decoration_type`;

CREATE TABLE `decoration_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `decoration_type` */

insert  into `decoration_type`(`id`,`name`,`price`,`description`,`image`) values (1,'Decoración 1',40,'Luces azules con globos azules y marco de globos','Decoration-Type-1709335456916-929e4b92-f0f6-44d9-88d4-e3c6fd494f6b..jpg');

/*Table structure for table `dish` */

DROP TABLE IF EXISTS `dish`;

CREATE TABLE `dish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `typeId` int(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `itemId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`typeId`),
  KEY `itemId` (`itemId`),
  CONSTRAINT `dish_ibfk_5` FOREIGN KEY (`typeId`) REFERENCES `dish_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dish_ibfk_6` FOREIGN KEY (`itemId`) REFERENCES `dish_detail` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `dish` */

insert  into `dish`(`id`,`name`,`typeId`,`price`,`description`,`image`,`itemId`) values (1,'Arroz marinero',1,2.55,'Arroz marinero','Dish-1709420194268-50579a59-3623-45eb-899e-78606b8657ec..jpg',NULL);

/*Table structure for table `dish_detail` */

DROP TABLE IF EXISTS `dish_detail`;

CREATE TABLE `dish_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` double NOT NULL,
  `price` double NOT NULL,
  `packageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chairId` (`itemId`),
  KEY `packageId` (`packageId`),
  CONSTRAINT `dish_detail_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `dish` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `dish_detail_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `dish_detail` */

/*Table structure for table `dish_type` */

DROP TABLE IF EXISTS `dish_type`;

CREATE TABLE `dish_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `dish_type` */

insert  into `dish_type`(`id`,`type`) values (1,'Sopa'),(3,'Ensalada');

/*Table structure for table `drink` */

DROP TABLE IF EXISTS `drink`;

CREATE TABLE `drink` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `typeId` int(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `typeId` (`typeId`),
  CONSTRAINT `drink_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `drink_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drink` */

insert  into `drink`(`id`,`name`,`typeId`,`price`,`description`,`image`) values (2,'Pepsi',2,1.25,'Cola pepsi de 1 Litro','Drink-1709416985955-1e7d4327-c4ca-46f0-a9cf-3ff5fffabe7d..jpg'),(3,'Big Cola 3L',2,1.5,'Big Cola de 3 Litros','Drink-1709417295287-d0e3d814-cf24-43d7-8a91-6429135e5cf0..jpg');

/*Table structure for table `drink_detail` */

DROP TABLE IF EXISTS `drink_detail`;

CREATE TABLE `drink_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` double NOT NULL,
  `price` double NOT NULL,
  `packageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chairId` (`itemId`),
  KEY `packageId` (`packageId`),
  CONSTRAINT `drink_detail_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `drink` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `drink_detail_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drink_detail` */

/*Table structure for table `drink_type` */

DROP TABLE IF EXISTS `drink_type`;

CREATE TABLE `drink_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drink_type` */

insert  into `drink_type`(`id`,`type`) values (1,'Cervezas'),(2,'Cola'),(4,'Vino');

/*Table structure for table `package` */

DROP TABLE IF EXISTS `package`;

CREATE TABLE `package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `typeId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `typeId` (`typeId`),
  KEY `status` (`status`),
  CONSTRAINT `package_ibfk_2` FOREIGN KEY (`typeId`) REFERENCES `package_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `package_ibfk_3` FOREIGN KEY (`status`) REFERENCES `payment_status` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package` */

insert  into `package`(`id`,`code`,`typeId`,`name`,`status`) values (31,'8aa80cf4-d0f4-4604-9730-cc43b714773b-1709741029161',1,'Paquete 5',1),(32,'1f486cef-59ff-4d2d-b515-10c5514e1347-1709741134843',1,'Pquete 10',1);

/*Table structure for table `package_reservation` */

DROP TABLE IF EXISTS `package_reservation`;

CREATE TABLE `package_reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `packageId` int(11) NOT NULL,
  `reservationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `packageId` (`packageId`),
  KEY `reservationId` (`reservationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `package_reservation_ibfk_1` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `package_reservation_ibfk_2` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `package_reservation_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_reservation` */

/*Table structure for table `package_status` */

DROP TABLE IF EXISTS `package_status`;

CREATE TABLE `package_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_status` */

insert  into `package_status`(`id`,`status`) values (1,'DISPONIBLE'),(2,'NO DISPONIBLE');

/*Table structure for table `package_type` */

DROP TABLE IF EXISTS `package_type`;

CREATE TABLE `package_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_type` */

insert  into `package_type`(`id`,`type`) values (1,'ADMINISTRADOR'),(2,'USUARIO');

/*Table structure for table `payment` */

DROP TABLE IF EXISTS `payment`;

CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `total` double NOT NULL,
  `paymentStatusId` int(11) NOT NULL,
  `reservationId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payment` */

/*Table structure for table `payment_status` */

DROP TABLE IF EXISTS `payment_status`;

CREATE TABLE `payment_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payment_status` */

insert  into `payment_status`(`id`,`status`) values (1,'POR REVISAR'),(2,'APROBADO'),(3,'RECHAZO');

/*Table structure for table `reservation` */

DROP TABLE IF EXISTS `reservation`;

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `reservationStatusId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation` */

/*Table structure for table `reservation_status` */

DROP TABLE IF EXISTS `reservation_status`;

CREATE TABLE `reservation_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_status` */

insert  into `reservation_status`(`id`,`status`) values (1,'ES ESPERA'),(2,'APROBADA'),(3,'RECHAZADA');

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rol` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `role` */

insert  into `role`(`id`,`role`) values (2,'ADMINISTRADOR'),(1,'SUPER ADMIN'),(3,'USUARIO');

/*Table structure for table `room` */

DROP TABLE IF EXISTS `room`;

CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rent` double NOT NULL,
  `image` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `room` */

insert  into `room`(`id`,`name`,`address`,`telephone`,`email`,`rent`,`image`) values (3,'Anis 1','Perales','0985535221','aniseventos@gmai.com',250,'Room-1709476039404-d720beaf-1496-4a7d-8d1c-31393366d7e7..jpg');

/*Table structure for table `table_detail` */

DROP TABLE IF EXISTS `table_detail`;

CREATE TABLE `table_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` double NOT NULL,
  `price` double NOT NULL,
  `packageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chairId` (`itemId`),
  KEY `packageId` (`packageId`),
  CONSTRAINT `table_detail_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `table_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `table_detail_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `table_detail` */

/*Table structure for table `table_type` */

DROP TABLE IF EXISTS `table_type`;

CREATE TABLE `table_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `table_type` */

insert  into `table_type`(`id`,`name`,`price`,`description`,`image`) values (2,'Mesa 1',1.5,'Mesa redonda para 4 presonas','Table-Type-1709331123793-4db99338-f109-43ad-86da-5e85633af6d9..jpg');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dni` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`dni`,`name`,`lastname`,`telephone`,`email`,`username`,`password`) values (39,'1354646737','JULIO ANDRES','GAVILANEZ MORA','0934464637','nerd@gmail.com','F_Nerd2023','$2b$10$28EWTo4H40OhnGJq8nfefOR4DZ0L6yxjbTHtv2K6O6Ju.lBsXJEGe'),(50,'1323356806','ANDRES FELIPE','MERA VITERI','0945454354','andresviteri2024@gmail.com','Andres_2024','$2b$10$FYds4LtmJaU2ohd4xSLKIOhXfcFaIS7NGvktqKMFGLdMpPoYqxrdK'),(58,'1356575751','MIGUEL ANGEL','CORDERO MIRANDA','0943546342','miguelangel@gmail.com','Miusuario_2026','$2b$10$zGpaNABv19HpMnxteiZ4Z./wKNSkLQW/0RX89nJUUtLElWW/xBIQy');

/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_roles_ibfk_1` (`roleId`),
  KEY `user_roles_ibfk_2` (`userId`),
  KEY `user_roles_ibfk_3` (`statusId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `user_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_roles` */

insert  into `user_roles`(`id`,`roleId`,`userId`,`statusId`) values (10,1,39,1),(16,3,50,1),(18,2,58,1);

/*Table structure for table `user_status` */

DROP TABLE IF EXISTS `user_status`;

CREATE TABLE `user_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rol` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_status` */

insert  into `user_status`(`id`,`name`) values (1,'ACTIVO'),(2,'BLOQUEADO');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
