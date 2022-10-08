const newListForm = document.querySelector('[data-new-list-form]')
const listsContainer = document.querySelector('[data-lists]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteToggle = document.querySelector("#deleteToggle")

const listDisplayCountainer = document.querySelector('[data-list-display-container]')
const listTitle = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById("task-template")
const newTaskForm = document.querySelector("[data-new-task-form]")
const newTaskInput = document.querySelector("[data-new-task-input]")
const clearButton = document.querySelector("[data-clear-completed-tasks]")


const LOCAL_STORAGE_LIST_KEY = "task.lists"
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

const LOCAL_STORAGE_LIST_ID_KEY = "task.selectedListId"
let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY)

listsContainer.addEventListener("click", e=>{
    //select list
    if(e.target.tagName.toLowerCase() === "li"){
        selectedListId = e.target.dataset.listId //takes id from previously assigned dataset.listId
        saveAndRender()
    }

    //delete list
    if(e.target.tagName.toLowerCase() === "li" && deleteToggle.checked){
        let deleteListId = e.target.dataset.listId
        
        let counter = 0;
        lists.forEach(list =>{
            if(list.id === deleteListId){
                lists.splice(counter,1)
                counter = 0 
            } else{
                counter++
            }
        })
        saveAndRender()
        deleteListId = null
        deleteToggle.checked = false
    }
})

clearButton.addEventListener('click', e=>{
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete) //filter creates a new array with incomplete tasks
    saveAndRender()
})

tasksContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "input"){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask =  selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value
    if(listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    selectedListId = list.id
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createList(name){
    return {id: Date.now().toString(), name, tasks: []}
}

function createTask(name){
    return {id: Date.now().toString(), name, complete: false}
}

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId)
}

function render(){
    clearElement(listsContainer)
    renderLists()
    
    const selectedList = lists.find(list => list.id === selectedListId) //finds list with current id
    listTitle.innerText = selectedList.name
    renderTaskCount(selectedList)

    clearElement(tasksContainer)
    renderTasks(selectedList)
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector("input")
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector("label")
        label.htmlFor = task.id
        label.append(task.name)

        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList){
    const incompleteTasks = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasks === 1 ? "task" : "tasks"
    listCount.innerText = `${incompleteTasks} ${taskString} remaining`
    
}

function renderLists(){
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id //there are two id's: id in object and id in dataset, they are the same
        listElement.classList.add("task")
        listElement.innerText = list.name

        if (list.id === selectedListId){ listElement.classList.add("active")}

        listsContainer.appendChild(listElement);
    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

render();