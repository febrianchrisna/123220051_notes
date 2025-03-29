import { Sequelize } from "sequelize";

const db = new Sequelize("notes_051", "root", "febrian123", {
    host: "34.44.61.23",
    dialect: "mysql",
});

export default db;