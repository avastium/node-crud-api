let STORAGE = [];


export function getUsers() {
  return STORAGE;
}

export function getUser(id) {
  if (!new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$').test(id)) return 400;
  return STORAGE.filter((item) => item.id === id);
}

export function addUser({name, age, hobbies}) {
  STORAGE.push({id: crypto.randomUUID(), name: name, age: age, hobbies: hobbies});
  return STORAGE[STORAGE.length - 1];
}

export function updateUser({id, name, age, hobbies}) {
  const user = getUser(id);
  if (user === 400) return 400;
  if (!user.length) return 404;
  const index = STORAGE.findIndex((item) => item.id === id);
  STORAGE[index].name = name;
  STORAGE[index].age = age;
  STORAGE[index].hobbies = hobbies;
  return STORAGE[STORAGE.length - 1];
}

export function deleteUser(id) {
  if (!new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$').test(id)) return 400;
  const index = STORAGE.findIndex((item) => item.id === id);
  if (index === -1) return 404;
  STORAGE.splice(index, 1);
  return 204;
}