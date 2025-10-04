// server.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
const __dirname = process.cwd();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/adm", express.static("adm"));

// Banco de dados
const db = await open({
  filename: "database.sqlite",
  driver: sqlite3.Database
});

// Criação da tabela
await db.exec(`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    telefone TEXT,
    data TEXT,
    horario TEXT,
    corte TEXT,
    status TEXT DEFAULT 'Pendente'
  )
`);

// Criar agendamento
app.post("/agendar", async (req, res) => {
  const { nome, telefone, data, horario, corte } = req.body;
  await db.run(
    "INSERT INTO agendamentos (nome, telefone, data, horario, corte) VALUES (?, ?, ?, ?, ?)",
    [nome, telefone, data, horario, corte]
  );
  res.send("Agendamento realizado com sucesso!");
});

// Listar agendamentos
app.get("/api/agendamentos", async (req, res) => {
  const agendamentos = await db.all("SELECT * FROM agendamentos");
  res.json(agendamentos);
});

// Concluir agendamento
app.post("/api/concluir/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("UPDATE agendamentos SET status = 'Concluído' WHERE id = ?", id);
  res.send("Agendamento concluído!");
});

// Finalizar agendamento
app.post("/api/finalizar/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("UPDATE agendamentos SET status = 'Finalizado' WHERE id = ?", id);
  res.send("Agendamento finalizado!");
});

// Apagar agendamento
app.delete("/api/apagar/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM agendamentos WHERE id = ?", id);
  res.send("Agendamento apagado!");
});

// Login
const USER = "admin";
const PASS = "1234";

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === USER && senha === PASS) {
    res.json({ sucesso: true });
  } else {
    res.json({ sucesso: false });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
