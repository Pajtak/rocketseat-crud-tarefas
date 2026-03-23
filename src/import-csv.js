import fs from "node:fs";
import {parse} from "csv-parse";


const csvPath = new URL("./streams/tasks.csv", import.meta.url);

export async function importTasks() {
    const parser = fs
        .createReadStream(csvPath)
        .pipe(
            parse({
                delimiter: ",",
                from_line: 2,
                skip_empty_lines: true
            })
        )

    for await (const line of parser) {
        const [title, description] = line

        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
            }),
        })
    }
}

importTasks()
    .then(() => {
        console.log("Importação finalizada com sucesso!")
    })
    .catch((err) => {
        console.error("Erro ao importar o csv", err);
    })