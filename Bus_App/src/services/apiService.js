/**
 * Centralized API service to handle all requests to the backend.
 * This ensures consistent handling of the base URL and authentication tokens.
 */

// Both locally (Vite proxy) and on Vercel (same domain), /api always works.
// VITE_API_URL can override this for special deployments (e.g. separate backend host).
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper function to create headers with the JWT token if available.
 */
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const apiService = {
  // --- AUTH ENDPOINTS ---
  
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Login a user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      // Attach status so the caller can show the right message
      const err = new Error(data.message || 'Login failed');
      err.status = response.status;
      throw err;
    }
    return data;
  },

  // --- BUS ENDPOINTS ---
  
  // Create a new bus (Uploader)
  createBus: async (busData) => {
    const response = await fetch(`${API_BASE_URL}/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(busData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create bus');
    return data;
  },

  // Get all buses
  getAllBuses: async () => {
    const response = await fetch(`${API_BASE_URL}/buses`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch buses');
    return data;
  },

  // Search for buses
  searchBuses: async (from, to) => {
    // Trim to eliminate accidental spaces from URL params
    const cleanFrom = (from || "").trim();
    const cleanTo   = (to   || "").trim();

    console.log("[apiService.searchBuses] from:", cleanFrom, "| to:", cleanTo);

    const url = `${API_BASE_URL}/buses/search?from=${encodeURIComponent(cleanFrom)}&to=${encodeURIComponent(cleanTo)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch buses');
    return data;
  },

  // --- BOOKING ENDPOINTS ---
  
  // Create a new booking (Protected)
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(), // Automatically includes Bearer token
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Booking failed');
    return data;
  },

  // Get current user's bookings (Protected)
  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch bookings');
    return data;
  },

  // Get a single booking by custom bookingId (for Ticket page)
  getBookingByBookingId: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/ticket/${bookingId}`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch ticket');
    return data;
  }
};