import Telebot from 'telebot'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.TOKEN
const CHAT_ID = process.env.CHAT_ID

const bot = new Telebot({
    token: TOKEN,
    usePlugins: ['askUser']
})

export default bot
