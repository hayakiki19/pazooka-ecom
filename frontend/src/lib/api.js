import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export const fetchProducts = (params = {}) =>
  axios.get(`${API}/products`, { params: clean(params) }).then((r) => r.data);

export const fetchProduct = (id) => axios.get(`${API}/products/${id}`).then((r) => r.data);

export const createOrder = (payload) => axios.post(`${API}/orders`, payload).then((r) => r.data);
