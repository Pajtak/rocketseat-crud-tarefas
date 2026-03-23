import http from "node:http";
import {randomUUID} from "crypto";

import {Database} from "../database/database.js";
import {buildRoutePath} from "../utils/build-route-path.js";

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select("tasks",  search ? {
                title: search,
                description: search
            } : null);
            return res
                .writeHead(200, {"Content-Type": "application/json"})
                .end(JSON.stringify(tasks));
        }
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const {id} = req.params
            const task = database.selectByID("tasks", id);

            return res.end(JSON.stringify(task));
        }
    },

    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const {title, description} = req.body

            if(!title || !description) {
                return res
                    .writeHead(400, {"Content-Type": "application/json"})
                    .end(JSON.stringify({message: "Title e description são obrigatórios"}))
            }
            const newTask = {
                id: randomUUID(),
                title,
                description,
                isComplete: false,
                completed_at: null,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
            }

            database.insert("tasks", newTask)
            return res.end(`Tarefa criado com nome: ${title} e descrição: ${description}`)
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body
            const task = database.selectByID("tasks", id);

            if (!task) {
                return res.writeHead(404).end("Task não encontrada")
            }
            database.update("tasks", id, {title, description})
            return res.end(`Task atualizada com sucesso`)
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.selectByID("tasks", id);
            if (!task) {
                return res.writeHead(404).end("Task não encontrada")
            }
            database.delete("tasks", id)
            return res.end(`Task deletada com sucesso`)
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params
            const task = database.selectByID("tasks", id);
            if (!task) {
                return res.writeHead(404).end("Task não encontrada")
            }
            database.complete("tasks", id)
            return res.end(`Task completada com sucesso`)
        }
    }
]