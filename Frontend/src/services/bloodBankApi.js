import axios from "axios";

const API_BASE = "http://localhost:5000/api";

/**
 * Get all blood banks
 * GET /api/blood-banks
 * 
 * @param {Object} filters - { verificationStatus, city, state, page, limit }
 */
export const getAllBloodBanks = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.verificationStatus) params.append('verificationStatus', filters.verificationStatus);
  if (filters.city) params.append('city', filters.city);
  if (filters.state) params.append('state', filters.state);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  return axios.get(`${API_BASE}/blood-banks?${params.toString()}`);
};

/**
 * Get all VERIFIED blood banks (for dropdown selection)
 * GET /api/blood-banks/verified
 */
export const getVerifiedBloodBanks = () => {
  return axios.get(`${API_BASE}/blood-banks/verified`);
};

/**
 * Get blood bank by ID
 * GET /api/blood-banks/:id
 * 
 * @param {string} bloodBankId
 */
export const getBloodBankById = (bloodBankId) => {
  return axios.get(`${API_BASE}/blood-banks/${bloodBankId}`);
};
