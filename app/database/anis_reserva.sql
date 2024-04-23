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
  `publicId` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subcatId` (`subcategoryId`),
  CONSTRAINT `item_ibfk_2` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategory` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `item` */

insert  into `item`(`id`,`name`,`price`,`description`,`image`,`subcategoryId`,`publicId`) values (18,'DFSD',33,'dsds','https://res.cloudinary.com/dcougeze6/image/upload/v1713485507/anis_app/ehjqxh4tewjpasfydezz.jpg',7,'anis_app/ehjqxh4tewjpasfydezz'),(19,'GFDG',43,'fdgfg','https://res.cloudinary.com/dcougeze6/image/upload/v1713485493/anis_app/tnv99ff4ccjscphc3rem.jpg',3,'anis_app/tnv99ff4ccjscphc3rem'),(20,'PILSENER',1.5,'Cervez Pilsener','https://res.cloudinary.com/dcougeze6/image/upload/v1713485377/anis_app/tjsuoclndrcofmppnwim.jpg',8,'anis_app/tjsuoclndrcofmppnwim');

/*Table structure for table `package` */

DROP TABLE IF EXISTS `package`;

CREATE TABLE `package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `userRoleId` int(11) NOT NULL,
  `lastUpdate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`userRoleId`),
  KEY `package_ibfk_3` (`status`),
  CONSTRAINT `package_ibfk_3` FOREIGN KEY (`status`) REFERENCES `package_status` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `package_ibfk_4` FOREIGN KEY (`userRoleId`) REFERENCES `user_roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package` */

insert  into `package`(`id`,`name`,`status`,`userRoleId`,`lastUpdate`) values (65,'PAQUETE 5',1,10,'2024-04-02 21:12:02');

/*Table structure for table `package_detail` */

DROP TABLE IF EXISTS `package_detail`;

