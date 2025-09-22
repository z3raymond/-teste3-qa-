import http from 'k6/http';
import { check } from 'k6';
import { API_CONFIG } from '../config/api-config.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01']
  }
};

export default function () {
  const response = http.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.posts}/1`);
  
  check(response, {
    'API is accessible': (r) => r.status === 200,
    'Response is valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    }
  });
}