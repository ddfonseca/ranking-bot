import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { getRankingBetween } from './supabase'
import { subDays } from 'date-fns'

export const createStringRank = (data) => {
    const result = data.reduce((acc, { minutos, players: { nome } }, idx) => {
        const hora = Math.floor(minutos / 60)
        let minuto = Number(minutos) % 60
        if (minuto < 10 && minuto != 0) minuto = `0${minuto}`
        minuto
            ? (acc += `${nome} - ${hora}h${minuto}min`)
            : (acc += `${nome} - ${hora}h`)

        if (idx === 0) acc += ' 🥇\n'
        else if (idx === 1) acc += ' 🥈\n'
        else if (idx === 2) acc += ' 🥉\n'
        else acc += '\n'

        return acc
    }, '')
    return result
}

export const transformData = (data) => {
    const result = []
    data.reduce((acc, { players: { nome }, minutos }) => {
        if (!acc[nome]) {
            acc[nome] = { players: { nome }, minutos: 0 }
            result.push(acc[nome])
        }
        acc[nome].minutos += minutos
        return acc
    }, {})
    result.sort((a, b) => (a.minutos < b.minutos && 1) || -1)
    return result
}

export const getRankingDiario = async () => {
    const { data } = await getRankingBetween()
    const sumData = transformData(data)
    const hoje = formatDate(new Date(), 'PPPPp')
    const header = `Ranking de ${hoje} 🏆\n\n`
    return header + createStringRank(sumData)
}

export const getRankingAcumulativo = async () => {
    const { data } = await getRankingBetween()
    const sumData = transformData(data)
    const hoje = formatDate(new Date(), 'PPPPp')
    const header = `Ranking de ${hoje} 🏆\n\n`
    return header + createStringRank(sumData)
}

export const formatDate = (date, pattern) => {
    return format(date, pattern, { locale: ptBR })
}
