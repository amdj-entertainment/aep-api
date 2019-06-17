import '@babel/polyfill'
import express from 'express'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import chalk from 'chalk'
import passport from 'passport'
import config from './config'
import api from './routes'
import './config/mongo.db'

require('./config/passport')

const server = express()

if (config.get('env') === 'development') {
  server.use(morgan('dev'))
}
server.use(compression())
server.use(helmet())
server.use(json())
server.use(urlencoded({ extended: false }))
server.use(cookieParser())
server.use(passport.initialize())

server.use('/v1', api)

server.get('/', (req, res) => res.json({ sucess: true }))

try {
  console.info(chalk.blue('Starting API Server'))
  server
    .listen(config.get('API_PORT'), config.get('API_HOST'), () => {
      console.info(chalk.green('API Server Started'))
    })
    .on('error', (err) => {
      console.error(chalk.red('Error Starting API'), err)
    })
    .on('close', () => console.info(chalk.blue('API Offline')))
} catch (err) {
  console.error(chalk.red('Error Starting API Server'), err)
}

module.exports = server
