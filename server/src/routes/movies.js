const express = require("express");
const client = require("../config/psqlClient");
const router = express.Router({ mergeParams: true });

const messages = {
  TITLE_DUPLICATE: "TITLE_DUPLICATE",
  DIRECTOR_NOT_EXISTS: "DIRECTOR_NOT_EXISTS",
  ELEMENT_NOT_EXIST: "ELEMENT_NOT_EXIST",
};

router.get("/", async (req, res) => {
  const movies = await client.query("SELECT * FROM movie");
  return res.send(movies.rows);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const movieRows = await client.query("SELECT * FROM movie WHERE id = $1", [
    id,
  ]);

  const movie = movieRows.rows[0];

  if (!movie) {
    return res.status(500).send(messages.ELEMENT_NOT_EXIST);
  }

  return res.send(movie);
});

router.post("/", async (req, res) => {
  const movieToAdd = req.body;
  const duplicate = await client.query("SELECT * FROM movie WHERE title = $1", [
    movieToAdd.title,
  ]);

  if (duplicate.rows[0]) {
    return res.status(500).send(messages.TITLE_DUPLICATE);
  }

  if (movieToAdd.director) {
    const director = await client.query("SELECT * FROM person WHERE id = $1", [
      movieToAdd.director.id,
    ]);

    if (!director.rows[0]) {
      return res.status(500).send(messages.DIRECTOR_NOT_EXISTS);
    }
  }

  const insertedMovieRows = await client.query(
    "INSERT INTO movie (title, genre, release_date, description, image_url, director_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      movieToAdd.title,
      movieToAdd.genre,
      movieToAdd.release_date,
      movieToAdd.description,
      movieToAdd.image_url,
      movieToAdd.director ? movieToAdd.director.id : null,
    ]
  );

  const insertedMovie = insertedMovieRows.rows[0];
  return res.send(insertedMovie);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const response = await client.query("DELETE from movie WHERE id = $1", [id]);

  return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

router.put("/:id", async (req, res) => {
  const movieToAdd = req.body;
  const id = req.params.id;

  if (movieToAdd.director) {
    const director = await client.query("SELECT * FROM person WHERE id = $1", [
      movieToAdd.director.id,
    ]);

    if (!director.rows[0]) {
      return res.status(500).send(messages.DIRECTOR_NOT_EXISTS);
    }
  }

  const result = await client.query(
    `UPDATE movie SET title = $1, genre = $2, release_date = $3, description = $4, image_url = $5, director_id = $6 WHERE id = $7`,
    [
      movieToAdd.title,
      movieToAdd.genre,
      movieToAdd.release_date,
      movieToAdd.description,
      movieToAdd.image_url,
      movieToAdd.director ? movieToAdd.director.id : null,
      id,
    ]
  );

  return result.rowCount > 0 ? res.send(movieToAdd) : res.sendStatus(400);
});

router.patch("/:id/director", async (req, res) => {
  const directorToSet = req.body;
  const id = req.params.id;
  if (directorToSet && Object.keys(directorToSet).length !== 0) {
    const director = await client.query("SELECT * FROM person WHERE id = $1", [
      directorToSet.id,
    ]);

    if (!director.rows[0]) {
      return res.status(500).send(messages.DIRECTOR_NOT_EXISTS);
    }
  }

  const result = await client.query(
    `UPDATE movie SET director_id = $1 WHERE id = $2`,
    [
      directorToSet && Object.keys(directorToSet).length !== 0
        ? directorToSet.id
        : null,
      id,
    ]
  );

  return result.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

router.get("/:id/actors", async (req, res) => {
  const id = req.params.id;
  const actors = await client.query("SELECT * FROM actor WHERE movie_id = $1", [
    id,
  ]);
  return res.send(actors.rows);
});

router.post("/:id/actors", async (req, res) => {
  const person = req.body;
  const id = req.params.id;

  const existingPerson = await client.query(
    "SELECT * FROM person WHERE id = $1",
    [person.id]
  );

  if (!existingPerson.rows[0]) {
    return res.status(500).send(messages.ELEMENT_NOT_EXIST);
  }

  const result = await client.query(
    `INSERT INTO actor (movie_id, person_id) VALUES ($1, $2) RETURNING *`,
    [id, person.id]
  );

  return result.rowCount > 0 ? res.send(result.rows[0]) : res.sendStatus(400);
});

router.delete("/:id/actors/:idPerson", async (req, res) => {
  const { id, idPerson } = req.params;

  const result = await client.query(
    `DELETE FROM actor WHERE movie_id = $1 AND person_id = $2`,
    [id, idPerson]
  );

  return result.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400);
});

module.exports = router;
