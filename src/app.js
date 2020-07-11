  const express = require("express");
  const cors = require("cors");

  const { uuid, isUuid } = require("uuidv4");

  const app = express();

  app.use(express.json());
  app.use(cors());

  let repositories = [];

  app.get("/repositories", (request, response) => {
    return response.json(repositories);
  });

  app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    };

    repositories.push(repository);
    return response.json(repository);
  });

  app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid project ID.'});
    }
    const repositoryIndex = repositories.findIndex(rep => rep.id = id);

    repositories[repositoryIndex].title = title;
    repositories[repositoryIndex].url = url;
    repositories[repositoryIndex].techs = techs;

    return response.json(repositories[repositoryIndex]);
  });

  app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid project ID.'});
    }

    const repositoryIndex = repositories.findIndex(rep => rep.id == id);

    if(repositoryIndex < 0){
      return response.status(400).json({ error: 'Repository does not exists.' });
    }
    repositories.splice(repositoryIndex, 1);
    // repositories = undefined;
 
    return response.status(204).send();
  });

  app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(rep => rep.id == id);
    if(repositoryIndex < 0){
      return response.status(400).json({ error: 'Repository not found'});
    }
    repositories[repositoryIndex].likes++;

    return response.json(repositories[repositoryIndex]);
  });

  module.exports = app;
