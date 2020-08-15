DROP DATABASE IF EXISTS cineman;
CREATE DATABASE cineman;
USE cineman;

DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
    imdbID      VARCHAR(9),
    title       VARCHAR(32) NOT NULL,
    `year`      YEAR        NOT NULL,
    first_sug   BIGINT,
    recent_sug  BIGINT,
    recent_date DATE        DEFAULT CURRENT_TIMESTAMP,
    `weight`    INT         DEFAULT 0,
    PRIMARY KEY(imdbid)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    discordID   BIGINT,
    `name`      VARCHAR(32) NOT NULL,
    list        JSON,
    PRIMARY KEY(discordID)
);