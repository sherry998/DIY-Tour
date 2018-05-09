-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2018 at 02:23 PM
-- Server version: 5.7.11
-- PHP Version: 5.6.19

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
  `password` varchar(32) NOT NULL,
  `country` char(40) DEFAULT NULL,
  `hash` varchar(32) NOT NULL,
  `activated` varchar(5) NOT NULL DEFAULT 'false',
  `profileImage` varchar(50) NOT NULL DEFAULT 'profile_Image/default.png',
  `travelTitle` varchar(50) NOT NULL DEFAULT 'Virtual traveler',
  `about` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`userId`, `email`, `username`, `password`, `country`, `hash`, `activated`, `profileImage`, `travelTitle`, `about`) VALUES
(18, 'tinayao333@gmail.com', 'Tina', '4c3d4812131d941b6042c5e59037d685', 'Brisbane, Australia', '30bb3825e8f631cc6075c0f87bb4978c', 'true', 'profile_Image/profileImage18.png', 'Cultural explorer', ' I love travel around the world!'),
(19, 'g@hotmail.com', 'admin', '4c3d4812131d941b6042c5e59037d685', NULL, '8b5040a8a5baf3e0e67386c2e3a9b903', 'false', 'profile_Image/default.png', 'Virtual traveler', ''),
(20, 'juvia@hotmail.com', 'admin', '4c3d4812131d941b6042c5e59037d685', NULL, 'fc8001f834f6a5f0561080d134d53d29', 'false', 'profile_Image/default.png', 'Virtual traveler', ''),
(22, 'Juvia333@hotmail.com', 'admin', '4c3d4812131d941b6042c5e59037d685', NULL, 'fa7cdfad1a5aaf8370ebeda47a1ff1c3', 'true', 'profile_Image/default.png', 'Gentle explorer', '');

-- --------------------------------------------------------

--
-- Table structure for table `day`
--

CREATE TABLE `day` (
  `dayId` int(8) NOT NULL,
  `guideId` int(8) NOT NULL,
  `dayNum` int(11) NOT NULL,
  `Title` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `day`
--

INSERT INTO `day` (`dayId`, `guideId`, `dayNum`, `Title`, `description`) VALUES
(1, 1, 1, 'City Trip', 'Take the CityCat all the way to the South Bank, where youâ€™ll find beautiful gardens, numerous food and drink options, oodles of culture, and even a beach. Culture vultures should head straight to the Cultural Center, which includes the Queensland Art Gallery and the Gallery of Modern Art. Thereâ€™s also the Queensland Museum in this area, plus the Queensland Performing Arts Center. If all that sounds like too much, set yourself down and relax on the man-made beach instead.'),
(2, 1, 2, 'Mount Coot-tha Lookout', 'The journey up to the Mount Coot-tha Lookout is pleasant enough, but the sweeping views of the sprawling cityscape (and beyond on a clear day) will take your breath away.'),
(13, 12, 1, 'sdf', 'sdf'),
(14, 13, 1, 'sfd', 'sfs');

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `imageId` int(8) NOT NULL,
  `imageLink` varchar(50) NOT NULL,
  `dayId` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`imageId`, `imageLink`, `dayId`) VALUES
(1, 'guide_Image/DayID1_0.jpg', 1),
(2, 'guide_Image/DayID1_1.jpg', 1),
(3, 'guide_Image/DayID2_0.jpg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewId` int(8) NOT NULL,
  `userId` int(8) NOT NULL,
  `rating` int(5) NOT NULL,
  `paragraph` text NOT NULL,
  `guideID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `travelguide`
--

CREATE TABLE `travelguide` (
  `guideId` int(8) NOT NULL,
  `userId` int(8) NOT NULL,
  `guideName` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `people` varchar(50) NOT NULL,
  `budget` int(11) NOT NULL DEFAULT '0',
  `overview` text,
  `rating` int(5) NOT NULL DEFAULT '0',
  `featureImage` varchar(50) NOT NULL DEFAULT 'guide_Image/NoPicAvailable.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `travelguide`
--

INSERT INTO `travelguide` (`guideId`, `userId`, `guideName`, `country`, `date`, `people`, `budget`, `overview`, `rating`, `featureImage`) VALUES
(1, 18, '2 Days in Brisbane', 'Brisbane, Australia', '2018-05-02', 'families', 5000, 'With beautiful parks, fantastic food, and the stunning river that meanders through it, thereâ€™s more to Brisbane than work, play, and trips to the coast. Hereâ€™s your guide to spending three days in one of Australiaâ€™s most underrated cities.', 0, 'guide_Image/NoPicAvailable.png'),
(12, 18, 'dsf', 'sdf', '2018-05-09', 'individual', 100, 'sdf', 0, 'guide_Image/GuideID12.png'),
(13, 18, 'df', 'sdf', '2018-05-08', 'individual', 0, 'sdf', 0, 'guide_Image/GuideID13.png');

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
-- Indexes for table `day`
--
ALTER TABLE `day`
  ADD PRIMARY KEY (`dayId`),
  ADD KEY `guide` (`guideId`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`imageId`),
  ADD KEY `dayId` (`dayId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewId`),
  ADD UNIQUE KEY `guideID` (`guideID`),
  ADD KEY `Review_ibfk_1` (`userId`);

--
-- Indexes for table `travelguide`
--
ALTER TABLE `travelguide`
  ADD PRIMARY KEY (`guideId`),
  ADD KEY `username` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `userId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `day`
--
ALTER TABLE `day`
  MODIFY `dayId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `imageId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `reviewId` int(8) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `travelguide`
--
ALTER TABLE `travelguide`
  MODIFY `guideId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `day`
--
ALTER TABLE `day`
  ADD CONSTRAINT `day_ibfk_1` FOREIGN KEY (`guideId`) REFERENCES `travelguide` (`guideId`);

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`dayId`) REFERENCES `day` (`dayId`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `account` (`userId`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`guideID`) REFERENCES `travelguide` (`guideId`);

--
-- Constraints for table `travelguide`
--
ALTER TABLE `travelguide`
  ADD CONSTRAINT `travelguide_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `account` (`userId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
