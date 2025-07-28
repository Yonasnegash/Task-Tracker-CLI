const fs = require('fs')
const path = require('path')

const TASK_FILE = path.join(__dirname, 'tasks.json')

// Ensure tasks.json file exist
const ensureTaskFile = () => {
    if (!fs.existsSync(TASK_FILE)) {
        fs.writeFileSync(TASK_FILE, JSON.stringify([]))
    }
}

// Load tasks from tasks.json
const loadTasks = () => {
    ensureTaskFile()
    const data = fs.readFileSync(TASK_FILE, 'utf8')
    return JSON.parse(data)
}

// Save tasks to tasks.json
const saveTasks = (tasks) => {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks))
}

function main() {
    const args = process.argv.slice(2)
    const command = args[0]

    switch(command) {
        case 'add':
            return handleAdd(args.slice(1))
        case 'update':
            return handleUpdate(args.slice(1))
        case 'delete':
            return handleDelete(args.slice(1))
        case 'mark-in-progress':
            return handleChangeStatus(args.slice(1), 'in-progress')
        case 'mark-done':
            return handleChangeStatus(args.slice(1), 'done')
        case 'list':
            return handleList(args[1])
        default:
            console.log('Uknown command')
    }
}

function handleAdd(args) {
    const description = args.join(' ').trim()

    if (!description) {
        console.log('Please provide a task description')
        return
    }

    const tasks = loadTasks()

    // Generate new ID
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1
    const now = new Date().toISOString()

    const newTask = {
        id: newId,
        description,
        status: 'todo',
        createdAt: now,
        updatedAt: now
    }

    tasks.push(newTask)
    saveTasks(tasks)
    console.log(`Task added successfully (ID: ${newId})`)
}

function handleUpdate(args) {
    const [idStr, ...rest] = args
    const description = rest.join(' ').trim()
    const id = parseInt(idStr)

    if (isNaN(id) || !description) {
        console.log('Error: Usage: update <id> <new description>')
        return
    }

    const tasks = loadTasks()
    const task = tasks.find(t => t.id === id)

    if (!task) {
        console.log(`Task with ID ${id} not found`)
    }

    task.description = description
    task.updatedAt = new Date().toISOString()

    saveTasks(tasks)
    console.log(`Task with ID ${id} updated successfully`)
}

function handleDelete(args) {
    const id = parseInt(args[0])

    if (isNaN(id)) {
        console.log('Error: Usage: delete <id>')
        return
    }

    const tasks = loadTasks()
    const index = tasks.findIndex(t => t.id === id)

    if (index === -1) {
        console.log(`Task with ID ${id} not found`)
        return
    }

    tasks.splice(index, 1)
    saveTasks(tasks)
    console.log(`Task with ID ${id} deleted successfully`)
}

function handleChangeStatus(id, status) {
    const tasks = loadTasks()
    const task = tasks.find(t => t.id === parseInt(id))

    if (!task) {
        console.log(`Task with ID ${id} not found`)
        return
    }

    task.status = status
    task.updatedAt = new Date().toISOString()
    saveTasks(tasks)
    console.log(`Task with ID ${id} marked as ${status} successfully`)
}

function handleList(status) {
    const tasks = loadTasks()

    let filterTasks = tasks
    
    if (status) {
        const validateStatus = ['todo', 'in-progress', 'done']
        if (!validateStatus.includes(status) ) {
            console.log('Invalid status. Use: todo, in-progress, or done')
            return
        }
        filterTasks = tasks.filter(task => task.status === status)
    }

    if (filterTasks.length === 0) {
        console.log('No tasks found')
        return
    }

    console.log(`\n Listing ${status || 'all'} tasks:\n`);

    filterTasks.forEach(task => {
        console.log(`#${task.id} [${task.status.toUpperCase()}] - ${task.description}`);
        console.log(`   Created: ${task.createdAt}`);
        console.log(`   Updated: ${task.updatedAt}\n`);
    })
}

main()