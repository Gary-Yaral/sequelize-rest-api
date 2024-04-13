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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation` */

insert  into `reservation`(`id`,`date`,`userRoleId`,`roomId`,`packageId`,`statusId`,`currentDate`,`scheduleTypeId`) values (29,'2024-04-21',10,7,65,1,'2024-04-11',1),(30,'2024-04-26',10,7,NULL,1,'2024-04-11',2),(31,'2024-04-24',10,7,NULL,1,'2024-04-11',2);

/*Table structure for table `reservation_package` */

DROP TABLE IF EXISTS `reservation_package`;

CREATE TABLE `reservation_package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemId` int(11) NOT NULL,
  `quantity` double NOT NULL,
  `price` double NOT NULL,
  `reservationId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemId` (`itemId`),
  KEY `reservation_package_ibfk_1` (`reservationId`),
  CONSTRAINT `reservation_package_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reservation_package_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_package` */

insert  into `reservation_package`(`id`,`itemId`,`quantity`,`price`,`reservationId`) values (18,18,1,33,29),(19,19,1,43,29);

/*Table structure for table `reservation_schedule` */

DROP TABLE IF EXISTS `reservation_schedule`;

CREATE TABLE `reservation_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `initialTime` time NOT NULL,
  `finalTime` time NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_time_detail_ibfk_1` (`reservationId`),
  CONSTRAINT `reservation_schedule_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `reservation_schedule` */

insert  into `reservation_schedule`(`id`,`reservationId`,`initialTime`,`finalTime`,`price`) values (22,29,'01:00:00','05:30:00',50),(23,30,'00:00:00','23:30:00',240),(24,31,'00:00:00','23:30:00',240);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `room` */

insert  into `room`(`id`,`name`,`address`,`telephone`,`email`,`description`,`image`,`m2`,`capacity`,`minTimeRent`) values (7,'ANIS','Perales y la que cruza','0943546342','miguelangel@gmail.com','dsgsdgg','LOCAL-1712970308512-621d89c8-68f7-445e-bb3a-231010898d1e..jpg',200,400,4),(9,'ANIS 2','dssd dsd','0923523466','dgsdgsg@gmail.com','2 baños, 1 cocina, 1 sala de karaoke','LOCAL-1712971931351-f4a0a52e-35cb-41ba-90cb-f4ecb5c8b0ba..jpg',600,350,3);

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

/* Procedure structure for procedure `CountReservationsByFilter` */

/*!50003 DROP PROCEDURE IF EXISTS  `CountReservationsByFilter` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `CountReservationsByFilter`(IN filter VARCHAR(500))
SELECT COUNT(*) AS `count`
	FROM (
	SELECT 
		r.id,
		r.roomId,
		r.currentDate,
		rsch.initialTime,
		rsch.finalTime,
		r.date,
		r.timeTypeId,
		r.packageId,
		rs.status,
		rm.capacity,
		rm.image,
		rm.m2,
		CONCAT(u.name, ' ', u.lastname) AS userName,
		rl.role,
		rm.name AS roomName,
		COALESCE(SUM(rp.price * rp.quantity), 0) AS payPerPackage,
		rtt.type,
		COALESCE(CONVERT(TRUNCATE(TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rsch.initialTime)) / 3600, 2), DOUBLE), 0) AS hours,
		CASE 
			WHEN r.timeTypeId = 1 THEN 0
			ELSE 1
		END AS days,
		rtd.price,
		CASE 
		    WHEN r.timeTypeId = 1 THEN COALESCE((rtdl.price * (TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rsch.initialTime)) / 3600)), 0)
		    ELSE rtd.price
		END AS payPerLocal,
		CASE 
		    WHEN COALESCE(SUM(rp.price * rp.quantity), 0) = 0  THEN 'N0'
		    ELSE 'SI'
		END AS includePackage,
		pk.name AS packageName
	    FROM 
		reservation r
	    LEFT JOIN 
		reservation_package rp ON r.id = rp.reservationId
	    LEFT JOIN
		room rm ON r.roomId = rm.id
	    LEFT JOIN
		reservation_status rs ON r.statusId = rs.id
	    LEFT JOIN
		reservation_schedule rsch ON r.id = rsch.reservationId
	    LEFT JOIN
		room_time_detail rtdl ON r.timeTypeId = rtdl.id AND r.roomId = rtdl.roomId
	    LEFT JOIN
		room_time_type rtt ON rtdl.timeType = rtt.id
	    LEFT JOIN
		user_roles ur ON r.userRoleId = ur.id
	    LEFT JOIN
		USER u ON ur.userId = u.id
	    LEFT JOIN
		role rl ON rl.id = ur.roleId
	    LEFT JOIN
		package pk ON r.packageId = pk.id
	    GROUP BY 
		r.id
	) AS subquery
	WHERE 
		subquery.currentDate LIKE CONCAT('%', filter, '%') OR
		subquery.initialTime LIKE CONCAT('%', filter, '%') OR
		subquery.finalTime LIKE CONCAT('%', filter, '%') OR
		subquery.date LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.status) LIKE LOWER(CONCAT('%', filter, '%')) OR
		subquery.capacity LIKE CONCAT('%', filter, '%') OR
		subquery.m2 LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.userName) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.role) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.roomName) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.payPerPackage) LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.type) LIKE LOWER(CONCAT('%', filter, '%')) OR
		subquery.hours LIKE CONCAT('%', filter, '%') OR
		subquery.days LIKE CONCAT('%', filter, '%') OR
		subquery.price LIKE CONCAT('%', filter, '%') OR
		subquery.payPerLocal LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.includePackage) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.packageName) LIKE LOWER(CONCAT('%', filter, '%')) */$$
