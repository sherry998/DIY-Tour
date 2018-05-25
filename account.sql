-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 25, 2018 at 02:11 AM
-- Server version: 5.7.17
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diy_tour`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `userId` int(8) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `country` char(40) DEFAULT NULL,
  `hash` varchar(32) NOT NULL,
  `activated` varchar(5) NOT NULL DEFAULT 'false',
  `profileImage` varchar(50) NOT NULL DEFAULT 'profile_Image/default.png',
  `travelTitle` varchar(50) NOT NULL DEFAULT 'Virtual traveler',
  `about` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`userId`, `email`, `username`, `password`, `country`, `hash`, `activated`, `profileImage`, `travelTitle`, `about`) VALUES
(1, 'Juvia333@hotmail.com', 'Tina', '$2y$10$12f0jQkw8mp8yE/EuUnvAOhKSD5wdjQ2qpln5u3UHutJ2bzchQ7ci', 'Brisbane City QLD, Australia', '918317b57931b6b7a7d29490fe5ec9f9', 'true', 'profile_Image/profileImage1.jpg', 'Virtual traveler', 'I love travelling about the world!!!'),
(2, 'another080954@gmail.com', 'sherry', '$2y$10$0wLm1LP9IgTMCZtDFrgvNesUlAOAbnKdAc439r.t5yFTA/3Wekfcy', NULL, '6395ebd0f4b478145ecfbaf939454fa4', 'true', 'profile_Image/default.png', 'Virtual traveler', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `userId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
