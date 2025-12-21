export enum UserRole {
  RESIDENT = 'Resident',
  HELPER = 'Helper',
}

export enum RequestStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  IN_PROGRESS = 'In-progress',
  COMPLETED = 'Completed',
}

export interface User {
  id: string;
  name: string;
  contact_info: string;
  location: string;
  role: UserRole;
  created_at: string;
}

export interface HelpRequest {
  id: string;
  resident_id: string;
  resident_name: string; // Denormalized for display convenience
  helper_id?: string;
  helper_name?: string; // Denormalized for display convenience
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  attachments?: string; // URL string
  created_at: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export const CATEGORIES = [
  'Groceries',
  'Home Repair',
  'Transportation',
  'Pet Care',
  'Gardening',
  'Tech Support',
  'Other',
];