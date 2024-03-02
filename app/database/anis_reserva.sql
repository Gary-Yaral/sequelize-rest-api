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

/*Table structure for table `chair_type` */

DROP TABLE IF EXISTS `chair_type`;

CREATE TABLE `chair_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `chair_type` */

insert  into `chair_type`(`id`,`type`,`price`,`description`,`image`) values (66,'Silla con cuadritos',3,'sasf','Chair-Type-1709330339744-97d28459-cb73-4726-ad6e-bebd73f78e20..png'),(68,'sdgg',3,'dsg','Chair-Type-1707500161023-5c0f398a-b8d9-4ed9-9191-fd1b11d316b0..jpg'),(69,'dsdg',435,'ffsd','Chair-Type-1707500635940-b5615366-9906-408e-94e5-81cb7bc4e8a6..jpg'),(71,'sd Hola',32,'sdd','Chair-Type-1707756816787-cb24504c-d229-45d1-b846-d5264563494c..jpg');

/*Table structure for table `decoration_type` */

DROP TABLE IF EXISTS `decoration_type`;

CREATE TABLE `decoration_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `decoration_type` */

insert  into `decoration_type`(`id`,`type`,`price`,`description`,`image`) values (1,'Luces azules',2,'Luces azules con globos azules y marco de globos','Decoration-Type-1709335456916-929e4b92-f0f6-44d9-88d4-e3c6fd494f6b..jpg');

/*Table structure for table `dishes_type` */

DROP TABLE IF EXISTS `dishes_type`;

CREATE TABLE `dishes_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `dishes_type` */

/*Table structure for table `drink_type` */

DROP TABLE IF EXISTS `drink_type`;

CREATE TABLE `drink_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drink_type` */

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

/*Table structure for table `table_type` */

DROP TABLE IF EXISTS `table_type`;

CREATE TABLE `table_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `table_type` */

insert  into `table_type`(`id`,`type`,`price`,`description`,`image`) values (2,'Mesa redonda',1.5,'Mesa redonda para 4 presonas','Table-Type-1709331123793-4db99338-f109-43ad-86da-5e85633af6d9..jpg');

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

insert  into `user`(`id`,`dni`,`name`,`lastname`,`telephone`,`email`,`username`,`password`) values (39,'1354646737','JULIO ANDRES','DSGDS GDSGS','0934464637','nerd@gmail.com','F_Nerd2023','$2b$10$28EWTo4H40OhnGJq8nfefOR4DZ0L6yxjbTHtv2K6O6Ju.lBsXJEGe'),(50,'1323356806','ANDRES FELIPE','MERA VITERI','0945454354','andresviteri2024@gmail.com','Andres_2024','$2b$10$FYds4LtmJaU2ohd4xSLKIOhXfcFaIS7NGvktqKMFGLdMpPoYqxrdK'),(58,'1356575751','MIGUEL ANGEL','CORDERO MIRANDA','0943546342','miguelangel@gmail.com','Miusuario_2026','$2b$10$zGpaNABv19HpMnxteiZ4Z./wKNSkLQW/0RX89nJUUtLElWW/xBIQy');

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