DELIMITER ;

/* Procedure structure for procedure `GetHours` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetHours` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetHours`(IN room_id INT, IN found_date DATE, IN ini_time VARCHAR(100), IN fin_time VARCHAR(100))
SELECT 
		rsch.id,
		rsch.reservationId,
		case 
		when rsch.initialTime = '00:00' and rsch.finalTime = '23:30' then '- Reservado todo el día'
		else CONCAT('- ','Reservado de ', rsch.initialTime, ' a ',rsch.finalTime)
		end as selected
	FROM reservation_schedule rsch
	INNER JOIN reservation r
	ON r.id = rsch.reservationId
	WHERE r.date = found_date AND r.roomId = room_id AND (ini_time < rsch.finalTime AND fin_time > rsch.initialTime) */$$
DELIMITER ;

/* Procedure structure for procedure `GetReservationsByFilterPagination` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetReservationsByFilterPagination` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReservationsByFilterPagination`(IN limit_value INT, offset_value INT, IN filter VARCHAR(500))
SELECT *
	FROM (
	SELECT 
		r.id,
		r.roomId,
		r.currentDate,
		rsch.initialTime,
		rsch.finalTime,
		r.date,
		r.timeTypeId,
		r.packageId,
		rs.status,
		rm.capacity,
		rm.image,
		rm.m2,
		CONCAT(u.name, ' ', u.lastname) AS userName,
		rl.role,
		rm.name AS roomName,
		COALESCE(SUM(rp.price * rp.quantity), 0) AS payPerPackage,
		rtt.type,
		COALESCE(CONVERT(TRUNCATE(TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rsch.initialTime)) / 3600, 2), DOUBLE), 0) AS hours,
		CASE 
			WHEN r.timeTypeId = 1 THEN 0
			ELSE 1
		END AS days,
		rtd.price,
		CASE 
		    WHEN r.timeTypeId = 1 THEN COALESCE((rsch.price * (TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rtd.initialTime)) / 3600)), 0)
		    ELSE rtd.price
		END AS payPerLocal,
		CASE 
		    WHEN COALESCE(SUM(rp.price * rp.quantity), 0) = 0  THEN 'N0'
		    ELSE 'SI'
		END AS includePackage,
		pk.name AS packageName
	    FROM 
		reservation r
	    LEFT JOIN 
		reservation_package rp ON r.id = rp.reservationId
	    LEFT JOIN
		room rm ON r.roomId = rm.id
	    LEFT JOIN
		reservation_status rs ON r.statusId = rs.id
	    LEFT JOIN
		reservation_schedule rsch ON r.id = rsch.reservationId
	    LEFT JOIN
		room_time_detail rtdl ON r.timeTypeId = rtdl.id AND r.roomId = rtdl.roomId
	    LEFT JOIN
		room_time_type rtt ON rtdl.timeType = rtt.id
	    LEFT JOIN
		user_roles ur ON r.userRoleId = ur.id
	    LEFT JOIN
		USER u ON ur.userId = u.id
	    LEFT JOIN
		role rl ON rl.id = ur.roleId
	    LEFT JOIN
		package pk ON r.packageId = pk.id
	    GROUP BY 
		r.id
	) AS subquery
	WHERE 
		subquery.currentDate LIKE CONCAT('%', filter, '%') OR
		subquery.initialTime LIKE CONCAT('%', filter, '%') OR
		subquery.finalTime LIKE CONCAT('%', filter, '%') OR
		subquery.date LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.status) LIKE LOWER(CONCAT('%', filter, '%')) OR
		subquery.capacity LIKE CONCAT('%', filter, '%') OR
		subquery.m2 LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.userName) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.role) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.roomName) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.payPerPackage) LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.type) LIKE LOWER(CONCAT('%', filter, '%')) OR
		subquery.hours LIKE CONCAT('%', filter, '%') OR
		subquery.days LIKE CONCAT('%', filter, '%') OR
		subquery.price LIKE CONCAT('%', filter, '%') OR
		subquery.payPerLocal LIKE CONCAT('%', filter, '%') OR
		LOWER(subquery.includePackage) LIKE LOWER(CONCAT('%', filter, '%')) OR
		LOWER(subquery.packageName) LIKE LOWER(CONCAT('%', filter, '%'))
	LIMIT limit_value OFFSET offset_value */$$
