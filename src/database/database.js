import fs from "node:fs/promises"
const dataBasePath = new URL('db.json', import.meta.url)
export class Database {
    #database = {}

    constructor() {
        fs.readFile(dataBasePath, 'utf8')
            .then(data => {this.#database = JSON.parse(data)})
            .catch(() => {
                this.#persist()
            })
    }
    #persist() {
        fs.writeFile(dataBasePath, JSON.stringify(this.#database))
    }
    select(table, search) {
        let data = this.#database[table] ?? [];

        if(search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data;
    }
    selectByID(table, id) {
        return this.#database[table]?.find(item => item.id === id) ?? null;

    }
    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data]
        }
        this.#persist()
        return data
    }
    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(item => item.id === id)

        if(rowIndex > -1) {
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                ...data,
                updatedAt: new Date().getTime()
            }
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(item => item.id === id)

        if(rowIndex > -1) {
            this.#database[table]?.splice(rowIndex, 1)
            this.#persist()
        }
    }

    complete(table, id) {
        const rowIndex = this.#database[table].findIndex(item => item.id === id)

        if(rowIndex > -1) {
           const currentTask = this.#database[table][rowIndex];
           const isComplete = !currentTask.isComplete

            this.#database[table][rowIndex] = {
               ...currentTask,
                isComplete,
                completed_at: isComplete ? new Date().getTime() : null,
                updated_at: new Date().getTime()
            }
            this.#persist()
        }
    }
}