import { User, HelpRequest, UserRole, RequestStatus, ChatMessage } from '../types';

// API base URL - change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// Helper to make API requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

export const Api = {
  // User APIs
  register: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    return fetchAPI('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (contactInfo: string): Promise<User> => {
    return fetchAPI('/users/login', {
      method: 'POST',
      body: JSON.stringify({ contact_info: contactInfo }),
    });
  },

  getUser: async (id: string): Promise<User | undefined> => {
    try {
      return await fetchAPI(`/users/${id}`);
    } catch (error) {
      return undefined;
    }
  },

  // Request APIs
  createRequest: async (requestData: Omit<HelpRequest, 'id' | 'status' | 'created_at' | 'resident_name'> & { resident_name: string }): Promise<HelpRequest> => {
    return fetchAPI('/requests', {
      method: 'POST',
      body: JSON.stringify({
        requester_id: requestData.resident_id,
        title: requestData.title,
        description: requestData.description,
        category: requestData.category,
        urgency: requestData.urgency,
        location: requestData.location,
      }),
    });
  },

  getRequestsForHelper: async (): Promise<HelpRequest[]> => {
    const requests = await fetchAPI('/requests?status=open');
    return requests.map((r: any) => ({
      ...r,
      resident_id: r.requester_id,
      resident_name: r.title.split(' - ')[0] || 'Resident',
      helper_id: r.volunteer_id,
      helper_name: r.volunteer_id ? 'Volunteer' : undefined,
      status: r.status as RequestStatus,
    }));
  },
  
  getAllRequests: async (): Promise<HelpRequest[]> => {
    const requests = await fetchAPI('/requests');
    return requests.map((r: any) => ({
      ...r,
      resident_id: r.requester_id,
      resident_name: r.title.split(' - ')[0] || 'Resident',
      helper_id: r.volunteer_id,
      helper_name: r.volunteer_id ? 'Volunteer' : undefined,
      status: r.status as RequestStatus,
    }));
  },

  getRequestsByResident: async (residentId: string): Promise<HelpRequest[]> => {
    const requests = await fetchAPI(`/requests?requester_id=${residentId}`);
    return requests.map((r: any) => ({
      ...r,
      resident_id: r.requester_id,
      resident_name: r.title.split(' - ')[0] || 'Resident',
      helper_id: r.volunteer_id,
      helper_name: r.volunteer_id ? 'Volunteer' : undefined,
      status: r.status as RequestStatus,
    }));
  },
  
  getRequestsByHelper: async (helperId: string): Promise<HelpRequest[]> => {
    const requests = await fetchAPI(`/requests?volunteer_id=${helperId}`);
    return requests.map((r: any) => ({
      ...r,
      resident_id: r.requester_id,
      resident_name: r.title.split(' - ')[0] || 'Resident',
      helper_id: r.volunteer_id,
      helper_name: r.volunteer_id ? 'Volunteer' : undefined,
      status: r.status as RequestStatus,
    }));
  },

  getRequestById: async (id: string): Promise<HelpRequest | undefined> => {
    try {
      const r = await fetchAPI(`/requests/${id}`);
      return {
        ...r,
        resident_id: r.requester_id,
        resident_name: r.title.split(' - ')[0] || 'Resident',
        helper_id: r.volunteer_id,
        helper_name: r.volunteer_id ? 'Volunteer' : undefined,
        status: r.status as RequestStatus,
      };
    } catch (error) {
      return undefined;
    }
  },

  updateRequestStatus: async (
    requestId: string,
    status: RequestStatus,
    helperId?: string,
    helperName?: string
  ): Promise<HelpRequest> => {
    const r = await fetchAPI(`/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: status === RequestStatus.PENDING ? 'open' : 
                status === RequestStatus.ACCEPTED ? 'in-progress' :
                status === RequestStatus.COMPLETED ? 'completed' : 'cancelled',
        volunteer_id: helperId,
      }),
    });
    
    return {
      ...r,
      resident_id: r.requester_id,
      resident_name: r.title.split(' - ')[0] || 'Resident',
      helper_id: r.volunteer_id,
      helper_name: helperName,
      status: status,
    };
  },

  // Chat APIs
  getMessages: async (requestId: string): Promise<ChatMessage[]> => {
    const messages = await fetchAPI(`/chat/${requestId}`);
    return messages.map((m: any) => ({
      id: m.id,
      requestId: m.request_id,
      senderId: m.sender_id,
      senderName: 'User',
      text: m.message,
      timestamp: m.timestamp,
    }));
  },

  sendMessage: async (requestId: string, senderId: string, senderName: string, text: string): Promise<ChatMessage> => {
    const m = await fetchAPI('/chat', {
      method: 'POST',
      body: JSON.stringify({
        request_id: requestId,
        sender_id: senderId,
        message: text,
      }),
    });
    
    return {
      id: m.id,
      requestId: m.request_id,
      senderId: m.sender_id,
      senderName,
      text: m.message,
      timestamp: m.timestamp,
    };
  },
};