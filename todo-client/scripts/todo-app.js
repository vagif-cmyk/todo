function createAppTitle(title) {
  const appTitle = document.createElement('h3');
  appTitle.innerHTML = title;
  return appTitle;
}

function createTodoItemForm() {
  const form = document.createElement('form');
  const buttonWrapper = document.createElement('div');
  const input = document.createElement('input');

  const button = document.createElement('button');
  button.setAttribute('disabled', true);

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите названия нового дела';
  buttonWrapper.classList.add('input-gorup-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  input.addEventListener('input', e => {
    if (e.target.value.trim()) {
      button.removeAttribute('disabled');
    }
    else {
      button.setAttribute('disabled', true);
    }
  });

  return {
    form,
    input,
    button,
  };
}



function createTodoList() {
  const list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

function createTodoItemDOM(todoItem, { onDone, onDelete }) {

  const doneClass = 'list-group-item-success';

  const item = document.createElement('li');
  const buttonGroup = document.createElement('div');
  const doneButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = todoItem.name;

  if (todoItem.done) {
    item.classList.add(doneClass);
  }

  buttonGroup.classList.add('bnt-group', 'bnt-group-sm');
  doneButton.classList.add('bnt', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('bnt', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  doneButton.addEventListener('click', async function () {
    onDone({ todoItem, element: item })
    item.classList.toggle(doneClass, todoItem.done);
  });

  deleteButton.addEventListener('click', async function () {
    onDelete({ todoItem, element: item });

  });
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(container, { title, owner, lStorage }) {

  const { createTodoItem, getTodoItems, patchTodoItem, deleteTodoItem } = lStorage ? await import('./localStorage.js') : await import('./todo-server.js');

  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();

  const hadlers = {
    async onDone({ todoItem }) {
      todoItem.done = !todoItem.done;
      await patchTodoItem(todoItem.id, todoItem.done, owner);
    },

    async onDelete({ todoItem, element }) {
      if (!confirm('Вы уверены?')) {
        return;
      }
      element.remove();
      await deleteTodoItem(todoItem.id, owner);
    }
  }

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  let todoItemList;

  todoItemList = await getTodoItems(owner) || [];

  todoItemList.forEach(e => {
    const todoItemElement = createTodoItemDOM(e, hadlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener('submit', async function (e) {

    e.preventDefault();

    if (!todoItemForm.input.value.trim())
      return;

    let response;
    response = await createTodoItem(todoItemForm.input.value, owner);

    let todoItem = createTodoItemDOM(response, hadlers);

    todoList.append(todoItem);
    todoItemForm.input.value = '';
  });
}
//
function onChangeStorage({ todoApp, lStorage, btnChangeStorage, title, owner }) {

  todoApp.textContent = '';

  btnChangeStorage.textContent = lStorage ? 'Перейти на серверное хранилище' : 'Перейти на локальное хранилище';

  createTodoApp(todoApp, { title, owner, lStorage });
}

export { createTodoApp, onChangeStorage };
