-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jul 04, 2016 at 03:35 AM
-- Server version: 5.5.42
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `communication_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversation_tb`
--
--
-- Dumping data for table `setting_tb`
--

INSERT INTO `setting_tb` (`setting_id`, `setting_choose`, `setting_dis`) VALUES
(1, 'Random', 1);

-- --------------------------------------------------------

--
-- Table structure for table `trigger_tb`
--

CREATE TABLE `trigger_tb` (
  `trigger_id` int(11) NOT NULL,
  `trigger_name` text NOT NULL,
  `trigger_dis` tinyint(4) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `trigger_tb`
--

INSERT INTO `trigger_tb` (`trigger_id`, `trigger_name`, `trigger_dis`) VALUES
(1, 'Detect human', 1),
(2, 'Touch hand', 1),
(3, 'Touch head', 1),
(4, 'Talk', 1);

-- --------------------------------------------------------

--
-- Table structure for table `userReply_tb`
--

CREATE TABLE `userReply_tb` (
  `userReply_id` int(11) NOT NULL,
  `userReply_group` int(11) NOT NULL,
  `userReply_answer` text NOT NULL,
  `userReply_dis` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversation_tb`
--
ALTER TABLE `conversation_tb`
  ADD PRIMARY KEY (`conversation_id`),
  ADD KEY `conversation_trigger` (`conversation_trigger`);

--
-- Indexes for table `group_tb`
--
ALTER TABLE `group_tb`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `group_pepperTalkParent` (`group_pepperTalkParent`);

--
-- Indexes for table `pepperTalk_tb`
--
ALTER TABLE `pepperTalk_tb`
  ADD PRIMARY KEY (`pepperTalk_id`),
  ADD KEY `pepperTalk_group` (`pepperTalk_group`),
  ADD KEY `pepperTalk_conversation` (`pepperTalk_conversation`);

--
-- Indexes for table `setting_tb`
--
ALTER TABLE `setting_tb`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `trigger_tb`
--
ALTER TABLE `trigger_tb`
  ADD PRIMARY KEY (`trigger_id`);

--
-- Indexes for table `userReply_tb`
--
ALTER TABLE `userReply_tb`
  ADD PRIMARY KEY (`userReply_id`),
  ADD KEY `userReply_group` (`userReply_group`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversation_tb`
--
ALTER TABLE `conversation_tb`
  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `group_tb`
--
ALTER TABLE `group_tb`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pepperTalk_tb`
--
ALTER TABLE `pepperTalk_tb`
  MODIFY `pepperTalk_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `setting_tb`
--
ALTER TABLE `setting_tb`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `trigger_tb`
--
ALTER TABLE `trigger_tb`
  MODIFY `trigger_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `userReply_tb`
--
ALTER TABLE `userReply_tb`
  MODIFY `userReply_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversation_tb`
--
ALTER TABLE `conversation_tb`
  ADD CONSTRAINT `conversation_trigger` FOREIGN KEY (`conversation_trigger`) REFERENCES `trigger_tb` (`trigger_id`);

--
-- Constraints for table `group_tb`
--
ALTER TABLE `group_tb`
  ADD CONSTRAINT `group_pepperTalkParent` FOREIGN KEY (`group_pepperTalkParent`) REFERENCES `pepperTalk_tb` (`pepperTalk_id`);

--
-- Constraints for table `pepperTalk_tb`
--
ALTER TABLE `pepperTalk_tb`
  ADD CONSTRAINT `pepperTalk_conversation` FOREIGN KEY (`pepperTalk_conversation`) REFERENCES `conversation_tb` (`conversation_id`);

--
-- Constraints for table `userReply_tb`
--
ALTER TABLE `userReply_tb`
  ADD CONSTRAINT `userReply_group` FOREIGN KEY (`userReply_group`) REFERENCES `group_tb` (`group_id`);
