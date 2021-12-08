import express from 'express'
import http from 'http'
import https from 'https'
import cors from 'cors'
import path from 'path'
import { Game } from './game/game.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = http.createServer(app)

const game = new Game(server);
game.start();
const port = 3000;

app.use(cors())

app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

app.get('/getState', (req, res) => {
  try {
    return res.json({ error: 'nothing here yet' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

server.listen(port, () => {
  console.log('Express is listening on http://localhost:' + port)
})
