import bot from '../utils/Bot'
import dotenv from 'dotenv'
import {
    getMetasAcumulativo,
    getRankingAcumulativo,
    getRankingMensal,
    getRankingSemanal
} from '../utils/helperFunctions'
dotenv.config()

const CHAT_ID = -1001435149532

export const RankingsCommand = async (msg) => {
    let result = await getRankingMensal()
    // console.log(`mensal: ${result}\n`)
    const sendTo = msg ? msg.chat.id : CHAT_ID
    if (result) {
        bot.sendMessage(sendTo, result)
    }
    result = await getRankingSemanal()
    // console.log(`semanal: ${result}\n`)
    if (result) {
        bot.sendMessage(sendTo, result)
    }
    result = await getRankingAcumulativo()
    // console.log(`acumulativo: ${result}\n`)
    if (result) {
        bot.sendMessage(sendTo, result)
    }
    result = await getMetasAcumulativo()
    // console.log(`acumulativo: ${result}\n`)
    if (result) {
        bot.sendMessage(sendTo, result)
    }
}
