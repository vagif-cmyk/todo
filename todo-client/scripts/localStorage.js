// localStorage.clear()

// получает данные из локального хранилища. Возврощает массив с объектами.
function getTodoItemsFromLocalStorage(owner) {
    return JSON.parse(localStorage.getItem(owner));
}
// добавляет в локальное хранилище объект с делом.
function createTodoItemToLocalStorage(name, owner) {
    let newTodoItems = [];
    const todoItem = { owner, name, done: false, id: new Date().valueOf() }; // в поле id генерируем уникальное id

    if (JSON.parse(localStorage.getItem(owner))) { // если в хранилище есть значение с переданным ключом
        newTodoItems = JSON.parse(localStorage.getItem(owner));  // записываем его в массив
    }
    newTodoItems.push(todoItem);  // добавляем в новый массив новое дело

    localStorage.setItem(owner, JSON.stringify(newTodoItems));

    return todoItem;
}
// меняет поле done в нужном объекте дела.
function patchTodoItemToLocalStorage(id, done, owner) {

    let todoItems = JSON.parse(localStorage.getItem(owner));

    // в цикле находим объект с нужным id и меняем у него поле done.
    todoItems = todoItems.map(e => {
        if (e.id == id) {
            e.done = done;
        }
        return e;
    });

    localStorage.setItem(owner, JSON.stringify(todoItems));
}

// удаляет из хранилище объект с делом.
function deleteTodoItemToLocalStorage( id, owner) {

    let todoItems = JSON.parse(localStorage.getItem(owner));

    todoItems = todoItems.filter(e => e.id != id);

    localStorage.setItem(owner, JSON.stringify(todoItems));
}


export { getTodoItemsFromLocalStorage as getTodoItems,
   patchTodoItemToLocalStorage as patchTodoItem,
   deleteTodoItemToLocalStorage as deleteTodoItem,
   createTodoItemToLocalStorage as createTodoItem };
