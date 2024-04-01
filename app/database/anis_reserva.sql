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

/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `category` */

insert  into `category`(`id`,`name`) values (1,'SILLAS'),(2,'MESAS'),(3,'BEBIDAS'),(4,'DECORACIONES'),(5,'COMIDA');

/*Table structure for table `item` */

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `subcategoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subcatId` (`subcategoryId`),
  CONSTRAINT `item_ibfk_2` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategory` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `item` */

insert  into `item`(`id`,`name`,`price`,`description`,`image`,`subcategoryId`) values (18,'DFSD',33,'dsds','DOS-1712005294067-ebcafd4f-2fea-42fd-82e2-b0af6ddf2fb4..jpg',7),(19,'GFDG',43,'fdgfg','UNO-1711930234753-beff5785-109c-4678-9cf0-a69b822a1416..jpg',3),(20,'PILSENER',1.5,'Cervez Pilsener','CERVEZA-1711975956774-53e1bc96-f472-4283-98a6-de31209553ea..jpg',8);

/*Table structure for table `package` */

DROP TABLE IF EXISTS `package`;

CREATE TABLE `package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `userRoleId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`userRoleId`),
  KEY `package_ibfk_3` (`status`),
  CONSTRAINT `package_ibfk_3` FOREIGN KEY (`status`) REFERENCES `package_status` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `package_ibfk_4` FOREIGN KEY (`userRoleId`) REFERENCES `user_roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package` */

insert  into `package`(`id`,`name`,`status`,`userRoleId`) values (55,'PAQUETE 1',1,10),(56,'PAQUETE 2',1,10);

/*Table structure for table `package_detail` */

DROP TABLE IF EXISTS `package_detail`;

CREATE TABLE `package_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `packageId` int(11) NOT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` double NOT NULL,
  `price` double NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemId` (`itemId`),
  KEY `package_detail_ibfk_1` (`packageId`),
  CONSTRAINT `package_detail_ibfk_1` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `package_detail_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_detail` */

insert  into `package_detail`(`id`,`packageId`,`itemId`,`quantity`,`price`,`date`) values (18,55,18,1,33,'2024-04-01 12:51:06'),(20,56,20,3,1.5,'2024-04-01 13:00:29');

/*Table structure for table `package_status` */

DROP TABLE IF EXISTS `package_status`;

CREATE TABLE `package_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_status` */

insert  into `package_status`(`id`,`status`) values (1,'DISPONIBLE'),(2,'NO DISPONIBLE');

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
  `date` date NOT NULL,
  `userId` int(11) NOT NULL,
  `initialTime` time NOT NULL,
  `finalTime` time NOT NULL,
  `roomId` int(11) NOT NULL,
  `packageId` int(11) DEFAULT NULL,
  `statusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statusId` (`statusId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `reservation_status` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation` */

/*Table structure for table `reservation_detail` */

DROP TABLE IF EXISTS `reservation_detail`;

CREATE TABLE `reservation_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` double NOT NULL,
  `price` double NOT NULL,
  `reservationId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservationId` (`reservationId`),
  CONSTRAINT `reservation_detail_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_detail` */

/*Table structure for table `reservation_status` */

DROP TABLE IF EXISTS `reservation_status`;

CREATE TABLE `reservation_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_status` */

insert  into `reservation_status`(`id`,`status`) values (1,'EN ESPERA'),(2,'APROBADA'),(3,'RECHAZADA');

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
  `description` varchar(1000) NOT NULL,
  `image` varchar(500) NOT NULL,
  `m2` double NOT NULL,
  `perDay` double NOT NULL,
  `perHour` double NOT NULL,
  `perMonth` double NOT NULL,
  `capacity` double NOT NULL,
  `minTimeRent` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `room` */

insert  into `room`(`id`,`name`,`address`,`telephone`,`email`,`description`,`image`,`m2`,`perDay`,`perHour`,`perMonth`,`capacity`,`minTimeRent`) values (7,'ANIS','Perales y la que cruza','0943546342','miguelangel@gmail.com','dsgsdgg','Local-1712005038933-6cc587d1-b7d8-4bc3-b51a-ec4165979821..jpg',200,500,150,150,400,2.5);

/*Table structure for table `schedule` */

DROP TABLE IF EXISTS `schedule`;

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timeRange` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `schedule` */

/*Table structure for table `subcategory` */

DROP TABLE IF EXISTS `subcategory`;

CREATE TABLE `subcategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `subcategory` */

insert  into `subcategory`(`id`,`name`,`categoryId`) values (3,'UNO',2),(7,'DOS',2),(8,'CERVEZA',3);

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
