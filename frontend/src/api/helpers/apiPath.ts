export const API_BASE = '/api/v1';

export const paths = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    me: `${API_BASE}/auth/me`,
  },
  vehicles: {
    list: `${API_BASE}/vehicles`,
    byId: (id: string) => `${API_BASE}/vehicles/${id}`,
  },
  profile: {
    me: `${API_BASE}/profile/me`,
  },
};
