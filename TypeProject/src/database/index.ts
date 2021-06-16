import { createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
    host: string;
}

getConnectionOptions().then((options) => {
    const newOptions = options as IOptions;
    newOptions.host = "database";
    console.log("ARQUIVO DATABASE");
    createConnection({
        ...options,
    });
});