CREATE TABLE `package_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `packageId` int(11) NOT NULL,
  `itemId` int(11) DEFAULT NULL,
  `quantity` double NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemId` (`itemId`),
  KEY `package_detail_ibfk_1` (`packageId`),
  CONSTRAINT `package_detail_ibfk_1` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `package_detail_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `package_detail` */

insert  into `package_detail`(`id`,`packageId`,`itemId`,`quantity`,`price`) values (18,65,18,1,33),(19,65,19,1,43);

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
  `id` varchar(100) NOT NULL DEFAULT '''UUID()''',
  `date` date NOT NULL,
  `total` double NOT NULL,
  `paymentStatusId` int(11) NOT NULL,
  `reservationId` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `publicId` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paymentStatusId` (`paymentStatusId`),
  KEY `reservationId` (`reservationId`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`paymentStatusId`) REFERENCES `payment_status` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payment` */

insert  into `payment`(`id`,`date`,`total`,`paymentStatusId`,`reservationId`,`image`,`publicId`) values ('0440cda6-5e0f-4fae-859f-4dfe10edc8c6','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg'),('31f9930f-f6d3-41fe-898d-0d2f07b63cb1','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg'),('51af957a-150f-4d7c-b357-ebaa1a222d76','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg'),('709e7895-3d14-4299-89dc-3b4c455dba85','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg'),('af77d01a-1356-4031-8b0e-9452ae284de5','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg'),('b9b3179b-ebc8-4896-8aef-777bbcd7bd5d','2024-04-23',392,1,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','https://res.cloudinary.com/dcougeze6/image/upload/v1713791767/defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg','defaults/815f364da297076f597bec74fc7853d0_t_k2h3uv.jpg');

/*Table structure for table `payment_status` */

DROP TABLE IF EXISTS `payment_status`;

CREATE TABLE `payment_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payment_status` */

insert  into `payment_status`(`id`,`status`) values (1,'POR REVISAR'),(2,'APROBADO'),(3,'RECHAZO');

/*Table structure for table `qualification` */

DROP TABLE IF EXISTS `qualification`;

CREATE TABLE `qualification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userRoleId` int(11) NOT NULL,
  `stars` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userRoleId` (`userRoleId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `qualification_ibfk_1` FOREIGN KEY (`userRoleId`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `qualification_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `qualification` */

/*Table structure for table `reservation` */

DROP TABLE IF EXISTS `reservation`;

CREATE TABLE `reservation` (
  `id` varchar(100) NOT NULL DEFAULT 'UUID()',
  `date` date NOT NULL,
  `userRoleId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `packageId` int(11) DEFAULT NULL,
  `statusId` int(11) NOT NULL,
  `currentDate` date NOT NULL,
  `scheduleTypeId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statusId` (`statusId`),
  KEY `roomId` (`roomId`),
  KEY `userRoleId` (`userRoleId`),
  KEY `reservation_ibfk_4` (`scheduleTypeId`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `reservation_status` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`userRoleId`) REFERENCES `user_roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_ibfk_4` FOREIGN KEY (`scheduleTypeId`) REFERENCES `schedule_type` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation` */

insert  into `reservation`(`id`,`date`,`userRoleId`,`roomId`,`packageId`,`statusId`,`currentDate`,`scheduleTypeId`) values ('93a0cab7-eb58-4e25-ad86-d1da5dec62e3','2024-04-20',10,7,65,2,'2024-04-23',2);

/*Table structure for table `reservation_package` */

DROP TABLE IF EXISTS `reservation_package`;

CREATE TABLE `reservation_package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` double NOT NULL,
  `price` double NOT NULL,
  `reservationId` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemId` (`itemId`),
  KEY `reservationId` (`reservationId`),
  CONSTRAINT `reservation_package_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_package_ibfk_3` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_package` */

insert  into `reservation_package`(`id`,`itemId`,`quantity`,`price`,`reservationId`) values (58,18,1,33,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3'),(59,19,1,43,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3');

/*Table structure for table `reservation_schedule` */

DROP TABLE IF EXISTS `reservation_schedule`;

CREATE TABLE `reservation_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` varchar(100) NOT NULL,
  `initialTime` time NOT NULL,
  `finalTime` time NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservationId` (`reservationId`),
  CONSTRAINT `reservation_schedule_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_schedule` */

insert  into `reservation_schedule`(`id`,`reservationId`,`initialTime`,`finalTime`,`price`) values (53,'93a0cab7-eb58-4e25-ad86-d1da5dec62e3','00:00:00','23:30:00',240);

/*Table structure for table `reservation_status` */

DROP TABLE IF EXISTS `reservation_status`;

CREATE TABLE `reservation_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_status` */

insert  into `reservation_status`(`id`,`status`) values (1,'EN ESPERA'),(2,'APROBADA'),(3,'RECHAZADA');

/*Table structure for table `reservation_type` */

DROP TABLE IF EXISTS `reservation_type`;

CREATE TABLE `reservation_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` int(11) NOT NULL,
  `scheduleTypeId` int(11) NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roomId` (`roomId`),
  KEY `reservation_type_ibfk_2` (`scheduleTypeId`),
  CONSTRAINT `reservation_type_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservation_type_ibfk_2` FOREIGN KEY (`scheduleTypeId`) REFERENCES `schedule_type` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_type` */

insert  into `reservation_type`(`id`,`roomId`,`scheduleTypeId`,`price`) values (1,7,1,50),(2,7,2,240),(4,9,1,60),(5,9,2,350);

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
  `capacity` double NOT NULL,
  `minTimeRent` double NOT NULL,
  `publicId` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `room` */

insert  into `room`(`id`,`name`,`address`,`telephone`,`email`,`description`,`image`,`m2`,`capacity`,`minTimeRent`,`publicId`) values (7,'ANIS','Perales y la que cruza','0943546342','miguelangel@gmail.com','dsgsdgg','https://res.cloudinary.com/dcougeze6/image/upload/v1713487155/anis_app/woww4lry3ofybb6q049j.jpg',200,400,4,'anis_app/woww4lry3ofybb6q049j'),(9,'ANIS 2','dssd dsd','0923523466','dgsdgsg@gmail.com','2 baños, 1 cocina, 1 sala de karaoke','https://res.cloudinary.com/dcougeze6/image/upload/v1713487218/anis_app/egq0qcr0bv9rojeh9opm.jpg',600,350,3,'anis_app/egq0qcr0bv9rojeh9opm');

/*Table structure for table `schedule_type` */

DROP TABLE IF EXISTS `schedule_type`;

CREATE TABLE `schedule_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `schedule_type` */

insert  into `schedule_type`(`id`,`type`) values (1,'POR HORA'),(2,'POR DIA');

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

insert  into `user`(`id`,`dni`,`name`,`lastname`,`telephone`,`email`,`username`,`password`) values (39,'1354646737','JULIO ANDRES','GAVILANEZ MORA','0934464637','anisappreservation@gmail.com','F_Nerd2023','$2b$10$28EWTo4H40OhnGJq8nfefOR4DZ0L6yxjbTHtv2K6O6Ju.lBsXJEGe'),(50,'1323356806','ANDRES FELIPE','MERA VITERI','0945454354','andresviteri2024@gmail.com','Andres_2024','$2b$10$FYds4LtmJaU2ohd4xSLKIOhXfcFaIS7NGvktqKMFGLdMpPoYqxrdK'),(58,'1356575751','MIGUEL ANGEL','CORDERO MIRANDA','0943546342','miguelangel@gmail.com','Miusuario_2026','$2b$10$zGpaNABv19HpMnxteiZ4Z./wKNSkLQW/0RX89nJUUtLElWW/xBIQy');

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
