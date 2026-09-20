import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("pazooka_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export const fetchProducts = (params = {}) =>
  client.get("/products", { params: clean(params) }).then((r) => r.data);

export const fetchProduct = (id) => client.get(`/products/${id}`).then((r) => r.data);

export const fetchReviews = (id) => client.get(`/products/${id}/reviews`).then((r) => r.data);

export const createReview = (id, payload) =>
  client.post(`/products/${id}/reviews`, payload).then((r) => r.data);

export const checkPin = (pin) => client.post("/delivery/check", { pin }).then((r) => r.data);

export const reviewPhotoUrl = (p) => (p.startsWith("http") ? p : `${API}/review-photos/${p}`);

export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return client.post("/uploads", fd).then((r) => r.data.path);
};

export const createOrder = (payload) => client.post("/orders", payload).then((r) => r.data);

export const login = (payload) => client.post("/auth/login", payload).then((r) => r.data);

export const register = (payload) => client.post("/auth/register", payload).then((r) => r.data);

export const exchangeSession = (sessionId) =>
  client.get("/auth/session", { params: { session_id: sessionId } }).then((r) => r.data);

export const fetchMe = () => client.get("/auth/me").then((r) => r.data);

export const logoutApi = () => client.post("/auth/logout").then((r) => r.data);

export const fetchMyOrders = () => client.get("/auth/orders").then((r) => r.data);

export const createServiceRequest = (payload) => client.post("/auth/requests", payload).then((r) => r.data);

export const fetchMyRequests = () => client.get("/auth/requests").then((r) => r.data);
