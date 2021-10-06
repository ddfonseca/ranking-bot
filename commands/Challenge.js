import bot from '../utils/Bot'
import { addRowGoal, updateRowGoal } from '../utils/supabase'

export const ChallengeCommand = async (msg) => {
    const re = /(\d{1,2})[:h]?(\d{0,2})/
    const match = re.exec(msg.text) || false
    if (match) {
        const horas = match[1] || 0
        const minutos = match[2] || 0
        const meta = Number(horas) * 60 + Number(minutos)
        const userId = msg.from.id
        const { error } = await addRowGoal(userId, meta)
        let resp = ''
        if (!error) {
            minutos
                ? (resp = `Meta de ${horas}h${minutos} de ${msg.from.first_name} adicionado com sucesso!`)
                : (resp = `Meta de ${horas}h de ${msg.from.first_name} adicionado com sucesso!`)

            bot.sendMessage(msg.chat.id, resp)
        } else if (error.details.includes('already')) {
            const { error } = await updateRowGoal(userId, meta)
            if (!error) {
                minutos
                    ? (resp = `Meta de ${horas}h${minutos} de ${msg.from.first_name} atualizado com sucesso!`)
                    : (resp = `Meta de ${horas}h de ${msg.from.first_name} atualizado com sucesso!`)
                bot.sendMessage(msg.chat.id, resp)
            } else {
                resp = `Oops! Algum erro aconteceu.`
                bot.sendMessage(msg.chat.id, resp)
            }
        } else {
            bot.sendMessage(
                msg.chat.id,
                'Padrão incorreto. Exemplos: /desafio 20 (com ou sem h) ou 20h ou /desafio 25h30 ou /desafio 25:30'
            )
        }
    }
}
