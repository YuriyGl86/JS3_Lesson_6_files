
export default class Trello{
    constructor(container){
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
          } else {
            this.container = container;
          }
        this.currentElement = undefined

        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
    }

    init(){
        this.container.addEventListener('click', this.mouseClickHandler.bind(this));

        [...this.container.querySelectorAll('.add-card')].forEach(addElem => {
            addElem.addEventListener('click', this.addTaskFormHandler.bind(this))
        });

        [...this.container.querySelectorAll('.cancel-adding')].forEach(cancelElem => {
            cancelElem.addEventListener('click', this.cancelTaskAddingHandler.bind(this))
        });

        [...this.container.querySelectorAll('.add-card-button')].forEach(addButton => {
            addButton.addEventListener('click', this.addNewTaskButtonHandler.bind(this))
        })
        
        this.DnDInit()
    }

    mouseClickHandler(event){
        const cross = event.target.closest('.cross')
        if(cross){
            event.target.closest('.task').remove()
        }
    }

    addTaskFormHandler(event){
        const container = event.target.closest('.add-task-container')
        this.toggleNewTaskForm(container)
        container.querySelector('textarea').focus()

    }

    toggleNewTaskForm(container){
        container.querySelector('.new-card').classList.toggle('none')
        container.querySelector('.add-card').classList.toggle('none')
    }

    cancelTaskAddingHandler(event){
        const container = event.target.closest('.add-task-container')
        container.querySelector('textarea').value = ''
        this.toggleNewTaskForm(container) 
    }

    addNewTaskButtonHandler(event){
        const addForm = event.target.closest('.add-task-container')
        const cardsContainer = addForm.closest('.column').querySelector('.cards-container')
        const newTask = document.createElement('div')
        newTask.classList.add('task')
        newTask.innerHTML = `
            <span class="cross">&#10006</span>
            <p></p>
            `
        newTask.querySelector('p').innerText = addForm.querySelector('textarea').value
        cardsContainer.appendChild(newTask)
        addForm.querySelector('textarea').value = ''
        this.toggleNewTaskForm(addForm)
    }

    DnDInit(){
        this.container.addEventListener('mousedown', (event) => {
            event.preventDefault()
            const task = event.target.closest('.task')
            console.log(task)
            if(task){
                this.currentElement = task
                this.currentElement.classList.add('dragged')
                document.documentElement.addEventListener('mouseup', this.onMouseUp)                
                document.documentElement.addEventListener('mouseover', this.onMouseOver)
            }
            
        })
    }

    onMouseUp(event){
        this.currentElement.classList.remove('dragged')
        this.currentElement = undefined
        document.documentElement.removeEventListener('mouseup', this.onMouseUp)
        document.documentElement.removeEventListener('mouseover', this.onMouseOver)

    }

    onMouseOver(event){
        
        console.log(event)
        if(! this.currentElement){return}
        this.currentElement.style.top = event.clientY + 'px'
        this.currentElement.style.left = event.clientX + 'px'
    }
    

}