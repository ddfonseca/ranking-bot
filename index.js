import express from 'express'
import bot from './utils/Bot'
import { AddCommand } from './commands/Add'
import { RankingsCommand } from './commands/Rankings'
import { ChallengeCommand } from './commands/Challenge'
import { CronJob } from 'cron'

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

bot.on('/ranking', (msg) => {
    RankingsCommand(msg)
})

bot.on('/add', (msg) => {
    AddCommand(msg)
})

bot.on('/desafio', (msg) => {
    ChallengeCommand(msg)
})

const job = new CronJob(
    '0 9 * * *',
    async () => {
        await RankingsCommand()
    },
    null,
    true,
    'America/Sao_Paulo'
)

bot.start()
job.start()
