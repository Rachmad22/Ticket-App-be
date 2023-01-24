const movie = require('../models/movie')
const { cloudinary } = require('../helper')
const { v4: uuidv4 } = require('uuid')
const { connect } = require('../middlewares/redis')

// AVAILABLE MOVIE

// Create
const createAvailableMovie = async (req, res) => {
  try {
    const {
      name,
      genre,
      directed_by,
      duration,
      casts,
      synopsis,
      slug
    } = req.body

    // Check movie, whether already or not
    const checkMovie = await movie.getAvailableMovieByName({ name })

    if (checkMovie.length >= 1) {
      throw { code: 401, message: 'Movies already exist' }
    }

    // Check if slug is used
    const checkSlug = await movie.getAvailableMovieBySlug({ slug })

    if (checkSlug.length >= 1) {
      throw { code: 401, message: 'Slug is already in use, please enter another slug' }
    }

    const file = req.files.photo

    const mimeType = file.mimetype.split('/')[1]

    const allowedFile = ['jpg', 'png', 'jpeg', 'webp']

    if (allowedFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            throw 'Photo upload failed'
          }

          const addToDb = await movie.createAvailableMovie({
            photo: result.url,
            name,
            genre,
            directed_by,
            duration,
            casts,
            synopsis,
            slug
          })

          res.json({
            status: true,
            message: 'Movie added successful',
            data: addToDb
          })
        }
      )
    } else {
      throw { code: 401, message: 'Upload failed, only photo format input' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Read
const getAvailableMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { sort, page, limit } = req.query

    let getAllMovie
    const getCountMovie = await movie.getCountAvailableMovie()

    if (sort === 'name_asc') {
      getAllMovie = await movie.getAvailableMovieNameAsc()
    } else if (sort === 'name_desc') {
      getAllMovie = await movie.getAvailableMovieNameDesc()
    } else if (sort === 'release_asc') {
      getAllMovie = await movie.getAvailableMovieReleaseAsc()
    } else if (sort === 'release_desc') {
      getAllMovie = await movie.getAvailableMovieReleaseDesc()
    } else if (page && limit) {
      getAllMovie = await movie.getAvailableMoviePagin({ page, limit })
    } else {
      getAllMovie = await movie.getAllAvailableMovies()
    }

    connect.set('url', req.originalUrl, 'ex', 10)
    connect.set('data', JSON.stringify(getAllMovie), 'ex', 10)
    connect.set('total', getAllMovie?.length, 'ex', 10)
    connect.set('limit', limit, 'ex', 10)
    connect.set('page', page, 'ex', 10)
    connect.set('is_paginate', 'true', 'ex', 10)

    if (id) {
      const getSelectedMovie = await movie.getAvailableMovieById({ id })

      if (getSelectedMovie.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedMovie
        })
      } else {
        throw { code: 401, message: 'Data is empty, please try again' }
      }
    } else {
      if (getAllMovie.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successful',
          all_pagination: Number(getCountMovie[0]?.count),
          page: Number(page),
          limit: Number(limit),
          data: getAllMovie
        })
      } else {
        throw { code: 401, message: 'Data is empty, please try again' }
      }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const getSearchedMovie = async (req, res) => {
  try {
    const { name } = req.params

    const getSearchMovie = await movie.getSearchMovie({ name })

    if (getSearchMovie.length > 0) {
      res.status(200).json({
        status: true,
        message: 'Retrieved successful',
        total: getSearchMovie.length,
        data: getSearchMovie
      })
    } else {
      throw { code: 401, message: 'Data is empty, please try again' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Update
const editAvailableMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { name, genre, directed_by, duration, casts, synopsis, slug } = req.body

    // Check movie, whether already or not
    if (name) {
      const checkName = await movie.getAvailableMovieByName({ name })
    }

    const file = req.files.photo

    const mimeType = file.mimetype.split('/')[1]

    const allowedFile = ['jpg', 'png', 'jpeg', 'webp']

    if (allowedFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            throw 'Photo upload failed'
          }

          const getUser = await movie.getAvailableMovieById({ id })

          const addToDbPhoto = await movie.editAvailableMoviePhoto({
            id,
            photo: result.url,
            name,
            genre,
            directed_by,
            duration,
            casts,
            synopsis,
            slug,
            getUser
          })

          res.json({
            status: true,
            message: 'User edited successful',
            data: addToDbPhoto
          })
        }
      )
    } else {
      throw { code: 401, message: 'Upload failed, only photo format input' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Delete
const deleteAvailableMovie = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await movie.getAvailableMovieById({ id })

    if (checkId.length === 0) {
      throw { code: 401, message: 'Data is empty, please try again' }
    }

    await movie.deleteAvailableMovie({ id })

    res.json({
      status: true,
      message: 'Movie deleted successful'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// UPCOMING MOVIE

// Create
const createUpcomingMovie = async (req, res) => {
  try {
    const {
      name,
      genre,
      directed_by,
      duration,
      casts,
      synopsis,
      slug
    } = req.body

    const checkMovie = await movie.getUpcomingMovieByName({ name })

    if (checkMovie.length >= 1) {
      throw { code: 401, message: 'Movies already exist' }
    }

    // Check if slug is used
    const checkSlug = await movie.getUpcomingMovieBySlug({ slug })

    if (checkSlug.length >= 1) {
      throw { code: 401, message: 'Slug is already in use, please enter another slug' }
    }

    const file = req.files.photo

    const mimeType = file.mimetype.split('/')[1]

    const allowedFile = ['jpg', 'png', 'jpeg', 'webp']

    if (allowedFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            throw 'Photo upload failed'
          }

          const addToDb = await movie.createUpcomingMovie({
            photo: result.url,
            name,
            genre,
            directed_by,
            duration,
            casts,
            synopsis,
            slug
          })

          res.json({
            status: true,
            message: 'Movie added successful',
            data: addToDb
          })
        }
      )
    } else {
      throw { code: 401, message: 'Upload failed, only photo format input' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Read
const getUpcomingMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { sort, page, limit } = req.query

    let getAllMovie
    const getCountMovie = await movie.getCountUpcomingMovie()

    if (sort === 'name_asc') {
      getAllMovie = await movie.getUpcomingMovieNameAsc()
    } else if (sort === 'name_desc') {
      getAllMovie = await movie.getUpcomingMovieNameDesc()
    } else if (sort === 'release_asc') {
      getAllMovie = await movie.getUpcomingMovieReleaseAsc()
    } else if (sort === 'release_desc') {
      getAllMovie = await movie.getUpcomingMovieReleaseDesc()
    } else if (page && limit) {
      getAllMovie = await movie.getUpcomingMoviePagin({ page, limit })
    } else {
      getAllMovie = await movie.getAllUpcomingMovies()
    }

    connect.set('url', req.originalUrl, 'ex', 10)
    connect.set('data', JSON.stringify(getAllMovie), 'ex', 10)
    connect.set('total', getAllMovie?.length, 'ex', 10)
    connect.set('limit', limit, 'ex', 10)
    connect.set('page', page, 'ex', 10)
    connect.set('is_paginate', 'true', 'ex', 10)

    if (id) {
      const getSelectedMovie = await movie.getUpcomingMovieById({ id })

      if (getSelectedMovie.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedMovie
        })
      } else {
        throw { code: 401, message: 'Data is empty, please try again' }
      }
    } else {
      if (getAllMovie.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successful',
          all_pagination: Number(getCountMovie[0]?.count),
          page: Number(page),
          limit: Number(limit),
          data: getAllMovie
        })
      } else {
        throw { code: 401, message: 'Data is empty, please try again' }
      }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Update
const editUpcomingMovie = async (req, res) => {
  try {
    const { id } = req.params
    const { name, genre, directed_by, duration, casts, synopsis, slug } = req.body

    // Check movie, whether already or not
    if (name) {
      const checkName = await movie.getUpcomingMovieByName({ name })
    }

    const file = req.files.photo

    const mimeType = file.mimetype.split('/')[1]

    const allowedFile = ['jpg', 'png', 'jpeg', 'webp']

    if (allowedFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            throw 'Photo upload failed'
          }

          const getUser = await movie.getUpcomingMovieById({ id })

          const addToDbPhoto = await movie.editUpcomingMoviePhoto({
            id,
            photo: result.url,
            name,
            genre,
            directed_by,
            duration,
            casts,
            synopsis,
            slug,
            getUser
          })

          res.json({
            status: true,
            message: 'User edited successful',
            data: addToDbPhoto
          })
        }
      )
    } else {
      throw { code: 401, message: 'Upload failed, only photo format input' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Delete
const deleteUpcomingMovie = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await movie.getUpcomingMovieById({ id })

    if (checkId.length === 0) {
      throw { code: 401, message: 'Data is empty, please try again' }
    }

    await movie.deleteUpcomingMovie({ id })

    res.json({
      status: true,
      message: 'Movie deleted successful'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = {
  createAvailableMovie,
  getAvailableMovie,
  getSearchedMovie,
  editAvailableMovie,
  deleteAvailableMovie,
  createUpcomingMovie,
  getUpcomingMovie,
  editUpcomingMovie,
  deleteUpcomingMovie
}
