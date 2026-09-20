import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export const fetchProducts = (params = {}) =>
  axios.get(`${API}/products`, { params: clean(params) }).then((r) => r.data);

export const fetchProduct = (id) => axios.get(`${API}/products/${id}`).then((r) => r.data);

export const fetchReviews = (id) => axios.get(`${API}/products/${id}/reviews`).then((r) => r.data);

export const createReview = (id, payload) =>
  axios.post(`${API}/products/${id}/reviews`, payload).then((r) => r.data);

export const checkPin = (pin) => axios.post(`${API}/delivery/check`, { pin }).then((r) => r.data);

export const reviewPhotoUrl = (p) => (p.startsWith("http") ? p : `${API}/review-photos/${p}`);

export const uploadPhoto = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API}/uploads`, fd).then((r) => r.data.path);
};

export const createOrder = (payload) => axios.post(`${API}/orders`, payload).then((r) => r.data);
