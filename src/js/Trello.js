export default class Trello {
  constructor(container) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container;
    }
    this.currentElement = undefined;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  init() {
    this.container.addEventListener('click', Trello.mouseClickHandler);

    [...this.container.querySelectorAll('.add-card')].forEach((addElem) => {
      addElem.addEventListener('click', Trello.addTaskFormHandler);
    });

    [...this.container.querySelectorAll('.cancel-adding')].forEach((cancelElem) => {
      cancelElem.addEventListener('click', Trello.cancelTaskAddingHandler);
    });

    [...this.container.querySelectorAll('.add-card-button')].forEach((addButton) => {
      addButton.addEventListener('click', Trello.addNewTaskButtonHandler);
    });

    this.DnDInit();
  }

  static mouseClickHandler(event) {
    const cross = event.target.closest('.cross');
    if (cross) {
      event.target.closest('.task').remove();
    }
  }

  static addTaskFormHandler(event) {
    const container = event.target.closest('.add-task-container');
    Trello.toggleNewTaskForm(container);
    container.querySelector('textarea').focus();
  }

  static toggleNewTaskForm(container) {
    container.querySelector('.new-card').classList.toggle('none');
    container.querySelector('.add-card').classList.toggle('none');
  }

  static cancelTaskAddingHandler(event) {
    const container = event.target.closest('.add-task-container');
    container.querySelector('textarea').value = '';
    Trello.toggleNewTaskForm(container);
  }

  static addNewTaskButtonHandler(event) {
    const addForm = event.target.closest('.add-task-container');
    const cardsContainer = addForm.closest('.column').querySelector('.cards-container');
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    newTask.innerHTML = `<div class="content"></div>
        <div class="cross-container">
          <span class="cross">&#10006</span>
        </div> 
            `;
    newTask.querySelector('.content').innerText = addForm.querySelector('textarea').value;
    cardsContainer.appendChild(newTask);
    addForm.querySelector('textarea').value = '';
    Trello.toggleNewTaskForm(addForm);
  }

  DnDInit() {
    this.container.addEventListener('mousedown', (event) => {
      event.preventDefault();
      if (event.target.matches('.cross')) { return; }
      const task = event.target.closest('.task');
      if (task) {
        this.currentElement = task;
        const { left, top } = this.currentElement.getBoundingClientRect();
        this.dx = event.clientX - left;
        this.dy = event.clientY - top;
        this.currentElement.classList.add('dragged');
        document.documentElement.addEventListener('mouseup', this.onMouseUp);
        document.documentElement.addEventListener('mousemove', this.onMouseMove);
        document.documentElement.classList.add('cursor-grab');
      }
    });
  }

  onMouseUp() {
    this.currentElement.classList.remove('dragged');

    if (this.shiftElem) {
      if (this.shiftElem.classList.contains('move-up')) {
        this.shiftElem.before(this.currentElement);
      } else {
        this.shiftElem.after(this.currentElement);
      }

      this.shiftElem.classList.remove('move-down', 'move-up');
    }

    this.currentElement = undefined;
    this.shiftElem = undefined;
    this.dx = undefined;
    this.dy = undefined;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mousemove', this.onMouseMove);
    document.documentElement.classList.remove('cursor-grab');
  }

  onMouseMove(event) {
    const onMouseElem = event.target.closest('.task');

    this.currentElement.style.top = `${event.clientY - this.dy}px`;
    this.currentElement.style.left = `${event.clientX - this.dx}px`;

    if (onMouseElem) {
      const { top, height } = onMouseElem.getBoundingClientRect();
      const midle = top + height / 2;

      // && onMouseElem != this.shiftElem
      if (this.shiftElem) {
        this.shiftElem.classList.remove('move-down', 'move-up');
      }
      this.shiftElem = onMouseElem;
      if (event.clientY >= midle) {
        onMouseElem.classList.add('move-down');
      } else {
        onMouseElem.classList.add('move-up');
      }
    }
  }
}
