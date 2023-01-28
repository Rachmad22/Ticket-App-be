require('dotenv').config()
const Redis = require('ioredis')

const connect = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
})

const useRedis = async (req, res, next) => {
  try {
    const isPaginate = await connect.get('is_paginate')
    const data = await connect.get('data')
    const total = await connect.get('total')
    const limit = await connect.get('limit')
    const page = await connect.get('page')
    const url = await connect.get('url')
    const all_pagination = await connect.get('all_pagination')
    const urlMatch = url === req.originalUrl

    if (urlMatch && data) {
      if (isPaginate) {
        res.status(200).json({
          redis: true,
          status: true,
          message: 'Retrieved successfully',
          all_pagination: Number(all_pagination),
          total: Number(total),
          page: Number(page),
          limit: Number(limit),
          data: JSON.parse(data)
        })
      } else {
        res.status(200).json({
          redis: true,
          status: true,
          message: 'Retrieved successfully',
          data: JSON.parse(data)
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { useRedis, connect }
