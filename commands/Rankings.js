import bot from '../utils/Bot'
import dotenv from 'dotenv'
import {
    getRankingAcumulativo,
    getRankingMensal,
    getRankingSemanal
} from '../utils/helperFunctions'
dotenv.config()

const CHAT_ID = process.env.CHAT_ID

export const RankingsCommand = async () => {
    let msg = await getRankingMensal()
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
    msg = await getRankingSemanal()
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
    msg = await getRankingAcumulativo()
    if (msg) {
        bot.sendMessage(CHAT_ID, msg)
    }
}
