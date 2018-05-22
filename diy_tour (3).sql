-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2018 at 03:19 PM
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
  `password` varchar(60) NOT NULL,
  `country` char(40) DEFAULT NULL,
  `hash` varchar(32) NOT NULL,
  `activated` varchar(5) NOT NULL DEFAULT 'false',
  `profileImage` varchar(50) NOT NULL DEFAULT 'profile_Image/default.png',
  `travelTitle` varchar(50) NOT NULL DEFAULT 'Virtual traveler',
  `about` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`userId`, `email`, `username`, `password`, `country`, `hash`, `activated`, `profileImage`, `travelTitle`, `about`) VALUES
(18, 'tinayao333@gmail.com', 'Tina', '$2y$10$lhZkc293BWdQkOn4CTYpKe8IKGBe.YN0RLZK59./PFyStObZX9tz6', 'Brisbane, Australia', '30bb3825e8f631cc6075c0f87bb4978c', 'true', 'profile_Image/profileImage18.png', 'Cultural explorer', ' I love travel around the world!'),
(26, 't@gmail.com', 'admin', '$2y$10$txW3XQaWwNu6DOl/nmwcluZ.AbneldvOloLQoU6f8vi1OQBi06o/q', NULL, 'c9892a989183de32e976c6f04e700201', 'true', 'profile_Image/default.png', 'Virtual traveler', NULL);

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
(13, 12, 1, 'sdf', 'sdfsdsd'),
(14, 13, 1, 'sfd', 'sfssdfsd'),
(15, 14, 1, 'dsf', 'dsf'),
(32, 12, 2, 'ad', 'dsf'),
(46, 1, 2, 'Mount Coot-tha Lookout', 'The journey up to the Mount Coot-tha Lookout is pleasant enough, but the sweeping views of the sprawling cityscape (and beyond on a clear day) will take your breath away.'),
(47, 15, 1, '231', 'dsfsd'),
(48, 15, 2, 'sdf', 'sdf'),
(49, 16, 1, 'dfg', 'dfg'),
(50, 17, 1, 'sdf', 'dsf'),
(51, 18, 1, 'sdf', 'dsf'),
(52, 19, 1, 'asd', 'asd'),
(53, 20, 1, 'sdf', 'sdf'),
(62, 28, 1, 'asd', 'asd'),
(64, 14, 2, 'dsf', 'sdf'),
(65, 30, 1, 'sdf', 'dsf');

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
(2, 'guide_Image/DayID1_1.jpg', 1),
(4, 'guide_Image/DayID15_0.jpg', 15),
(10, 'guide_Image/DayID1_2.jpg', 1),
(18, 'guide_Image/DayID47_0.png', 47),
(27, 'guide_Image/DayID15_2.jpg', 15);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewId` int(8) NOT NULL,
  `userId` int(8) NOT NULL,
  `rating` int(5) NOT NULL,
  `paragraph` text NOT NULL,
  `date` date NOT NULL,
  `guideID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`reviewId`, `userId`, `rating`, `paragraph`, `date`, `guideID`) VALUES
(23, 18, 5, 'wonderful', '2018-05-20', 15),
(24, 18, 5, 'dsfsd', '2018-05-21', 19),
(25, 18, 5, 'vcx', '2018-05-21', 19),
(29, 18, 5, 'sf', '2018-05-21', 15);

-- --------------------------------------------------------

--
-- Table structure for table `travelguide`
--

CREATE TABLE `travelguide` (
  `guideId` int(8) NOT NULL,
  `userId` int(8) NOT NULL,
  `guideName` varchar(50) NOT NULL,
  `country` varchar(500) NOT NULL,
  `date` date NOT NULL,
  `people` varchar(50) NOT NULL,
  `budget` int(11) NOT NULL DEFAULT '0',
  `overview` text,
  `rating` int(20) NOT NULL DEFAULT '0',
  `featureImage` varchar(50) NOT NULL DEFAULT 'guide_Image/NoPicAvailable.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `travelguide`
--

INSERT INTO `travelguide` (`guideId`, `userId`, `guideName`, `country`, `date`, `people`, `budget`, `overview`, `rating`, `featureImage`) VALUES
(1, 18, '2 Days in Brisbane', 'Brisbane, Australia', '2018-05-02', 'families', 5000, 'With beautiful parks, fantastic food, and the stunning river that meanders through it, thereâ€™s more to Brisbane than work, play, and trips to the coast. Hereâ€™s your guide to spending three days in one of Australiaâ€™s most underrated cities.', 0, 'guide_Image/GuideID1.jpg'),
(12, 18, 'dsf', 'sdf', '2018-05-09', 'individual', 100, 'sdf', 0, 'guide_Image/NoPicAvailable.png'),
(13, 18, 'df', 'sdf', '2018-05-08', 'individual', 0, 'sdf', 0, 'guide_Image/NoPicAvailable.png'),
(14, 18, 'fdf', 'sdf', '2018-05-10', 'individual', 0, 'ds', 0, 'guide_Image/GuideID14.png'),
(15, 18, 'what', 'New York, NY, USA', '2018-05-12', 'individual', 500, 'dsfdsf', 5, 'guide_Image/GuideID15.png'),
(16, 18, 'idfg', 'Germany', '2018-05-10', 'individual', 0, 'dfg', 0, 'guide_Image/NoPicAvailable.png'),
(17, 18, 'fsg', 'Taiwan', '2018-05-07', 'individual', 0, 'dsf', 0, 'guide_Image/NoPicAvailable.png'),
(18, 18, 'fdg', 'Dfg Recording Studio, Oakwood Avenue, City of Orange, NJ, USA', '2018-05-02', 'individual', 0, 'dxgxdfg', 0, 'guide_Image/NoPicAvailable.png'),
(19, 18, 'df', 'D. S. Senanayake Mawatha, Colombo, Sri Lanka', '2018-05-02', 'individual', 0, 'sad', 5, 'guide_Image/NoPicAvailable.png'),
(20, 18, 'dgf', 'C V Raman Nagar, Bengaluru, Karnataka, India', '2018-05-01', 'individual', 900, 'sder', 0, 'guide_Image/GuideID20.png'),
(28, 18, 'asd', 'asd', '2018-05-01', 'individual', 0, 'asddfsdf', 0, 'guide_Image/GuideID28.png'),
(30, 26, 'sg', 'SDJ/201, Ambazari Road, Corporation Colony, Ambazari, Nagpur, Maharashtra, India', '2018-05-01', 'individual', 0, 'sdfs', 0, 'guide_Image/NoPicAvailable.png');

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
  ADD KEY `Review_ibfk_1` (`userId`),
  ADD KEY `guideID` (`guideID`) USING BTREE;

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
  MODIFY `userId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `day`
--
ALTER TABLE `day`
  MODIFY `dayId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `imageId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `reviewId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `travelguide`
--
ALTER TABLE `travelguide`
  MODIFY `guideId` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
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
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`dayId`) REFERENCES `day` (`dayId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `account` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`guideID`) REFERENCES `travelguide` (`guideId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `travelguide`
--
ALTER TABLE `travelguide`
  ADD CONSTRAINT `travelguide_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `account` (`userId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
