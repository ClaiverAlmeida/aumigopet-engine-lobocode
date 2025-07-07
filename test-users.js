import http from 'k6/http';
import { sleep, check } from 'k6';

// executar :  k6 run test-users.js  

const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGxhdGZvcm0gQWRtaW4iLCJlbWFpbCI6InBsYXRmb3JtYWRtaW5AdXNlci5jb20iLCJyb2xlIjoiUExBVEZPUk1fQURNSU4iLCJzdWIiOiJjbWNvODY3bTkwMDAwbHR4NmQ2MDJwM2lmIiwicGVybWlzc2lvbnMiOltbIm1hbmFnZSIsImFsbCJdXSwiaWF0IjoxNzUxNzM3Nzk0LCJleHAiOjE3NTE3NDQ5OTR9.YtyW7CojUjKZGXtTRJxN-mzCwBsV5ygedLz6v1v3eUU'

export let options = {
  vus: 200, // usuários virtuais simultâneos
  duration: '10s', // duração do teste
};

export default function () {
  const res = http.get('http://localhost:3000/users?page=1&limit=20', {
    headers: {
      Authorization: `Bearer ${access_token}`    }
  });
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
} 