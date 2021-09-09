import { ptBR } from 'date-fns/locale'
import { getDay, subDays } from 'date-fns'
import { getRankingBetween } from './supabase'
import { format } from 'date-fns-tz'

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

export const getRankingDiario = async (date) => {
    const { data } = await getRankingBetween(date, date)
    const sumData = transformData(data)
    const hoje = formatDate(date, 'PPPPp')
    const header = `Ranking de ${hoje} 🏆\n\n`
    return header + createStringRank(sumData)
}

export const getRankingAcumulativo = async () => {
    const weekday = getDay(new Date())
    // se for segunda, fazer o ranking semanal

    // se for dia 01, pegar o ranking mensal do mês anterior

    // se for quarta-feira até domingo, realizar o
    if (weekday > 2) {
        const firstDay = subDays(new Date(), weekday - 1)
        const lastDay = subDays(new Date(), weekday - 2)
        console.log('first', firstDay)
        console.log('last', lastDay)
        const { data } = await getRankingBetween(firstDay, lastDay)
        // console.log(data)
        const firstDayFormatted = formatDate(firstDay, 'dd/MM/yyyy')
        const lastDayFormatted = formatDate(lastDay, 'dd/MM/yyyy')
        let header = `Ranking Acumulativo de ${weekday - 1} dias.\n`
        header += `Entre as datas ${firstDayFormatted} e ${lastDayFormatted} 🏆\n\n`

        const sumData = transformData(data)
        return header + createStringRank(sumData)
    }
}

export const formatDate = (date, pattern) => {
    return format(date, pattern, {
        timeZone: 'America/Sao_Paulo',
        locale: ptBR
    })
}

export const getTimeAndReturnDay = () => {
    const today = new Date()
}
