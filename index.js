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

    if (description) {
        console.log('Please provide a task description')
        return
    }

    const tasks = load
    
}

function handleUpdate(args) {}

function handleDelete(args) {}

function handleChangeStatus(id, status) {}

function handleList(args) {}

main()