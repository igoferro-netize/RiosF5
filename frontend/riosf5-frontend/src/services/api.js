/**
 * Serviço de API para comunicação com backend
 * Arquivo: frontend/src/services/api.js
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 e não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data.data;
          localStorage.setItem('access_token', access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Se empresa bloqueada
    if (error.response?.data?.bloqueado) {
      // Redirecionar para tela de bloqueio
      window.location.href = '/bloqueado';
    }

    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
};

// USERS
export const usersAPI = {
  list: () => api.get('/usuarios'),
  get: (id) => api.get(`/usuarios/${id}`),
  create: (userData) => api.post('/usuarios', userData),
  update: (id, userData) => api.put(`/usuarios/${id}`, userData),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

// EMPRESAS
export const empresasAPI = {
  list: () => api.get('/empresas'),
  get: (id) => api.get(`/empresas/${id}`),
  create: (empresaData) => api.post('/empresas', empresaData),
  update: (id, empresaData) => api.put(`/empresas/${id}`, empresaData),
  delete: (id) => api.delete(`/empresas/${id}`),
  bloquear: (id, motivo) => api.post(`/empresas/${id}/bloquear`, { motivo }),
  desbloquear: (id) => api.post(`/empresas/${id}/desbloquear`),
};

// CONTRATOS E COBRANÇAS
export const cobrancaAPI = {
  listarContratos: () => api.get('/contratos'),
  obterContratoEmpresa: (empresaId) => api.get(`/contratos/${empresaId}`),
  criarContrato: (contratoData) => api.post('/contratos', contratoData),
  atualizarContrato: (contratoId, contratoData) => api.put(`/contratos/${contratoId}`, contratoData),
  listarFaturas: (contratoId) => api.get(`/faturas/${contratoId}`),
  pagarFatura: (faturaId) => api.post(`/faturas/${faturaId}/pagar`),
  verificarInadimplencia: () => api.post('/verificar-inadimplencia'),
};

// AGENDA
export const agendaAPI = {
  list: () => api.get('/agenda/eventos'),
  get: (id) => api.get(`/agenda/eventos/${id}`),
  create: (eventoData) => api.post('/agenda/eventos', eventoData),
  update: (id, eventoData) => api.put(`/agenda/eventos/${id}`, eventoData),
  delete: (id) => api.delete(`/agenda/eventos/${id}`),
};

// TREINAMENTOS
export const treinamentosAPI = {
  list: () => api.get('/treinamentos'),
  get: (id) => api.get(`/treinamentos/${id}`),
  create: (treinamentoData) => api.post('/treinamentos', treinamentoData),
  update: (id, treinamentoData) => api.put(`/treinamentos/${id}`, treinamentoData),
  delete: (id) => api.delete(`/treinamentos/${id}`),
};

export default api;
