import Telebot from 'telebot'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'

dotenv.config()

const app = express()
app.set('port', process.env.PORT || 5000)
app.get('/', (req, resp) => {
    const result = 'App is running'
    resp.send(result)
}).listen(app.get('port'), () => {
    console.log('App is running, server is listenning on port', app.get('port'))
})

const TOKEN = process.env.TOKEN
const CHAT_ID = process.env.CHAT_ID

const bot = new Telebot({
    token: TOKEN,
    usePlugins: ['askUser']
})

bot.on('text', (msg) => {
    const userId = msg.from.id
    const name = msg.from.first_name
    console.log(`${name}: ${userId}`)
    fs.appendFile('./log.txt', `${name}: ${userId}\n`, 'utf8', (err) => {
        if (err) throw err
    })
})

bot.start()
