import axios from 'axios';

const API_URL = "http://localhost:3000"; // ton API Gateway

// ----- Authentification "Etudiant" existant -----
export const signupUser = (payload) => {
  return axios.post(`${API_URL}/auth/signup`, payload);
};
export const loginUser = (payload) => {
  return axios.post(`${API_URL}/auth/login`, payload);
};

// ----- Authentification "Formateur" (nouveau) -----
export const signupInstructor = (payload) => {
  // Suppose qu'on ait un endpoint dédié
  return axios.post(`${API_URL}/instructor/signup`, payload);
};

export const loginInstructor = (payload) => {
  // Suppose qu'on ait un endpoint dédié
  return axios.post(`${API_URL}/instructor/login`, payload);
};

// ----- E-Learning : Cours -----
export const getAllCourses = (search = "") => {
  // Include search as a query parameter
  return axios.get(`${API_URL}/courses?search=${encodeURIComponent(search)}`);
};


export const getCoursesByInstructor = (instructorId) => {
  return axios.get(`${API_URL}/courses?instructorId=${instructorId}`);
};


export const getCourseById = (courseId) => {
  return axios.get(`${API_URL}/courses/${courseId}`);
};

// Créer un cours (côté formateur)
export const createCourse = (payload) => {
  const token = localStorage.getItem("token"); // On récupère le JWT stocké
  return axios.post(`${API_URL}/courses`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// UPDATE a course by ID
export const updateCourse = async (courseId, payload) => {
  const { data } = await axios.put(`${API_URL}/courses/${courseId}`, payload);
  return data;
};

// DELETE a course by ID
export const deleteCourse = async (courseId) => {
  return axios.delete(`${API_URL}/courses/${courseId}`);
};


export const checkout = (payload) => {
  const token = localStorage.getItem("token") || "";
  return axios.post(`${API_URL}/payments/checkout`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPurchaseStatus = (userId, courseId) => {
  return axios.get(`${API_URL}/payments/purchase-status`, {
    params: { userId, courseId }
  });
};
/*export const checkout = (payload) => {
  const token = localStorage.getItem("token") || "";
  return axios.post(`http://localhost:3007/payments/checkout`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};*/