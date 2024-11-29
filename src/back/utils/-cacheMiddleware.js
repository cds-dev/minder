// turned off

const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 60 * 5 }) // Cache TTL set to 5 minutes

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url
  const cachedData = cache.get(key)
  if (cachedData) {
    console.warn('Cache hit for', key)
    res.json(cachedData)
  } else {
    console.error('Cache miss for', key)
    res.sendResponse = res.json
    res.json = (body) => {
      cache.set(key, body)
      res.sendResponse(body)
    }
    next()
  }
}

module.exports = cacheMiddleware