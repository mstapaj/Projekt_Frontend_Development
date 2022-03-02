DROP TABLE IF EXISTS director;
DROP TABLE IF EXISTS actors;
DROP TABLE IF EXISTS movie;


CREATE TABLE IF NOT EXISTS person (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  birth_date DATE NOT NULL,
  nationality: VARCHAR(60) NOT NULL 
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


