import { app, server } from "./app.js";
import { connectDB } from "./db/database.js";

import dotenv from 'dotenv';
dotenv.config();



connectDB()
    .then(() => {
        const PORT = process.env.PORT;
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });