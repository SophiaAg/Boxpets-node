CREATE DATABASE  IF NOT EXISTS `bvgqmhhfrhckmih6zmov` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bvgqmhhfrhckmih6zmov`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: bvgqmhhfrhckmih6zmov-mysql.services.clever-cloud.com    Database: bvgqmhhfrhckmih6zmov
-- ------------------------------------------------------
-- Server version	8.0.15-5

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'f41d366d-91e5-11e9-8525-cecd028ee826:1-143581802';

--
-- Table structure for table `CARTERINHA_PET`
--

DROP TABLE IF EXISTS `CARTERINHA_PET`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CARTERINHA_PET` (
  `ID_PET` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_PET` varchar(45) NOT NULL,
  `IDADE_PET` varchar(45) NOT NULL,
  `SEXO_PET` varchar(45) NOT NULL,
  `PORTE_PET` varchar(45) NOT NULL,
  `RACA_PET` varchar(45) NOT NULL,
  `ID_CLIENTE` int(11) NOT NULL,
  `img_pet` varchar(60) NOT NULL,
  PRIMARY KEY (`ID_PET`),
  KEY `ID_CLIENTE_CLIENTES_idx` (`ID_CLIENTE`),
  CONSTRAINT `ID_CLIENTE_CLIENTES` FOREIGN KEY (`ID_CLIENTE`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CARTERINHA_PET`
--

LOCK TABLES `CARTERINHA_PET` WRITE;
/*!40000 ALTER TABLE `CARTERINHA_PET` DISABLE KEYS */;
INSERT INTO `CARTERINHA_PET` VALUES (1,'Simba','18','Macho','Medio','amarelo',3,'imgPet-1728752878686.jpg'),(2,'1','4','Macho','Pequeno','1',3,'imgPet-1728753008220.jpg'),(3,'1','s','Macho','Pequeno','1',3,'imgPet-1728756526784.jpg'),(4,'1','18','Macho','Pequeno','1',3,'imgPet-1728756629545.jpg'),(5,'1','s','Macho','Pequeno','1',3,'imgPet-1728756970429.jpg');
/*!40000 ALTER TABLE `CARTERINHA_PET` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENTE`
--

DROP TABLE IF EXISTS `CLIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENTE` (
  `TEID_CLIEN` int(11) NOT NULL AUTO_INCREMENT,
  `EMAIL_CLIENTE` varchar(50) NOT NULL,
  `CELULAR_CLIENTE` varchar(15) NOT NULL,
  `NOME_CLIENTE` varchar(70) NOT NULL,
  `SENHA_CLIENTE` varchar(60) NOT NULL,
  `CPF_CLIENTE` char(14) NOT NULL,
  `DATA_NASC_CLIENTE` date NOT NULL,
  `CIDADE_CLIENTE` varchar(60) DEFAULT NULL,
  `LOGRADOURO_CLIENTE` varchar(100) DEFAULT NULL,
  `UF_CLIENTE` char(2) DEFAULT NULL,
  `CEP_CLINTE` char(8) DEFAULT NULL,
  `BAIRRO_CLIENTE` varchar(11) DEFAULT NULL,
  `FK_ID_ONGS` int(11) DEFAULT NULL,
  `img_perfil_pasta` varchar(80) DEFAULT NULL,
  `img_perfil_banco` longblob,
  PRIMARY KEY (`ID_CLIENTE`),
  KEY `FK_ID_ONGS` (`FK_ID_ONGS`),
  CONSTRAINT `CLIENTE_ibfk_1` FOREIGN KEY (`FK_ID_ONGS`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENTE`
--

LOCK TABLES `CLIENTE` WRITE;
/*!40000 ALTER TABLE `CLIENTE` DISABLE KEYS */;
INSERT INTO `CLIENTE` VALUES (1,'thomazvmendes@gmail.com','11940129027','Soso','$2a$08$v2t1XARyh3.Sx9Br4CgQwuwfla/YZhzmJ3q670rmOlpLY4JaSgx16','29558613835','2004-07-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'paulo.froez@gmail.com','11975270585','Paulo','$2a$08$cOu0nS0jwE56jm7xwldhSO8czZbYwQCe4/3S376w.snAANxI544Ka','143.521.878-79','1997-06-27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'sophiafroez7@gmail.com','11950200186','sophia','$2a$08$cOu0nS0jwE56jm7xwldhSO8czZbYwQCe4/3S376w.snAANxI544Ka','143.521.878-79','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,'imgPerfil-1728166696608.jpg',NULL),(4,'camilly.froez@gmail.com','11951570088','camilly','$2a$08$cOu0nS0jwE56jm7xwldhSO8czZbYwQCe4/3S376w.snAANxI544Ka','143.521.878-79','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'gustava@gmail.com','11981423652','Gustavo','$2a$08$aX.E3GllaNOTD.dM82i8bOmQ220sEKX7LwflpeGk7JweotpeyTI5q','52140132807','2006-07-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'heitor@gmail.com','11975270088','Heitor','$2a$08$sF5/3EJGvQ4i6PvVcz9Ni.PIs9vnOiDFxGav3mYA4XgcKxteTraN6','51943996857','2007-07-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'totor8@gmail.com','11952200186','heitor','$2a$08$sFDzac2czaxQ..HRneDhiuOiI3p16F5p3/F162J8Mxb.gSqmdnRoW','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'sophiafroez8@gmail.com','11950202186','heitor','$2a$08$UmIhJ1nFQQl4sCCQRfstmO2jos8r/4uAedNYjKhP8jc8mDSYr6uFO','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'sophiafroez6@gmail.com','11950222186','gugu','$2a$08$PThN3hUwfRyUqYMDX0TtSOamikCF36Gx/0Txb0Zy1KN311OxeF5b.','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'camilly.froez7@gmail.com','11957200186','Paulo','$2a$08$nh4pwxIck5OsxhOpMz4YnOFnK.EUJfjUurujZZNyvD6oN5c7Wf4/O','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'gustavo@gmail.com','11996919109','Gustavo','$2a$08$f/XdUsgClx0Za.oElS4JFe6J5Q3C2W60Y/mrHw2iYpFlFcrggCNGi','631.873.950-58','2004-06-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'guggstavo@gmail.com','11996919108','Gustavo','$2a$08$BCXURDV7wATufc3WqohkA.n0TzFzW6pW1bsQ14MDtfg2uSr3o8j9S','631.873.950-58','2004-06-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'gustavo6@gmail.com','11996919105','Gustavo','$2a$08$R3WazCcswcE3cX0beI6pH.KFvFWXIZRsgKjXYxWWLHbKZXE.xlKLO','631.873.950-58','2004-06-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'gustavo56@gmail.com','11996919104','Gustavo','$2a$08$pScgcik4FeVxdz5XE1GPgOMbyKelDpLxXpJmFSOOzlmuwfryXzwj2','631.873.950-58','2004-06-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'gustavo46@gmail.com','11996919103','Gustavo','$2a$08$eRx/ZGVSTWWG2p.gZd282uhc0b1qPFtgMHvhrS6rbhytyit91fjxa','631.873.950-58','2004-06-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'submit.gustavo@yahoo.com','11996919135','lowss','$2a$08$Ndva1wGEZze/o25Uy6YaUuSAjvoTHIxSzMKqae701GaIBoIaSSumK','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'submit.gstavo@yahoo.com','11996913465','lowss','$2a$08$6Ru7/cCs5irA3f4FP2zGmOrV5IwmueACMySRzgawvLp.RuSR/9dD.','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'sugavo@yahoo.com','11996913265','lowss','$2a$08$m21sTuNNCBd7PicJd0K4W.FtJIwFNXF.WicjCIaOapon5CHrnb7aK','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'gvo@yahoo.comgg','11992913265','lowss','$2a$08$6jTs8Vdy/Gx3t8EDF.bESutMHWtSWy/J5VBODQw94DZAt/axY5L6C','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'gv3sdo@yahoo.comgg','11953539964','lowss','$2a$08$xF5y.wbUAtQ.h8Vw82r9a.Yv2MwFdyhi7lMTK0/otXTfBzlAkPceq','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'gv3sdo7@yahoo.comgg','11954539964','lowss','$2a$08$zDd4tF1GDwvzgkiUHWYZFO.lEboonOiqfNQtYtNCjvAz1Vuz8lIqS','802.739.250-08','2005-02-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'gaeggustavo@yahoo.com','11996913463','lowss','$2a$08$eQOB7WUxYwO43BTz4IU3d.XGa5HvPBSVG2IEM7LmWj0Xyn/PsVz6G','802.739.250-08','2005-11-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'guustavo@gmail.com','11999999999','gugu','$2a$08$.n0ajBF/QcMPmjSI0ZV0i.CjEO2UlubJ8Cox0viXKJkUIV5tqmXQq','578.789.580-09','2005-02-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'gustavogg@gmail.com','11934913265','gugutt','$2a$08$d5WM2HK6IY9OahuFArjt/exVJJyncUS1QFqgMbq5r2PcJFXb7I5sy','578.789.580-09','2005-02-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'ggaegh@gaeh.cawgwag','1133599114','gugudograu','$2a$08$/1vyk6Yjen3nwDWbBNfaQeD.3n7CvkeXcykH2P6sHDcISuTXL9ure','488.847.810-43','2005-03-27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'larissa@gmail.com','11975270580','larissa','$2a$08$5O8D3Aa1QsjPzcQAZsAkx.ulNFt.aoxpoTtTf/oywzFrUNOyDyNle','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'larissa1@gmail.com','11975270589','larissa','$2a$08$FRJCCsrbxF1S1.73cwUCGuONTg54bobLmjwrj/iNC5Hme2twW/8e2','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'larissa12@gmail.com','11975270581','larissa','$2a$08$K5qpi2KD4uqpBN2ol07sqeMDOd4CIp0G12Gk4Ny/9age/ZfanLoL6','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'larissa13@gmail.com','11975270582','larissa','$2a$08$Me.2NUEkvkR33G9nBx5bwOhp.Hk.emzQbZtsDXcRhSpXuSpt55t9S','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'larissa13@gmail.com','11975270582','larissa','$2a$08$Me.2NUEkvkR33G9nBx5bwOhp.Hk.emzQbZtsDXcRhSpXuSpt55t9S','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'larissa23@gmail.com','11975270533','larissa','$2a$08$Xq1wr8jXmOCL3sY3I5W95urQsmZjbFGBT0ZxkX37tR1B/yLZDobwu','143.521.878-79','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'sophiafroez07@gmail.com','11975270707','Sophia','$2a$08$eBKI3E.iomwkRQj/PqBj3e2tITW7k5vgY.6HO/BjhHsQNDpOjoCCq','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'sophiafroez070@gmail.com','1197527000','Sophia','$2a$08$XpxsNOqJ3BxENB.zRbBGT.HMXWs5KeK428vSBO1/S4yYAdGksniIe','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'ll@gmail.com','11950210186','Soso','$2a$08$S0GTme/kkaU/TvkLlM0FgeZhRhgIPNRW.epUek85NKX61Qj16vheG','519.439.968-57','1972-06-28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'ss@gmail.com','11950200184','ssss','$2a$08$N1q3cTbhpeov3bEgFbSEiuPFDhhD27T6MJlpq6f.Pa21ESH/zWzcm','51943996857','2000-02-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'pp@gmail.com','11950200183','llll','$2a$08$N1q3cTbhpeov3bEgFbSEiuPFDhhD27T6MJlpq6f.Pa21ESH/zWzcm','51943996857','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'Giovanni@gmail.com','11975270545','GIOVANNI','$2a$08$N1q3cTbhpeov3bEgFbSEiuPFDhhD27T6MJlpq6f.Pa21ESH/zWzcm','51943996857','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,'Eliana@gmail.com','11975270577','eliana','$2a$08$N1q3cTbhpeov3bEgFbSEiuPFDhhD27T6MJlpq6f.Pa21ESH/zWzcm','51943996857','2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,'camillyfroez07@gmail.com','11981423654','Camilly','$2a$08$n8LuN/0tzcJerZIznMR5ve07.qayzrkrFcyafZ6Hak2.5R9o5yYR6','52140132807','2006-12-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,'paulobarcellos@yahoo.com.br','(11) 99551-7111','Paulo','$2a$08$cJT1Ys2MYJVBXbtYeZKtk.I/07NmD6PD/mZynR/WRHm0ZLMOi4mUm','181.329.778-90','1974-08-28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,'apresentacao@gmail.com','11950200178','Sophia','$2a$08$FohXUkvgvWeEC90Rbv5jq.0Ls9PgT3e4ByImOu.3n/8cz6VDTLrOa','52140132807','2000-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,'gustavo5@gmail.com','11996919107','Gustavo','$2a$08$YSvy1iKtjMAUYr8yXzKqb.FmSW591wk2y1Sxo0JwpNHaBJkJUVi76','631.873.950-58','2006-07-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'camillykaroline0112@gmail.com','11987074265','gusmao','$2a$08$esu0g/imkkE5sEdYMl6H9ec8lU5xiYwSg7Vq..6/3XO7/OTw5O7ju','52140132807','2000-12-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'iagosantos@gmail.com','11980602306','IagoRodrigues','$2a$08$1dKnFVl61.W.9GQweHLuo.7F7BowUJg2QzwEva8FU2LpsKCyIeWkS','46916360801','2000-02-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'testelogin@gmail.com','11980605936','iagosantos','$2a$08$98/32RQEfYrsypsv35xoEOsr1uO7dJImEU6pULWLS7DVmbxlbcyY.','08835552044','2000-08-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,'junior@gmail.com','11984734783','jjefinho','$2a$08$8l5A1VaH7GicszCHmGY97.3jiWat/dk2FU/mehZhjeOvY1ofrtr0u','58351243841','2000-12-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'jefinho@gmail.com','11984958607','jefinho','$2a$08$KW7nvNq9zdyFyDXa5I44Au06Y.kmjQDtylFYG6QqVbXtKS7KS9OZC','29389316898','2000-12-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,'sophiafroez@gmail.com','11970270527','Sophia','$2a$08$Ym.gA1dJOyq.ZZUFwUgZJ.g8Y/Ipc9CwTSCwN/pBuU9zF1ZdH5IZG','51943996857','2007-03-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'testeteste@gmail.com','11980602302','TesteTeste','$2a$08$yMjiU93Wwc86Ibt5LTp48ubSff7Ackt40VILxg.M.PlPQ/4SLyzH6','61482096080','2000-08-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'thomaz@gmail.com','(85) 2638-4876','thomaz','$2a$08$rCKfPQKsEqHgA9o2NXf.qOpDgfqIDzpISagKBqG2wX.KHWmbxAiUa','53931863042','2003-06-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'testeloginhoje@hotmail.com','11980605959','testeLogin','$2a$08$wfp8lfZpSZC/ekyvz2HqVeWAzBVV0T0X7saZxc9MmwYYcEEx5xoW.','27149456006','2000-08-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'camillykaroline012@gmail.com','11981423657','Camilly','$2a$08$P/UKv7.vz1Po.WiBKhqC.O/Ite8VSmraaSRIw5sJMJfh/qoPwlcVC','52140132807','2006-12-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'submit.gustavo@gmail.com','11987074264','gustavo','$2a$08$dku/uQJsjLjrT6A7LLLwhOwjaz1zs.JgGnYnIfc5zUa8bMDEvoTHa','52140132807','2006-07-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'juniorj74eazy@gmail.com','(11) 98473-4783','jefinho','$2a$08$beEy4vaHLxWRoxoDOk6R.e9L2npQzY3sK/SOomNv6a3LXRF.P5hiG','447.190.010-25','2006-12-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'leitec178@gmail.com','(11) 98473-4784','jefinho','$2a$08$CWtghos4tOB/tg23riWYp.i5eczCTCY8/9YVTPoMPahFjCWoucrcy','770.484.250-16','2006-12-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'cadastrohoje@gmail.com','11980990208','CadastroHoje','$2a$08$0IN5HXqUU1R9kEAaW7l2pOx04ke/1T4m/HBJnEzZFfgxWvQ4vmJS.','75425060050','2000-09-30',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'kaiq123@gmail.com','1198473479','kaiq','$2a$08$H1KnC.xMBTCqt2QSK18d9eaMp.wkcHw4bvKwRdBQOZZjnE1yviajS','16891172063','2006-12-17',NULL,NULL,NULL,NULL,NULL,NULL,'imgUser.png',NULL),(58,'admin@gmail.com','(27) 2830-2231','teste','$2a$08$slIOWcrE7Za18ebeiBNTlOsNwijSynsyU7bJ59YkTpVrY7K5ozQFO','44406684026','2006-10-18',NULL,NULL,NULL,NULL,NULL,NULL,'imgUser.png',NULL);
/*!40000 ALTER TABLE `CLIENTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ESPECIALIDADES`
--

DROP TABLE IF EXISTS `ESPECIALIDADES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESPECIALIDADES` (
  `ID_ESPECIALIDADES` int(11) NOT NULL AUTO_INCREMENT,
  `ESPECIALIDADES` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_ESPECIALIDADES`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESPECIALIDADES`
--

LOCK TABLES `ESPECIALIDADES` WRITE;
/*!40000 ALTER TABLE `ESPECIALIDADES` DISABLE KEYS */;
INSERT INTO `ESPECIALIDADES` VALUES (1,'veterinário'),(2,'petshop'),(3,'adestramento'),(4,'passeio'),(5,'creche');
/*!40000 ALTER TABLE `ESPECIALIDADES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HORARIOS_SERVICO`
--

DROP TABLE IF EXISTS `HORARIOS_SERVICO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HORARIOS_SERVICO` (
  `ID_PEDIDO_SERVICO` int(11) NOT NULL AUTO_INCREMENT,
  `DATA_HORARIO` date NOT NULL,
  `DESCRICAO_HORARIO` varchar(400) NOT NULL,
  `ID_SERVICO` int(11) NOT NULL,
  `HORARIO_SERVICO` time NOT NULL,
  PRIMARY KEY (`ID_PEDIDO_SERVICO`),
  KEY `ID_SERVICO_idx` (`ID_SERVICO`),
  CONSTRAINT `ID_SERVICO` FOREIGN KEY (`ID_SERVICO`) REFERENCES `SERVICO` (`ID_SERVICO`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HORARIOS_SERVICO`
--

LOCK TABLES `HORARIOS_SERVICO` WRITE;
/*!40000 ALTER TABLE `HORARIOS_SERVICO` DISABLE KEYS */;
INSERT INTO `HORARIOS_SERVICO` VALUES (3,'2024-10-12','Horario teste',1,'21:11:00'),(4,'2024-10-12','Horario teste',1,'20:12:00');
/*!40000 ALTER TABLE `HORARIOS_SERVICO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ITEM_PEDIDO_SERVICO`
--

DROP TABLE IF EXISTS `ITEM_PEDIDO_SERVICO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ITEM_PEDIDO_SERVICO` (
  `ID_ITEM_SERVICO` int(11) NOT NULL AUTO_INCREMENT,
  `FK_ID_SERVICO` int(11) DEFAULT NULL,
  `DESCRICAO_ITEM_SERVICO_SERVICO` varchar(400) NOT NULL,
  PRIMARY KEY (`ID_ITEM_SERVICO`),
  KEY `FK_ID_SERVICO` (`FK_ID_SERVICO`),
  CONSTRAINT `ITEM_PEDIDO_SERVICO_ibfk_1` FOREIGN KEY (`FK_ID_SERVICO`) REFERENCES `SERVICO` (`ID_SERVICO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ITEM_PEDIDO_SERVICO`
--

LOCK TABLES `ITEM_PEDIDO_SERVICO` WRITE;
/*!40000 ALTER TABLE `ITEM_PEDIDO_SERVICO` DISABLE KEYS */;
/*!40000 ALTER TABLE `ITEM_PEDIDO_SERVICO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MENSAGEM`
--

DROP TABLE IF EXISTS `MENSAGEM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MENSAGEM` (
  `ID_MENSAGEM` int(11) NOT NULL AUTO_INCREMENT,
  `CONTEUDO_MENSAGEM` varchar(600) DEFAULT NULL,
  `FK_ID_ONGS` int(11) DEFAULT NULL,
  `FK_ID_CLIENTE` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_MENSAGEM`),
  KEY `FK_ID_ONGS` (`FK_ID_ONGS`),
  KEY `FK_ID_CLIENTE` (`FK_ID_CLIENTE`),
  CONSTRAINT `MENSAGEM_ibfk_1` FOREIGN KEY (`FK_ID_ONGS`) REFERENCES `ONGS` (`ID_ONGS`),
  CONSTRAINT `MENSAGEM_ibfk_2` FOREIGN KEY (`FK_ID_CLIENTE`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MENSAGEM`
--

LOCK TABLES `MENSAGEM` WRITE;
/*!40000 ALTER TABLE `MENSAGEM` DISABLE KEYS */;
INSERT INTO `MENSAGEM` VALUES (4,'gagag',NULL,NULL),(15,'rs',NULL,32),(16,'gg',NULL,41),(17,'gg',NULL,41),(18,'lll',NULL,42),(19,'salve quebrada',NULL,55);
/*!40000 ALTER TABLE `MENSAGEM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ONGS`
--

DROP TABLE IF EXISTS `ONGS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ONGS` (
  `ID_ONGS` int(11) NOT NULL AUTO_INCREMENT,
  `CNPJ_ONGS` char(14) NOT NULL,
  `RAZAO_SOCIAL_ONGS` varchar(150) NOT NULL,
  `CIDADE_ONGS` varchar(20) NOT NULL,
  `UF_ONGS` char(2) NOT NULL,
  `CEP_ONGS` char(2) NOT NULL,
  `LOGRADOURO_ONGS` varchar(100) NOT NULL,
  `BAIRRO_ONGS` varchar(50) NOT NULL,
  `CELULAR_ONGS` char(11) NOT NULL,
  PRIMARY KEY (`ID_ONGS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ONGS`
--

LOCK TABLES `ONGS` WRITE;
/*!40000 ALTER TABLE `ONGS` DISABLE KEYS */;
/*!40000 ALTER TABLE `ONGS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PETS_CLIENTE`
--

DROP TABLE IF EXISTS `PETS_CLIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PETS_CLIENTE` (
  `ID_PETS_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `RACA_PETS_CLIENTE` varchar(20) NOT NULL,
  `COR_PETS_CLIENTE` varchar(25) NOT NULL,
  `DATA_NASC_PETS_CLIENTE` date DEFAULT NULL,
  `NOME_PETS_CLIENTE` varchar(70) NOT NULL,
  `PORTE_FISICO_PETS_CLIENTE` varchar(15) NOT NULL,
  `SEXO_PETS_CLIENTE` varchar(15) NOT NULL,
  `FK_ID_CLIENTE` int(11) NOT NULL,
  PRIMARY KEY (`ID_PETS_CLIENTE`),
  KEY `FK_ID_CLIENTE` (`FK_ID_CLIENTE`),
  CONSTRAINT `PETS_CLIENTE_ibfk_1` FOREIGN KEY (`FK_ID_CLIENTE`) REFERENCES `CLIENTE` (`ID_CLIENTE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PETS_CLIENTE`
--

LOCK TABLES `PETS_CLIENTE` WRITE;
/*!40000 ALTER TABLE `PETS_CLIENTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `PETS_CLIENTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SERVICO`
--

DROP TABLE IF EXISTS `SERVICO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SERVICO` (
  `ID_SERVICO` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_SERVICO` varchar(45) NOT NULL,
  `DESCRICAO_SERVICO` varchar(400) NOT NULL,
  `CATEGORIA_SERVICO` int(11) NOT NULL,
  `ID_USUARIO` int(11) NOT NULL,
  PRIMARY KEY (`ID_SERVICO`),
  KEY `ID_USUARIO_idx` (`ID_USUARIO`),
  CONSTRAINT `ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `USUARIOS` (`ID_USUARIOS`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SERVICO`
--

LOCK TABLES `SERVICO` WRITE;
/*!40000 ALTER TABLE `SERVICO` DISABLE KEYS */;
INSERT INTO `SERVICO` VALUES (1,'SERVICO-TESTE','UM TESTE DE UM SERVICO',4,20);
/*!40000 ALTER TABLE `SERVICO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIOS`
--

DROP TABLE IF EXISTS `USUARIOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIOS` (
  `ID_USUARIOS` int(11) NOT NULL AUTO_INCREMENT,
  `NOME_USUARIOS` varchar(80) NOT NULL,
  `SENHA_USUARIOS` varchar(60) NOT NULL,
  `CELULAR_USUARIOS` varchar(11) NOT NULL,
  `EMAIL_USUARIOS` varchar(50) NOT NULL,
  `CIDADE_USUARIOS` varchar(45) NOT NULL,
  `UF_USUARIOS` char(2) NOT NULL,
  `CEP_USUARIOS` char(8) NOT NULL,
  `LOGRADOURO_USUARIOS` varchar(100) NOT NULL,
  `BAIRRO_USUARIOS` varchar(45) NOT NULL,
  `CNPJ_USUARIO` char(14) NOT NULL,
  `CPF_USUARIO` char(11) NOT NULL,
  `NOMEEMPRESA_USUARIO` varchar(45) NOT NULL,
  `RAZAOSOCIAL_USUARIO` varchar(45) NOT NULL,
  `ESPECIALIDADES_ID_ESPECIALIDADES` int(11) NOT NULL,
  PRIMARY KEY (`ID_USUARIOS`),
  KEY `fk_USUARIOS_ESPECIALIDADES1_idx` (`ESPECIALIDADES_ID_ESPECIALIDADES`),
  CONSTRAINT `fk_USUARIOS_ESPECIALIDADES1` FOREIGN KEY (`ESPECIALIDADES_ID_ESPECIALIDADES`) REFERENCES `ESPECIALIDADES` (`ID_ESPECIALIDADES`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS`
--

LOCK TABLES `USUARIOS` WRITE;
/*!40000 ALTER TABLE `USUARIOS` DISABLE KEYS */;
INSERT INTO `USUARIOS` VALUES (12,'a','$2a$08$IwvwCicrtZeOA.uuCLl5A.s8i/Ps1i1eoj0A8rKNaeYSVnGRaZtke','a','a@a','a','RJ','a','a','aa','','','','',0),(13,'a','$2a$08$OJ2tb/QYb23Q5ACojXsJsee1Ssdm3BcN4Wrj2M//BY/w6uHEJuwsq','a','a@a','a','RJ','a','a','aa','','','','',0),(14,'Thomaz','$2a$08$EBVW8o1EUW8u6rPi7K4B.ePyd811MMI87ZtUwm7WwSE3EndwYJWfi','11940129012','thomaz@gmail.com','Barueri','SP','12345678','Rua do Thomaz','Vila Engenho Novo','','','','',0),(15,'Thomaz','$2a$08$EBVW8o1EUW8u6rPi7K4B.ePyd811MMI87ZtUwm7WwSE3EndwYJWfi','11940129012','thomaz@gmail.com','Barueri','SP','12345678','Rua do Thomaz','Vila Engenho Novo','','','','',0),(16,'Thomaz','$2a$08$EBVW8o1EUW8u6rPi7K4B.ePyd811MMI87ZtUwm7WwSE3EndwYJWfi','11940129012','thomaz@gmail.com','Barueri','SP','12345678','Rua do Thomaz','Vila Engenho Novo','','','','',0),(17,'Thomaz','$2a$08$joOsvTnoHFsygPMxK9wqpuazHUFUVWDp3ljp98uuYVNymSG.Khj7q','11940129012','thomaz@gmail.com','Barueri','SP','12345678','Rua do Thomaz','Vila Engenho Novo','','','','',0),(18,'Thomaz','$2a$08$2dZ00BdLJ8qSOmp12prE3.dBTu8nwGz4YKFduODGpyMq784zJZ52u','11940129012','thomaz@gmail.com','1DDWDWQ','RJ','12345678','1FEFE','1FEWFFE','','','','',0),(19,'Thomaz','$2a$08$FWSBsouxXPedApzcXIdBoOWpU1Pu61Bn97u9Dj9yXBtfQ2ZjPlnH2','11940129013','thomaz@gmail.com','1DDWDWQ','RJ','12345678','1FEFE','1FEWFFE','','','','',0),(20,'Thomaz','$2a$08$bpaFOStdaD.5gfjgiJPvqeN3VK5jWrE4.KeThO4z4C/eQEFLx8aFC','11950202186','sophiafroez7@gmail.com','Barueri','SP','15225970','rua via brasil','Jardim Hokkaido','16589463000170','47488089855','Boxpets','Educação Animal',1),(21,'Thomaz','$2a$08$LxuA0s7jjSWLdGQ6n/R1xeAsH9L.UMhIWNDyt5OfmBuy9uWxUm.Qm','11950202180','sophia@gmail.com','Barueri','SP','15225970','rua via brasil','Jardim Hokkaido','16589463000170','47488089855','Boxpets','Educação Animal',1),(22,'Sophia','$2a$08$urlxsEjAtvrfzQq/8BDWSOKWMqA.Pn3is1Q.SYfmFCFYHXUNkEb7q','11975270585','sophiafroez700@gmail.com','Barueri','SP','06416030','rua villa nova','Engenho Novo','41366927000127','47488089855','SosoLinda','adestramento ',1),(23,'Thomaz','$2a$08$rM6edE8t0rihpwkBwF1BV..ngD3zh/ObARuBtXgcIJ43aVfzLeXL.','11940129027','Thomazchato@gmail.com','Barueri','SP','06416030','rua villa nova','Engenho Novo','41366927000127','47488089855','Quasart','videos',1),(24,'boxpets','$2a$08$CqkDg8ZPk9E86pli76BqSuNFta2ciSuoQLZKMKPnOJ/OwFVXxMNOy','11984734780','jefinho178@gmail.com','Jandira','sp','06622330','Rua embu','Parque Santa Tereza ','41015198000164','10562468048','boxpet','boxpets',1);
/*!40000 ALTER TABLE `USUARIOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIOS_PF`
--

DROP TABLE IF EXISTS `USUARIOS_PF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIOS_PF` (
  `CPF_USUARIOS_PF` char(11) NOT NULL,
  `NOME_USUARIOS_PF` varchar(70) DEFAULT NULL,
  `DATA_NASC_USUARIOS_PF` date DEFAULT NULL,
  `FK_ID_USUARIOS_PF` int(11) DEFAULT NULL,
  KEY `FK_ID_USUARIOS_PF` (`FK_ID_USUARIOS_PF`),
  CONSTRAINT `USUARIOS_PF_ibfk_1` FOREIGN KEY (`FK_ID_USUARIOS_PF`) REFERENCES `USUARIOS` (`ID_USUARIOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS_PF`
--

LOCK TABLES `USUARIOS_PF` WRITE;
/*!40000 ALTER TABLE `USUARIOS_PF` DISABLE KEYS */;
/*!40000 ALTER TABLE `USUARIOS_PF` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIOS_PJ`
--

DROP TABLE IF EXISTS `USUARIOS_PJ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIOS_PJ` (
  `RAZAO_SOCIAL_USUARIOS_PJ` varchar(150) NOT NULL,
  `CNPJ_USUARIOS_PJ` varchar(14) NOT NULL,
  `FK_ID_USUARIOS_PJ` int(11) DEFAULT NULL,
  KEY `FK_ID_USUARIOS_PJ` (`FK_ID_USUARIOS_PJ`),
  CONSTRAINT `USUARIOS_PJ_ibfk_1` FOREIGN KEY (`FK_ID_USUARIOS_PJ`) REFERENCES `USUARIOS` (`ID_USUARIOS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS_PJ`
--

LOCK TABLES `USUARIOS_PJ` WRITE;
/*!40000 ALTER TABLE `USUARIOS_PJ` DISABLE KEYS */;
/*!40000 ALTER TABLE `USUARIOS_PJ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enterprise`
--

DROP TABLE IF EXISTS `enterprise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enterprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enterprise`
--

LOCK TABLES `enterprise` WRITE;
/*!40000 ALTER TABLE `enterprise` DISABLE KEYS */;
/*!40000 ALTER TABLE `enterprise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `share`
--

DROP TABLE IF EXISTS `share`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner` longblob,
  `title` varchar(64) NOT NULL,
  `description` text,
  `services` longtext,
  `moreImage` longblob,
  `moreText` text,
  `peoples` longtext,
  `onwer` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `onwer` (`onwer`),
  CONSTRAINT `share_ibfk_1` FOREIGN KEY (`onwer`) REFERENCES `enterprise` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `share`
--

LOCK TABLES `share` WRITE;
/*!40000 ALTER TABLE `share` DISABLE KEYS */;
/*!40000 ALTER TABLE `share` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarioTeste`
--

DROP TABLE IF EXISTS `usuarioTeste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarioTeste` (
  `nome` varchar(24) DEFAULT NULL,
  `idade` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarioTeste`
--

LOCK TABLES `usuarioTeste` WRITE;
/*!40000 ALTER TABLE `usuarioTeste` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarioTeste` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16 10:20:20
