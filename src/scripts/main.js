'use strict';

let currentTodos = [
  {
    id: 1,
    title: 'HTML',
    completed: true,
  },
  {
    id: 2,
    title: 'CSS',
    completed: true,
  },
  {
    id: 3,
    title: 'Java Script',
    completed: false,
  },
];

const root = document.querySelector('.todoapp');

render();

const itemsList = root.querySelector('.todo-list');
const allToggler = root.querySelector('.toggle-all');
const clearCompletedButton = root.querySelector('.clear-completed');
const filter = root.querySelector('.filters');

function render() {
  const activeTodos = currentTodos.filter(todo => !todo.completed);
  const completedTodos = currentTodos.filter(todo => todo.completed);

  root.innerHTML = `
  <header class="header">
      <h1>todos</h1>

      <input
        type="text"
        class="new-todo"
        placeholder="What needs to be done?"
        onkeydown="handleAddTodo(event)"
      >
  </header>

  ${currentTodos.length > 0 ? `
    <section class="main">
    <span class="toggle-all-container">
      <input
      id="toggle-all"
      type="checkbox"
      class="toggle-all"
      ${activeTodos.length === 0 ? 'checked' : ''}
      >
      <label for="toggle-all"></label>
    </span>

    <ul class="todo-list">
    ${currentTodos.map(todo => `
      <li
        class="todo-item ${todo.completed ? 'completed' : ''}"
        data-todo-id="${todo.id}"
      >
        <input
          id="todo-${todo.id}"
          class="toggle"
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
        >
        <label for="todo-${todo.id}">${todo.title}</label>
        <button type="button" class="destroy"></button>
      </li>
    `).join('')}
    </ul>
  </section>

  <footer class="footer">
    <span class="todo-count">${activeTodos.length} items left</span>

    <ul class="filters">
      <li>
        <a href="#/" data-filter="all" class="selected">All</a>
      </li>

      <li>
        <a href="#/active" data-filter="active">Active</a>
      </li>

      <li>
        <a href="#/completed" data-filter="completed">Completed</a>
      </li>
    </ul>

    ${completedTodos.length > 0 ? `
      <button class="clear-completed">
        Clear completed
      </button>
    ` : ''}

  </footer>
  ` : ''}
  `;
}

initTodos();

function initTodos() {
  itemsList.innerHTML = `
  ${currentTodos.map(todo => `
    <li
      class="todo-item ${todo.completed ? 'completed' : ''}"
      data-todo-id="${todo.id}"
    >
      <input
        id="todo-${todo.id}"
        class="toggle"
        type="checkbox"
        ${todo.completed ? 'checked' : ''}
      >
      <label for="todo-${todo.id}">${todo.title}</label>
      <button type="button" class="destroy"></button>
    </li>
  `).join('')}
`;

  updateInfo();
}

function updateInfo() {
  const completedTogglers = root.querySelectorAll('.toggle:checked');
  const activeTogglers = root.querySelectorAll('.toggle:not(:checked)');
  const counter = root.querySelector('.todo-count');
  const toggleAllContainer = root.querySelector('.toggle-all-container');
  const footer = root.querySelector('.footer');

  const hasTodos = activeTogglers.length > 0 || completedTogglers.length > 0;

  counter.innerHTML = `${activeTogglers.length} items left`;

  allToggler.checked = activeTogglers.length === 0;
  clearCompletedButton.hidden = completedTogglers.length === 0;

  footer.hidden = !hasTodos;
  toggleAllContainer.hidden = !hasTodos;
};

function handleAddTodo(e) {
  if (e.key !== 'Enter') {
    return;
  }

  if (!e.target.value) {
    return;
  }

  const id = +new Date();

  currentTodos.push({
    id: id,
    title: e.target.value,
    completed: false,
  });

  render();
}

itemsList.addEventListener('click', (e) => {
  if (!e.target.matches('.destroy')) {
    return;
  }

  const item = e.target.closest('.todo-item');

  initTodos();

  currentTodos = currentTodos.filter(todo => todo.id !== +item.dataset.todoId);

  updateInfo();
});

itemsList.addEventListener('change', (e) => {
  if (!e.target.matches('.toggle')) {
    return;
  }

  const item = e.target.closest('.todo-item');

  const selectedTodo = currentTodos.find(todo =>
    todo.id === +item.dataset.todoId);

  selectedTodo.completed = e.target.checked;

  initTodos();

  updateInfo();
});

clearCompletedButton.addEventListener('click', () => {
  currentTodos = currentTodos.filter(todo => !todo.completed);

  initTodos();

  updateInfo();
});

allToggler.addEventListener('change', (e) => {
  currentTodos.forEach(todo => {
    todo.completed = allToggler.checked;
  });

  initTodos();

  updateInfo();
});

filter.addEventListener('click', (e) => {
  if (!e.target.dataset.filter) {
    return;
  }

  const filterButtons = root.querySelectorAll('[data-filter]');

  for (const button of filterButtons) {
    button.classList.toggle('selected', button === e.target);
  }

  const togglers = root.querySelectorAll('.toggle');

  for (const toggler of togglers) {
    const item = toggler.closest('.todo-item');

    switch (e.target.dataset.filter) {
      case 'all':
        item.hidden = false;
        break;

      case 'active':
        item.hidden = toggler.checked;
        break;

      case 'completed':
        item.hidden = !toggler.checked;
        break;
    }
  }
});
