const db = require('../db');

// AVAILABLE MOVIE

// Create
const createAvailableMovie = async (params) => {
  const { photo, name, genre, directed_by, duration, casts, synopsis, slug } = params

  return await db`INSERT INTO available_movies (photo, name, genre, directed_by, duration, casts, synopsis, slug) VALUES (${photo}, ${name}, ${genre}, ${directed_by}, ${duration}, ${casts}, ${synopsis}, ${slug})`
}

// Read
const getAvailableMovieByName = async (params) => {
  const { name } = params

  return await db`SELECT * FROM available_movies WHERE name = ${name}`
}

const getAllAvailableMovies = async () => {
  return await db`SELECT * FROM available_movies`
}

const getAvailableMovieById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM available_movies WHERE id = ${id}`
}

const getCountAvailableMovie = async () => {
  return await db`SELECT COUNT(id) FROM available_movies`
}

const getAvailableMovieNameAsc = async () => {
  return await db`SELECT * FROM available_movies ORDER BY name ASC`
}

const getAvailableMovieNameDesc = async () => {
  return await db`SELECT * FROM available_movies ORDER BY name DESC`
}

const getAvailableMovieReleaseAsc = async () => {
  return await db`SELECT * FROM available_movies ORDER BY release_date ASC`
}

const getAvailableMovieReleaseDesc = async () => {
  return await db`SELECT * FROM available_movies ORDER BY release_date DESC`
}

const getAvailableMoviePagin = async (params) => {
  const { page, limit } = params

  return await db`SELECT * FROM available_movies LIMIT ${limit} OFFSET ${
      limit * (page - 1)
   }`
}

const getSearchMovie = async (params) => {
  const { title } = params

  return await db`SELECT * FROM available_movies WHERE title ILIKE ${'%' + title + '%'}`
}

const getSearchMovieAsc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM available_movies WHERE title ILIKE ${'%' + title + '%'} ORDER BY title ASC`
}

const getSearchMovieDesc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM available_movies WHERE title ILIKE ${'%' + title + '%'} ORDER BY title DESC`
}

const deleteAvailableMovie = async (params) => {
  const {id} = params

  return await db`DELETE FROM "public"."available_movies" WHERE "id" = ${id}`
}

// UPCOMING MOVIE

// Create
const createUpcomingMovie = async (params) => {
  const { photo, name, genre, release_date, directed_by, duration, casts, synopsis } = params

  return await db`INSERT INTO upcoming_movies (photo, name, genre, release_date, directed_by, duration, casts, synopsis) VALUES (${photo}, ${name}, ${genre}, ${release_date}, ${directed_by}, ${duration}, ${casts}, ${synopsis})`
}

// Read
const getUpcomingMovieByName = async (params) => {
  const { name } = params

  return await db`SELECT * FROM upcoming_movies WHERE name = ${name}`
}

const getAllUpcomingMovies = async () => {
  return await db`SELECT * FROM upcoming_movies`
}

const getUpcomingMovieById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM upcoming_movies WHERE id = ${id}`
}

const getCountUpcomingMovie = async () => {
  return await db`SELECT COUNT(id) FROM upcoming_movies`
}

const getUpcomingMovieNameAsc = async () => {
  return await db`SELECT * FROM upcoming_movies ORDER BY name ASC`
}

const getUpcomingMovieNameDesc = async () => {
  return await db`SELECT * FROM upcoming_movies ORDER BY name DESC`
}

const getUpcomingMovieReleaseAsc = async () => {
  return await db`SELECT * FROM upcoming_movies ORDER BY release_date ASC`
}

const getUpcomingMovieReleaseDesc = async () => {
  return await db`SELECT * FROM upcoming_movies ORDER BY release_date DESC`
}

const getUpcomingMoviePagin = async (params) => {
  const { page, limit } = params

  return await db`SELECT * FROM upcoming_movies LIMIT ${limit} OFFSET ${
      limit * (page - 1)
   }`
}

module.exports = {
  createAvailableMovie,
  getAvailableMovieByName,
  getAllAvailableMovies,
  getAvailableMovieById,
  getCountAvailableMovie,
  getAvailableMovieNameAsc,
  getAvailableMovieNameDesc,
  getAvailableMovieReleaseAsc,
  getAvailableMovieReleaseDesc,
  getAvailableMoviePagin,
  getSearchMovie,
  getSearchMovieAsc,
  getSearchMovieDesc,
  deleteAvailableMovie,
  createUpcomingMovie,
  getUpcomingMovieByName,
  getAllUpcomingMovies,
  getUpcomingMovieById,
  getCountUpcomingMovie,
  getUpcomingMovieNameAsc,
  getUpcomingMovieNameDesc,
  getUpcomingMovieReleaseAsc,
  getUpcomingMovieReleaseDesc,
  getUpcomingMoviePagin
}