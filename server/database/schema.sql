-- Create database
CREATE DATABASE IF NOT EXISTS neighborhood_help_portal;
USE neighborhood_help_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('requester', 'volunteer') NOT NULL,
  contact_info VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_info (contact_info),
  INDEX idx_role (role)
);

-- Help requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id VARCHAR(50) PRIMARY KEY,
  requester_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  urgency ENUM('low', 'medium', 'high') NOT NULL,
  status ENUM('open', 'in-progress', 'completed', 'cancelled') DEFAULT 'open',
  volunteer_id VARCHAR(50) NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_requester (requester_id),
  INDEX idx_volunteer (volunteer_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(50) PRIMARY KEY,
  request_id VARCHAR(50) NOT NULL,
  sender_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES help_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_request (request_id),
  INDEX idx_sender (sender_id),
  INDEX idx_timestamp (timestamp)
);
