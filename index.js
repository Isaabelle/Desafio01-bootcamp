const express = require("express");

const api = express();

api.use(express.json());

let countRequest = 0;
const projectsArray = [];

api.use((req, res, next) => {
  countRequest++;
  console.log(`Método: ${req.method}; Total de requisições: ${countRequest}`);

  next();
});

function projectAlreadyExists(req, res, next) {
  const { id } = req.body;

  const project = projectsArray.find(item => item.id == id);

  if (project) {
    return res.status(400).json({ error: `Project id:${id} already exists` });
  }
  return next();
}

function checkProjectId(req, res, next) {
  const { id } = req.params;

  const project = projectsArray.find(item => item.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project id does not exist" });
  }
  return next();
}

api.post("/projects", projectAlreadyExists, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projectsArray.push(project);

  return res.json(project);
});

api.get("/projects", (req, res) => {
  return res.json(projectsArray);
});

api.put("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectsArray.find(item => item.id == id);

  project.title = title;

  return res.json(projectsArray);
});

api.delete("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;

  const projectIndex = projectsArray.findIndex(item => item.id == id);

  projectsArray.splice(projectIndex, 1);

  return res.send();
});

api.post("/projects/:id/tasks", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectsArray.find(item => item.id == id);

  project.tasks.push(title);

  return res.json(project);
});

api.listen(5000);
