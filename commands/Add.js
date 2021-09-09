import { addRowRanking, updateRowRanking } from '../utils/supabase'
import {
    createStringRank,
    formatDate,
    getRankingDiario
} from '../utils/helperFunctions'
import bot from '../utils/Bot'
import { getHours, getMinutes } from 'date-fns'

const AddCommand = () => {
    // bot.on(/\/add (\d{1,2})[:h](\d{0,2})/, async (msg ) => {
    bot.on('/add', async (msg) => {
        // (\d{1,2})[:h](\d{0,2})
        const re = /(\d{1,2})[:h](\d{0,2})/
        const match = re.exec(msg.text) || false
        if (match) {
            const horas = match[1] || 0
            const minutos = match[2] || 0
            const total = Number(horas) * 60 + Number(minutos)
            const name = msg.from.first_name
            const userId = msg.from.id
            const date = getDate()
            const { data, error } = await addRowRanking(userId, date, total)
            // console.log('error', data, error)
            let resp = ''
            if (!error) {
                // resp = `${name}, ${horas} horas e ${minutos} minutos adicionados (Data: ${hojePtbr}).`
                // bot.sendMessage(msg.chat.id, resp)
                bot.sendMessage(msg.chat.id, await getRankingDiario(date))
            } else if (error.details.includes('already')) {
                resp = `Usuário já registrou o dia de hoje.\nAtualizando dados.`
                bot.sendMessage(msg.chat.id, resp)
                const { error } = await updateRowRanking(userId, date, total)
                if (!error) {
                    // resp = `${name}, ${horas} horas e ${minutos} minutos atualizados. (Data: ${hojePtbr}).`
                    // bot.sendMessage(msg.chat.id, resp)
                    bot.sendMessage(msg.chat.id, await getRankingDiario(date))
                }
            }
        } else {
            bot.sendMessage(
                msg.chat.id,
                'Padrão incorreto. Exemplos: /add 3h ou /add 3h30 ou /add 3:30'
            )
        }
    })
}

const getDate = () => {
    const today = new Date()
    const minutes = getHours(today) * 3600 + getMinutes(today)
    const THRESHOLD = 9 * 3600
    if (minutes >= THRESHOLD) {
        return new Date()
    } else {
        return subDays(new Date(), 1)
    }
}

export default AddCommand
