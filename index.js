const fs = require('fs')
const path = require('path')
const readline = require('readline')

const TASK_FILE = path.join(__dirname, 'tasks.json')

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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

const prompt = (question) => {
    return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())))
}

const parseInput = (input) => {
    const matches = input.match(/"[^"]+"|\S+/g) || []
    return matches.map(arg => arg.replace(/^"|"$/g, ''))
}

async function main() {
    while (true) {
        const input = await prompt("task-cli ")
        const args = parseInput(input)
        const command = args[0]

        switch(command) {
            case 'add':
                handleAdd(args.slice(1))
                break
            case 'update':
                handleUpdate(args.slice(1))
                break
            case 'delete':
                handleDelete(args.slice(1))
                break
            case 'mark-in-progress':
                handleChangeStatus(args.slice(1), 'in-progress')
                break
            case 'mark-done':
                handleChangeStatus(args.slice(1), 'done')
                break
            case 'list':
                handleList(args[1])
                break
            case 'help':
                handleHelp()
                break
            case 'exit':
                console.log('Exiting task cli...')
                process.exit(0)
            default:
                console.log('Uknown command')
        }
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

function handleHelp() {
    console.log(`
        task-cli Help

        Available Commands:
        add "task description"         Add a new task
        update <id> "new description"  Update a task by ID
        delete <id>                    Delete a task by ID
        mark-in-progress <id>          Mark task as in-progress
        mark-done <id>                 Mark task as done
        list                           List all tasks
        list <status>                  List tasks by status (todo | in-progress | done)
        help                           Show this help message
        exit                           Exit the CLI
    `);
}


main()