import { addRowRanking, updateRowRanking } from '../utils/supabase'
import { getRankingDiario } from '../utils/helperFunctions'
import bot from '../utils/Bot'

import { utcToZonedTime } from 'date-fns-tz'
import { getHours, getMinutes } from 'date-fns'
import subDays from 'date-fns/subDays'
import { displayTarget } from './DisplayTarget'

export const AddCommand = async (msg) => {
    const re = /(\d{1,2})[:h](\d{0,2})/
    const match = re.exec(msg.text) || false
    if (match) {
        const horas = match[1] || 0
        const minutos = match[2] || 0
        const total = Number(horas) * 60 + Number(minutos)
        const userId = msg.from.id
        const date = getDate()
        const { data, error } = await addRowRanking(userId, date, total)
        // console.log(data)
        // console.log(error)
        let resp = ''
        if (!error) {
            bot.sendMessage(msg.chat.id, await displayTarget(userId))
            bot.sendMessage(msg.chat.id, await getRankingDiario(date))
        } else if (error.details.includes('already')) {
            const { error } = await updateRowRanking(userId, date, total)
            if (!error) {
                // resp = `Usuário já registrou o dia de hoje.\nAtualizando dados.`
                // bot.sendMessage(msg.chat.id, resp)
                bot.sendMessage(msg.chat.id, await displayTarget(userId))
                bot.sendMessage(msg.chat.id, await getRankingDiario(date))
            }
        }
    } else {
        bot.sendMessage(
            msg.chat.id,
            'Padrão incorreto. Exemplos: /add 3h ou /add 3h30 ou /add 3:30'
        )
    }
}

const getDate = () => {
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const minutes = getHours(today) * 3600 + getMinutes(today)
    const THRESHOLD = 9 * 3600
    if (minutes >= THRESHOLD) {
        return today
    } else {
        return subDays(today, 1)
    }
}
