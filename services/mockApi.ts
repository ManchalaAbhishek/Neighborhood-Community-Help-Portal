import { User, HelpRequest, UserRole, RequestStatus, ChatMessage } from '../types';

// Simple in-memory store initialized from localStorage if available
const STORAGE_KEY_USERS = 'nchp_users';
const STORAGE_KEY_REQUESTS = 'nchp_requests';
const STORAGE_KEY_MESSAGES = 'nchp_messages';

const load = <T>(key: string, def: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : def;
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

let users: User[] = load(STORAGE_KEY_USERS, []);
let requests: HelpRequest[] = load(STORAGE_KEY_REQUESTS, []);
let messages: ChatMessage[] = load(STORAGE_KEY_MESSAGES, []);

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Api = {
  // User APIs
  register: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    await delay(500);
    // Check for existing user with same contact info to prevent duplicates (mock logic)
    const existing = users.find(u => u.contact_info.toLowerCase() === userData.contact_info.toLowerCase());
    if (existing) {
        throw new Error('User with this contact info already exists. Please login.');
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    save(STORAGE_KEY_USERS, users);
    return newUser;
  },

  login: async (contactInfo: string): Promise<User> => {
    await delay(500);
    const user = users.find(u => u.contact_info.toLowerCase() === contactInfo.trim().toLowerCase());
    if (!user) {
      throw new Error('User not found. Please check your contact info or create an account.');
    }
    return user;
  },

  getUser: async (id: string): Promise<User | undefined> => {
    await delay(200);
    return users.find((u) => u.id === id);
  },

  // Request APIs
  createRequest: async (requestData: Omit<HelpRequest, 'id' | 'status' | 'created_at' | 'resident_name'> & { resident_name: string }): Promise<HelpRequest> => {
    await delay(500);
    const newRequest: HelpRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.PENDING,
      created_at: new Date().toISOString(),
    };
    requests.push(newRequest);
    save(STORAGE_KEY_REQUESTS, requests);
    return newRequest;
  },

  getRequestsForHelper: async (): Promise<HelpRequest[]> => {
    await delay(500);
    // Helpers see Pending requests (to pick up) or requests they have accepted
    return requests.filter((r) => r.status === RequestStatus.PENDING || r.status !== RequestStatus.COMPLETED); 
    // Simplified: Show all active requests. In a real app, strict filtering applies.
    // For this UI, let's return ALL so helpers can see what is available.
  },
  
  getAllRequests: async (): Promise<HelpRequest[]> => {
      await delay(300);
      return requests;
  },

  getRequestsByResident: async (residentId: string): Promise<HelpRequest[]> => {
    await delay(400);
    return requests.filter((r) => r.resident_id === residentId);
  },
  
  getRequestsByHelper: async (helperId: string): Promise<HelpRequest[]> => {
    await delay(400);
    return requests.filter((r) => r.helper_id === helperId);
  },

  getRequestById: async (id: string): Promise<HelpRequest | undefined> => {
    await delay(200);
    return requests.find((r) => r.id === id);
  },

  updateRequestStatus: async (
    requestId: string,
    status: RequestStatus,
    helperId?: string,
    helperName?: string
  ): Promise<HelpRequest> => {
    await delay(400);
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const updatedRequest = { ...requests[reqIndex] };

    // Logic for status transitions
    if (status === RequestStatus.ACCEPTED) {
      if (updatedRequest.status !== RequestStatus.PENDING) throw new Error('Can only accept pending requests');
      updatedRequest.helper_id = helperId;
      updatedRequest.helper_name = helperName;
      updatedRequest.status = RequestStatus.ACCEPTED;
    } else {
      // Basic workflow validation
      if (updatedRequest.helper_id !== helperId && helperId !== undefined) {
         throw new Error('Unauthorized: Only the assigned helper can update this request');
      }
      updatedRequest.status = status;
    }

    requests[reqIndex] = updatedRequest;
    save(STORAGE_KEY_REQUESTS, requests);
    return updatedRequest;
  },

  // Chat APIs
  getMessages: async (requestId: string): Promise<ChatMessage[]> => {
    await delay(200);
    return messages
      .filter((m) => m.requestId === requestId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: async (requestId: string, senderId: string, senderName: string, text: string): Promise<ChatMessage> => {
    await delay(100);
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      requestId,
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    save(STORAGE_KEY_MESSAGES, messages);
    return newMessage;
  },
};