DELIMITER ;

/* Procedure structure for procedure `GetReservationsByPagination` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetReservationsByPagination` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReservationsByPagination`(IN offset_value INT, IN limit_value INT)
BEGIN
    SELECT 
        r.id,
        r.roomId,
        r.currentDate,
        rsch.initialTime,
        rsch.finalTime,
        r.date,
        r.timeTypeId,
        r.packageId,
        rs.status,
        rm.capacity,
        rm.image,
        rm.m2,
        CONCAT(u.name, ' ', u.lastname) AS userName,
        rl.role,
        rm.name AS roomName,
        COALESCE(SUM(rp.price * rp.quantity), 0) AS payPerPackage,
        rtt.type,
        COALESCE(CONVERT(TRUNCATE(TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rsch.initialTime)) / 3600, 2), DOUBLE), 0) AS hours,
        CASE 
            WHEN r.timeTypeId = 1 THEN 0
            ELSE 1
        END AS days,
        rtd.price,
        CASE 
            WHEN r.timeTypeId = 1 THEN COALESCE((rsch.price * (TIME_TO_SEC(TIMEDIFF(rsch.finalTime, rtd.initialTime)) / 3600)), 0)
            ELSE rtd.price
        END AS payPerLocal,
        CASE 
            WHEN COALESCE(SUM(rp.price * rp.quantity), 0) = 0  THEN 'N0'
            ELSE 'SI'
        END AS includePackage,
        pk.name AS packageName
    FROM 
        reservation r
    LEFT JOIN 
        reservation_package rp ON r.id = rp.reservationId
    LEFT JOIN
        room rm ON r.roomId = rm.id
    LEFT JOIN
        reservation_status rs ON r.statusId = rs.id
    LEFT JOIN
        reservation_schedule rsch ON r.id = rsch.reservationId
    LEFT JOIN
        room_time_detail rtdl ON r.timeTypeId = rtdl.id AND r.roomId = rtdl.roomId
    LEFT JOIN
        room_time_type rtt ON rtdl.timeType = rtt.id
    LEFT JOIN
        user_roles ur ON r.userRoleId = ur.id
    LEFT JOIN
        USER u ON ur.userId = u.id
    LEFT JOIN
        role rl ON rl.id = ur.roleId
    LEFT JOIN
        package pk ON r.packageId = pk.id
    GROUP BY 
        r.id
    LIMIT offset_value, limit_value;
END */$$
DELIMITER ;

/* Procedure structure for procedure `ValidateHours` */

/*!50003 DROP PROCEDURE IF EXISTS  `ValidateHours` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `ValidateHours`(in room_id int, in found_date date, in ini_time varchar(100), in fin_time varchar(100))
SELECT count(*) as total
	FROM reservation_schedule rsch
	inner join reservation r
	ON r.id = rsch.reservationId
	WHERE r.date = found_date and r.roomId = room_id AND (ini_time < rsch.finalTime AND fin_time > rsch.initialTime) */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
