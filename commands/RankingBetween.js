import bot from '../utils/Bot'
import dotenv from 'dotenv'
dotenv.config()

const CHAT_ID = process.env.CHAT_ID

const RankingAcumulativo = () => {
    bot.sendMessage(CHAT_ID)
}

export default RankingCommand
