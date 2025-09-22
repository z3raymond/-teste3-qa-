import http from 'k6/http';
import { check, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { API_CONFIG } from '../config/api-config.js';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Load Test: Ramp-up gradual para avaliar comportamento sob carga normal
export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Warm-up: 5 usuários
    { duration: '1m', target: 10 },   // Load: 10 usuários simultâneos
    { duration: '30s', target: 0 }    // Ramp-down: volta ao baseline
  ],
  thresholds: API_CONFIG.thresholds
};

export default function () {
  const baseUrl = API_CONFIG.baseUrl;
  
  // Cenário 1: Teste de listagem completa de posts
  group('API Posts Tests', () => {
    const postsResponse = http.get(`${baseUrl}${API_CONFIG.endpoints.posts}`);
    
    const postsCheck = check(postsResponse, {
      'Posts status is 200': (r) => r.status === 200,
      'Posts response time < 500ms': (r) => r.timings.duration < 500,
      'Posts has valid JSON': (r) => {
        try {
          const posts = JSON.parse(r.body);
          return Array.isArray(posts) && posts.length > 0;
        } catch {
          return false;
        }
      }
    });
    
    errorRate.add(!postsCheck);
    responseTime.add(postsResponse.timings.duration);
    
    // Cenário 2: Teste de busca por post específico
    const singlePostResponse = http.get(`${baseUrl}${API_CONFIG.endpoints.posts}/1`);
    
    check(singlePostResponse, {
      'Single post status is 200': (r) => r.status === 200,
      'Single post has required fields': (r) => {
        try {
          const post = JSON.parse(r.body);
          return post.id && post.title && post.body && post.userId;
        } catch {
          return false;
        }
      }
    });
  });
  
  // Cenário 3: Teste de listagem de usuários
  group('API Users Tests', () => {
    const usersResponse = http.get(`${baseUrl}${API_CONFIG.endpoints.users}`);
    
    check(usersResponse, {
      'Users status is 200': (r) => r.status === 200,
      'Users response time < 300ms': (r) => r.timings.duration < 300,
      'Users data structure is valid': (r) => {
        try {
          const users = JSON.parse(r.body);
          return users.length === 10 && users[0].name && users[0].email;
        } catch {
          return false;
        }
      }
    });
  });
  
  // Cenário 4: Teste de filtro de comentários por post
  group('API Comments Tests', () => {
    const commentsResponse = http.get(`${baseUrl}${API_CONFIG.endpoints.comments}?postId=1`);
    
    check(commentsResponse, {
      'Comments status is 200': (r) => r.status === 200,
      'Comments filtered correctly': (r) => {
        try {
          const comments = JSON.parse(r.body);
          return comments.every(comment => comment.postId === 1);
        } catch {
          return false;
        }
      }
    });
  });
}

export function handleSummary(data) {
  return {
    'reports/performance-report.json': JSON.stringify(data, null, 2)
  };
}