// src/api.js
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/csc-245-project-v2/us-central1/helloWorld";

// Helper to wait until Firebase determines if a user is logged in (solves race conditions)
function waitForAuth() {
  const auth = getAuth();
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function fetchWithAuth(endpoint, options = {}) {
  // Wait for auth to finish loading instead of instantly throwing
  const user = await waitForAuth();
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Export reusable API calls
export const api = {
  getRooms: () => fetchWithAuth("/rooms"),
  createRoom: (data) =>
    fetchWithAuth("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  joinRoom: (inviteCode) =>
    fetchWithAuth("/rooms/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    }),
  startSession: (roomId, mode) =>
    fetchWithAuth(`/rooms/${roomId}/sessions`, {
      method: "POST",
      body: JSON.stringify({ mode }),
    }),
};