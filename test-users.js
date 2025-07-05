import http from 'k6/http';
import { sleep, check } from 'k6';

// executar :  k6 run test-users.js  

export let options = {
  vus: 20, // usuários virtuais simultâneos
  duration: '60s', // duração do teste
};

export default function () {
  const res = http.get('http://localhost:3000/users?page=1&limit=20', {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSFIiLCJlbWFpbCI6ImhyQHVzZXIuY29tIiwicm9sZSI6IkhSIiwic3ViIjoiY21jcHBsZW84MDAwYmx0YmlpajdleDhkaiIsInBlcm1pc3Npb25zIjpbWyJyZWFkIiwiYWxsIix7ImNvbXBhbnlJZCI6ImNtY28wODRrazAwMDBsdDk2cHhscW90OXMifV0sWyJjcmVhdGUiLCJVc2VyIix7ImNvbXBhbnlJZCI6ImNtY28wODRrazAwMDBsdDk2cHhscW90OXMifV0sWyJyZWFkIiwiVXNlciIseyJjb21wYW55SWQiOiJjbWNvMDg0a2swMDAwbHQ5NnB4bHFvdDlzIn1dLFsidXBkYXRlIiwiVXNlciIseyJjb21wYW55SWQiOiJjbWNvMDg0a2swMDAwbHQ5NnB4bHFvdDlzIn1dLFsiZGVsZXRlIiwiVXNlciIseyJjb21wYW55SWQiOiJjbWNvMDg0a2swMDAwbHQ5NnB4bHFvdDlzIn1dLFsiY3JlYXRlIiwiUG9zdCIseyJjb21wYW55SWQiOiJjbWNvMDg0a2swMDAwbHQ5NnB4bHFvdDlzIn1dLFsicmVhZCIsIlBvc3QiLHsiY29tcGFueUlkIjoiY21jbzA4NGtrMDAwMGx0OTZweGxxb3Q5cyJ9XSxbInVwZGF0ZSIsIlBvc3QiLHsiY29tcGFueUlkIjoiY21jbzA4NGtrMDAwMGx0OTZweGxxb3Q5cyJ9XSxbImRlbGV0ZSIsIlBvc3QiLHsiY29tcGFueUlkIjoiY21jbzA4NGtrMDAwMGx0OTZweGxxb3Q5cyJ9XV0sImlhdCI6MTc1MTcyODY3NCwiZXhwIjoxNzUxNzM1ODc0fQ.m5J0qzOkmb2K_ge4NuM3O5WKE9U5ONsPgQt6TronbqA'
    }
  });
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
} 