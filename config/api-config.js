export const API_CONFIG = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  endpoints: {
    posts: '/posts',
    users: '/users',
    comments: '/comments'
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
    http_reqs: ['rate>10']
  }
};

export const LOAD_PROFILES = {
  smoke: {
    vus: 1,
    duration: '30s'
  },
  load: {
    vus: 10,
    duration: '2m'
  },
  stress: {
    vus: 50,
    duration: '5m'
  }
};