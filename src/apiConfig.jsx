// export const API_BASE_URL = "http://localhost:8000";
export const API_BASE_URL = "https://duespay.onrender.com"; 
// export const API_BASE_URL = "https://duespay.pythonanywhere.com"; 
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/register/`,
  PAYMENT_ITEMS: `${API_BASE_URL}/payment-items/`,
  GET_PAYMENT_ASSOCIATION: (shortName) => `${API_BASE_URL}/get-association/${shortName}/`,
  VERIFY_AND_CREATE_TRANSACTION: `${API_BASE_URL}/verify-and-create/`,
  GET_TRANSACTIONS: `${API_BASE_URL}/transactions/`,
  DETAIL_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,
  CREATE_ASSOCIATION: `${API_BASE_URL}/association/`,
  UPDATE_ASSOCIATION: (id) => `${API_BASE_URL}/association/${id}/`,
  CREATE_PAYER: `${API_BASE_URL}/payers/`,
  GET_PAYER: (id) => `${API_BASE_URL}/payers/${id}/`,
  GET_CREATE_BANK_ACCOUNT: `${API_BASE_URL}/bank-account/`,
  UPDATE_DETAIL_BANK_ACCOUNT: (id) => `${API_BASE_URL}/bank-account/${id}/`,
  GET_ADMIN_USER: `${API_BASE_URL}/adminuser/`,
  UPDATE_ADMIN_USER: (id) => `${API_BASE_URL}/adminuser/${id}/`,
  GET_ASSOCIATION: `${API_BASE_URL}/association/`,
  PAYMENT_ITEM_DETAILS: (id) => `${API_BASE_URL}/payment-items/${id}/`,
  PAYER_CHECK: `${API_BASE_URL}/payer-check/`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  UNREAD_NOTIFICATIONS_COUNT: `${API_BASE_URL}/notifications/unread-count/`,
  MARK_ALL_NOTIFICATIONS_READ: `${API_BASE_URL}/notifications/mark-all-read/`,
};