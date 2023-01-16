import { server } from './index.js';
import { test, it, describe, before, after } from 'node:test';

test('api/users', () => {
  const serverName = `localhost:${process.env.PORT}`;

  before(() => server);

  after((done) => done());

  describe('GET', () => {
    it('GET /api/users, expect 200', () => request(serverName).get('/api/users').expect(200));
    it('GET /api/users/aboba, wrong uuid, expect 400', () => request(serverName).get('/api/users/aboba').expect(400));
  });

  describe('POST', () => {
    it('POST /api/users, expect 201', () => request(serverName).post('/api/users').send({name: 'Valera', age: 54, hobbies: []}).expect(201));
    it('POST /api/users, missing required fields, expect 400', () => request(serverName).post('/api/users').send({}).expect(400));
  });

  describe('PUT', () => {
    it('PUT /api/users/{userId}, invalid uuid, expect 400', async () => request(serverName).put('/api/users/').send({username: 'Valera', age: 120, hobbies: []}).expect(400));
    it("PUT /api/users/{userId}, not existing user, expect 404", async () => request(serverName).put(`/api/users/778ba6a0-3969-426d-8a9d-e19ee6b144a1`).send({name: 'Valera', age: 54, hobbies: []}).expect(404));
  });

  describe("DELETE", () => {
    it('DELETE /api/users/54, wrong uuid, expect 400', () => request(serverName).delete(`/api/users/54`).expect(400));
    it('PUT /api/users/{userId}, not existing user, expect 404', () => request(serverName).delete(`/api/users/778ba6a0-3969-426d-8a9d-e19ee6b144a1`).expect(404));
  });

  describe('404 Not Found', () => {
    it('GET /randomurl, expect 404', () => request(serverName).get('/randomurl').expect(404));
  });
});