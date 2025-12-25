const BASE_URL = 'http://localhost:5000/api';

export const Api = {
  // =========================
  // AUTH APIs (REAL)
  // =========================

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error('Invalid credentials');
    }

    return res.json();
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        role: data.role.toLowerCase() // important for MySQL ENUM
      })
    });

    if (!res.ok) {
      throw new Error('Registration failed');
    }

    return res.json();
  },

  // =========================
  // REQUEST APIs (STUBS FOR NOW)
  // =========================

  createRequest: async (_data?: any) => {
    throw new Error('createRequest not implemented yet');
  },

  getAllRequests: async () => {
    return [];
  },

  getRequestsByResident: async (_residentId?: any) => {
    return [];
  },

  getRequestsByHelper: async (_helperId?: any) => {
    return [];
  },

  updateRequestStatus: async (
    _requestId?: any,
    _status?: any,
    _helperId?: any
  ) => {
    throw new Error('updateRequestStatus not implemented yet');
  },

  // =========================
  // CHAT APIs (STUBS FOR NOW)
  // =========================

  getMessages: async (_requestId?: any) => {
    return [];
  },

  sendMessage: async (
    _requestId?: any,
    _senderId?: any,
    _senderName?: any,
    _text?: any
  ) => {
    throw new Error('sendMessage not implemented yet');
  }
};
