import {
    addRowRanking,
    getRankingDiario,
    updateRowRanking
} from '../utils/supabase'
import { createStringRank, HOJE, HOJE_SQL } from '../utils/helperFunctions'
import bot from '../utils/Bot'

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
            const hojePtbr = HOJE.toLocaleDateString('pt-br')
            const { data, error } = await addRowRanking(userId, HOJE_SQL, total)
            console.log('error', data, error)
            let resp = ''
            if (!error) {
                resp = `${name}, ${horas} horas e ${minutos} minutos adicionados (Data: ${hojePtbr}).`
                bot.sendMessage(msg.chat.id, resp)
                bot.sendMessage(
                    msg.chat.id,
                    createStringRank(getRankingDiario())
                )
            } else if (error.details.includes('already')) {
                resp = `Usuário já registrou o dia de hoje.\nAtualizando dados.`
                bot.sendMessage(msg.chat.id, resp)
                const { data, error } = await updateRowRanking(
                    userId,
                    HOJE_SQL,
                    total
                )
                if (!error) {
                    resp = `${name}, ${horas} horas e ${minutos} minutos atualizados. (Data: ${hojePtbr}).`
                    bot.sendMessage(msg.chat.id, resp)
                    const { data } = await getRankingDiario()
                    console.log(data)
                    bot.sendMessage(msg.chat.id, createStringRank(data))
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

export default AddCommand
