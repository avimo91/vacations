CREATE DATABASE  IF NOT EXISTS `vacation_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vacation_system`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vacation_system
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`userId`,`vacationId`),
  KEY `vacations_idx` (`vacationId`),
  CONSTRAINT `users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vacations` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (6,1),(7,1),(6,3),(7,3),(4,4),(7,4),(4,5),(7,5),(4,6),(6,7),(4,9),(6,10),(4,11),(7,11),(6,12);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Avi','Moyal','avi-test@example.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683','User'),(4,'Avim','Moyaln','avi12-test@example.com','466cfef59b93225ba7a61018f7c6f2bcb59de4aa5c58f3d688172ef8819e9a131af18b5c8434a403c61d1d370eae5628f661f490725e5b4c9b85651ca0f4f683','User'),(5,'Admin','Vacations','admin-vacations@example.com','b413fd79b57d6b639aae63594365bc8f865ca0a3c3de8cd19c0157b011b9c6ad23cf273f874e2fb0f92547821bb42b2ed1dd72f0932d71a224f29f0d33e5dfbb','Admin'),(6,'David','Cohen','david.test@example.com','3025f76441adbc52987def7415cd45d638c4ba2cf8dc4b5c305f70b55d83904ff930ad9f0b8b3a37219fd0a0789ea7d16dc777e8eff84a4762fde44763ccdaa5','User'),(7,'Daniel','Levi','daniel.test@example.com','3025f76441adbc52987def7415cd45d638c4ba2cf8dc4b5c305f70b55d83904ff930ad9f0b8b3a37219fd0a0789ea7d16dc777e8eff84a4762fde44763ccdaa5','User');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacationId` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageName` varchar(255) NOT NULL,
  PRIMARY KEY (`vacationId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Rome, Italy','Five days exploring Rome','2026-12-01','2026-12-05',2500.00,'rome.jpg'),(2,'Paris, France','Explore the Eiffel Tower, Louvre Museum and charming streets of Paris.','2026-11-10','2026-11-16',3200.00,'paris.jpg'),(3,'Tokyo, Japan','Discover Japanese culture, temples, shopping districts and traditional cuisine.','2027-03-15','2027-03-25',8500.00,'tokyo.jpg'),(4,'Barcelona, Spain','Enjoy Gaudi architecture, Mediterranean beaches and vibrant city life.','2026-09-05','2026-09-12',2800.00,'barcelona.jpg'),(5,'Amsterdam, Netherlands','Explore picturesque canals, museums and historic neighborhoods.','2026-12-20','2026-12-26',3500.00,'amsterdam.jpg'),(6,'Athens, Greece','Visit the Acropolis, ancient landmarks and traditional Greek restaurants.','2026-08-10','2026-08-17',2400.00,'athens.jpg'),(7,'New York, USA','Experience Times Square, Central Park, Broadway and Manhattan.','2027-04-10','2027-04-20',9200.00,'new-york.jpg'),(8,'Prague, Czech Republic','Discover medieval architecture, Prague Castle and the Old Town.','2026-10-01','2026-10-07',2200.00,'prague.jpg'),(9,'London, United Kingdom','Explore Buckingham Palace, the British Museum and the River Thames.','2026-11-20','2026-11-27',4200.00,'london.jpg'),(10,'Bangkok, Thailand','Enjoy colorful markets, Buddhist temples and authentic Thai street food.','2027-01-12','2027-01-22',6500.00,'bangkok.jpg'),(11,'Lisbon, Portugal','Discover historic trams, beautiful viewpoints and Portuguese cuisine.','2026-07-15','2026-07-22',2600.00,'lisbon.jpg'),(12,'Dubai, UAE','Experience modern skyscrapers, desert adventures and luxury shopping.','2027-02-05','2027-02-12',5800.00,'dubai.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 22:15:41
