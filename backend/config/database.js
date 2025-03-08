import { Sequelize } from "sequelize";

const db = new Sequelize("notes_051", "root", "febrian123", {
    host: "35.226.25.88",
    dialect: "mysql",
});

export default db;