const express = require('express')
require('express-async-errors')
const app = express()
const att = require('att')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const healthCheckRouter = require('./controllers/health-check')
const middleware = require('./utils/middleware')
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to Database')
  })
  .catch((err) => {
    logger.error('Error connecting to database', err.message)
  })
app.use(att())
app.use(express.static('./client/build'))
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/health', healthCheckRouter)
if (process.env.NODE_ENV === 'test') 
{
  const routerTest = require('./controllers/testing')
  app.use('/api/testing', routerTest)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
