import express from 'express'
import AddCommand from './commands/Add'
import bot from './utils/Bot'
import cron from 'node-cron'
import { RankingsCommand } from './commands/Rankings'

const app = express()
app.set('port', process.env.PORT || 5000)
app.get('/', (req, resp) => {
    const result = 'App is running'
    resp.send(result)
}).listen(app.get('port'), () => {
    console.log('App is running, server is listenning on port', app.get('port'))
})

bot.on('text', (msg) => {
    const userId = msg.from.id
    const name = msg.from.first_name
    console.log(`${name}: ${userId}`)
})

AddCommand()

cron.schedule('1 9 * * *', () => {
    RankingsCommand()
})

bot.start()
