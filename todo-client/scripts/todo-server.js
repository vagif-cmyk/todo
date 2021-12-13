const url = 'http://localhost:3000/api/todos/';

async function getTodoItemsFromServer(owner) {
  const reqwest = await fetch(`${url}?owner=${owner}`);
  const response = await reqwest.json();

  return response;
}

async function createTodoItemOnServer(name, owner) {

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      owner,
    })
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function patchTodoItemOnServer(id, done, owner = '') {
  await fetch(`${url}${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      done,
    })
  });
}

async function deleteTodoItemOnServer(id) {
  await fetch(`${url}${id}`, {
    method: 'DELETE',
  });
}
export {
  createTodoItemOnServer as createTodoItem,
  getTodoItemsFromServer as getTodoItems,
  patchTodoItemOnServer as patchTodoItem,
  deleteTodoItemOnServer as deleteTodoItem,
};
