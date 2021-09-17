
(function () {

  let arrAddItemLocal = [];

  function createAppTitle(title) {
    let appTitle = document.createElement('h3');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите названия нового дела';
    buttonWrapper.classList.add('input-gorup-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', true);              // устанавливаем атрибут который по умолчанию блокирует доступ к кнопке
                                                        // т.к. после загрузки страницы поле input пустое
    input.addEventListener('input', () => {             // вешаем событие на input
      if (input.value)
        button.removeAttribute('disabled');             // если что-то введено, разблокируем кнопку
      else
        button.setAttribute('disabled', true);          // иначе блокируем кнопку
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, key = '', done = false) {

    arrAddItemLocal.push({
      name,
      done
    });

    let buf = JSON.stringify(arrAddItemLocal);
    localStorage.setItem(key, buf);

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('bnt-group', 'bnt-group-sm');
    doneButton.classList.add('bnt', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('bnt', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    }
  }

  function setFlag(item, flag, key) {

    let arrFromLocal = JSON.parse(localStorage.getItem(key));
    let buf = [];

    for (let i in arrFromLocal) {
      if (document.querySelector('ul').children[i] === item) {
        arrFromLocal[i].done = flag;
      }
      buf.push(arrFromLocal[i]);
    }
    arrFromLocal = JSON.stringify(buf);
    localStorage.setItem(key, arrFromLocal);
  }

  function paintGreen(item, key) {

    item.classList.toggle('list-group-item-success');

    if (item.classList.contains('list-group-item-success'))
      setFlag(item, true, key);

    else
      setFlag(item, false, key);
  }

  function deleteItem(item, key) {

    if (confirm('Вы уверены?')) {

      let arrFromLocal = JSON.parse(localStorage.getItem(key));
      let buf = [];

      for (let i in arrFromLocal) {
        if (document.querySelector('ul').children[i] !== item) {
          buf.push(arrFromLocal[i]);
        }
      }

      arrFromLocal = JSON.stringify(buf);
      localStorage.setItem(key, arrFromLocal);

      item.remove();
    }
  }

  function fillList(items, key, list) {
    for (let value of items) {
      let values = createTodoItem(value.name, key, value.done);

      if (value.done)
        values.item.classList.toggle('list-group-item-success');

        addEventToButtons(values, key);

      list.append(values.item);
    }
  }

  function addEventToButtons(item, key) {

   item.doneButton.addEventListener('click', () => paintGreen(item.item, key));
   item.deleteButton.addEventListener('click', () => deleteItem(item.item, key));
  }

  function createTodoApp(container, title = 'Список дел', todoDefault = [], key = '') {

    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    // если в local нет элемента с переданым ключом то загружаем список по умолчанию
    if (!localStorage.getItem(key))
      fillList(todoDefault, key, todoList);

    //иначе перебераем local и загружаем
    else {
      let arrFromLocal = JSON.parse(localStorage.getItem(key));
      fillList(arrFromLocal, key, todoList);
    }

    container.append(createAppTitle(title));
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.form.addEventListener('submit', function (e) {

      e.preventDefault();

      if (!todoItemForm.input.value)
        return;

      let todoItem = createTodoItem(todoItemForm.input.value, key);
      addEventToButtons(todoItem, key);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', true);         // т.к. мы зачистили input, то по условию, кнопку надо заблокировать
    });
  }

  window.createTodoApp = createTodoApp;
})();

