import bot from '../utils/Bot'
import dotenv from 'dotenv'
import {
    getRankingAcumulativo,
    getRankingMensal,
    getRankingSemanal
} from '../utils/helperFunctions'
dotenv.config()

const CHAT_ID = -1001435149532

export const RankingsCommand = async () => {
    let msg = await getRankingMensal()
    console.log(`mensal: ${msg}\n`)
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
    msg = await getRankingSemanal()
    console.log(`semanal: ${msg}\n`)
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
    msg = await getRankingAcumulativo()
    console.log(`acumulativo: ${msg}\n`)
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
}
