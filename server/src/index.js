const express = require('express');
const app = express();
const cors = require('cors');
const client = require('./config/psqlClient');
const movies = require('./routes/movies');
const persons = require('./routes/persons');
const actors = require('./routes/actors');

app.use(express.json());
app.use(cors());
app.use("/api/movies", movies);
app.use("/api/persons", persons);
app.use("/api/actors", actors);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    birth_date DATE NOT NULL,
    nationality VARCHAR(60) NOT NULL 
  );
  
  CREATE TABLE IF NOT EXISTS movie (
    id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE NOT NULL,
    genre VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    description VARCHAR NOT NULL,
    image_url VARCHAR NULL,
    director_id INTEGER NULL, 
    FOREIGN KEY (director_id) REFERENCES person (id)
  );
  
  
  CREATE TABLE IF NOT EXISTS actor (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL, 
    FOREIGN KEY (person_id) REFERENCES person (id),
    FOREIGN KEY (movie_id) REFERENCES movie (id)
  );
  
  
  `);

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
})
.catch(err => console.error('Connection error', err.stack));