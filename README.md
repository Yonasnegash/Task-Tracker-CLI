# 🧾 task-cli — Interactive Task Manager in Node.js

`task-cli` is a simple and interactive command-line tool to manage your to-do tasks using plain JSON storage. Easily add, update, delete, and mark tasks with statuses like `todo`, `in-progress`, or `done`.

## 🚀 Features

- Add, update, and delete tasks
- Mark tasks as `in-progress` or `done`
- List tasks by status or all
- Simple JSON-based persistence
- Interactive shell with continuous input until `exit`

## 📦 Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/yourusername/task-cli.git
   cd task-cli
   ```

2. **Start the CLI:**

   ```bash
   node index.js
   ```

## 🛠️ Usage

After starting the CLI with node index.ts, you can use the following commands interactively:

### Adding a new task

   ```bash
   add "Buy groceries"
   # Output: Task added successfully (ID: 1)
   ```

### Updating a task

   ```bash
   update <id> "Buy groceries and cook dinner"
   ```

### Deleting a task

   ```bash
   delete <id>
   ```

### Marking a task as in-progress

   ```bash
   mark-in-progress <id>
   ```

### Marking a task done

   ```bash
   mark-done <id>
   ```

### Listing all tasks

   ```bash
   list
   ```

### Listing tasks by status

   ```bash
   list <status>
   ```

### Getting help on the commands

   ```bash
   help
   ```

### Exit CLI

   ```bash
   exit
   ```

## Data Storage

All tasks are stored in a local file called tasks.json. Structure example:

    ```json
    {
        id: 1,
        description: "Buy groceries",
        status: "todo",
        createdAt: "2025-07-28T12:34:56.000Z",
        updatedAt: "2025-07-28T12:34:56.000Z"
    }
    ```

### License
MIT License — free to use and modify.