import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class UserService {

  getFirstPage() {
    return axios.get(API_URL + 'patients/sizedata',{ headers: authHeader() });
  }

  getNextPage(page) {
    return axios.get(API_URL + 'patients/'+page,{ headers: authHeader() });
  }

  getUserBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }
}

export default new UserService();
