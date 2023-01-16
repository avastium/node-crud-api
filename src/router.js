import url from 'url';
import response from './response.js';
import * as db from './database.js';

export const routes = async (req, res) => {
  const params = url.parse(req.url, true);
  if (params.path === '/api/users' && req.method === 'GET') {
    return response(res, 200, db.getUsers());
  }
  else if (params.path.includes('/api/users/') && req.method === 'GET') {
    const id = params.path.split('/').at(-1);
    const result = db.getUser(id);
    if (result === 400) return response(res, 400, {error: 'invalid uuid'});
    if (!result.length) return response(res, 404, {error: 'user not found'});
    return response(res, 200, result);
  }
  else if (params.pathname === '/api/users' && req.method === 'POST') {
    if (!params.query.name || !params.query.age || !params.query.hobbies) return response(res, 400, {error: 'missing required parameters'});
    const result = db.addUser({name: params.query.name, age: params.query.age, hobbies: params.query.hobbies});
    return response(res, 200, result);
  }
  else if (params.path.includes('/api/users') && req.method === 'PUT') {
    if (!params.query.id || !params.query.name || !params.query.age || !params.query.hobbies) return response(res, 400, {error: 'missing required parameters'});
    const result = db.updateUser({id: params.query.id, name: params.query.name, age: params.query.age, hobbies: params.query.hobbies});
    if (result === 400) return response(res, 400, {error: 'invalid uuid'});
    if (result === 404) return response(res, 404, {error: 'user not found'});
    return response(res, 200, result);
  }
  else if (params.path.includes('/api/users/') && req.method === 'DELETE') {
    const id = req.url.split('/').at(-1);
    const result = db.deleteUser(id);
    if (result === 400) return response(res, 400, {error: 'invalid uuid'});
    if (result === 404) return response(res, 404, {error: 'user not found'});
    return response(res, 204, {message: 'user deleted'});
  }
  else return response(res, 404, {error: 'not found'});
};