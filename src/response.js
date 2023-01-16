export default function response(res, status, data) {
  res.writeHead(status, {'content-type': 'application/json'});
  res.end(JSON.stringify(data, null, 2));
}