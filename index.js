const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?nome=NodeJS
// Route Params = /curso/2
// Request Body = { nome: 'Nodejs', tipo: 'back-end' }

// CRUD => Create, Read, Update, Delete

const cursos = ["Node JS", "JavaScript", "React Native", "TypeScript"];

// Middleware global
server.use((req, res, next) => {
  console.log(`URL chamada: ${req.url}`);

  return next();
});

function checkCurso(req, res, next) {
  if (!req.body.name)
    return res.status(400).json({ error: "Nome do curso é obrigatório!" });

  return next();
}

function checkIndexCurso(req, res, next) {
  const curso = cursos[req.params.index];

  if (!curso)
    return res.status(400).json({ error: "O curso não existe!" });

  req.curso = curso;

  return next();
}

server.get('/cursos', checkIndexCurso, (req, res) => {
  return res.json(cursos);
});

// localhost:3000/curso/2
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
  // const nome = req.query.nome;
  // return res.json({curso: `Aprendendo ${nome}`});

  // const id = req.params.id;
  // return res.json({curso: `Curso: ${id}`});

  // const { index } = req.params;
  return res.json(req.curso);
});

// Criando um novo curso
server.post('/cursos', checkCurso, (req, res) => {
  const { name } = req.body;
  cursos.push(name);

  return res.json(cursos);
});

// Atualizando um curso
server.put("/cursos/:index", checkCurso, checkIndexCurso, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  cursos[index] = name;

  return res.json(cursos);
});

// Excluindo algum curso
server.delete("/cursos/:index", checkIndexCurso, (req, res) => {
  const { index } = req.params;

  cursos.splice(index, 1);
  // return res.json({message: "Curso deletado com sucesso!"});
  return res.send();
});

server.listen(3000);