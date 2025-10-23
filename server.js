// server.js
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// cria a aplicacao express 
const app = express();
app.use(cors());
app.use(express.json());

// Inicilatliza a coneexao com o banco de dados SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
});

//DEfine o modelo de Usuario
const userModel = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Sincroniza o modelo com o banco de dados
sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

// Rota raiz
app.get("/", (req, res) => {
    res.send(" Ola, bem vindo a minha API Local! Aqui voce pode gerenciar usuarios.");

})

// Rota para obter todos os usuarios
app.get("/users", async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Rota para criar um novo usuario
app.post("/users", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const newUser = await userModel.create({ name });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

//Rota para atualizar un usuario existente
app.put("/users/:idd", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const user = await userModel.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});


// Rota para deleletar um ususario
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Rota 404 para rotas nao encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//Testa a conexao com o banco de dados
async function testDBConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connecting to the database has been esabled successfully.");

    } catch (error) {
        console.error("Unable to connect to the database:", error);

    }
}
testDBConnection(); 