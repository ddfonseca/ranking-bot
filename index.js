import Telebot from 'telebot'
import dotenv from 'dotenv'
import express from 'express'
import { addRowRanking, updateRowRanking } from './utils/supabase'
import { HOJE, HOJE_SQL } from './utils/helperFunctions'

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
})

bot.on(/\/add (\d{1,2})[:h](\d{0,2})/, async (msg, Match) => {
    // (\d{1,2})[:h](\d{0,2})
    // console.log(msg)
    const { match } = Match
    const horas = match[1] || 0
    const minutos = match[2] || 0
    const total = +horas * 60 + +minutos
    const name = msg.from.first_name
    const userId = msg.from.id
    const hojePtbr = HOJE.toLocaleDateString('pt-br')

    const { data, error } = await addRowRanking(userId, HOJE_SQL, total)
    // console.log('add', userId, dia, total)
    console.log('error', data, error)
    let resp
    if (!error) {
        resp = `${name}, ${horas} horas e ${minutos} minutos adicionados (Data: ${hojePtbr}).`
    } else if (error.details.includes('already')) {
        resp = `Usuário já registrou o dia de hoje. Deseja forçar atualização? (sim ou não)`
        bot.on('text', async (msg) => {
            if (msg.text.toLowerCase().startsWith('s')) {
                const { data, error } = await updateRowRanking(
                    userId,
                    dia,
                    total
                )
                console.log('on update', data, error)
                if (!error) {
                    resp = `${name}, ${horas} horas e ${minutos} minutos atualizados. (Data: ${hojePtbr}).`
                }
            } else {
                resp = `Nenhuma atualização.Tchau!`
            }
            bot.sendMessage(msg.chat.id, resp)
        })
    }
    bot.sendMessage(msg.chat.id, resp)
})

bot.start()
