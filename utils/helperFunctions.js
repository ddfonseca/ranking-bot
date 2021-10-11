import { ptBR } from 'date-fns/locale'
import {
    getDate,
    getDay,
    getDaysInMonth,
    lastDayOfMonth,
    subDays,
    subMonths
} from 'date-fns'
import { getMetas, getMinutesBetweenUser, getRankingBetween } from './supabase'
import { format, utcToZonedTime } from 'date-fns-tz'
import { percentageToString } from '../commands/DisplayTarget'

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

/*
    Sum minutes
*/
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

export const getRankingSemanal = async () => {
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const weekday = getDay(today)
    if (weekday === 1) {
        const firstDay = subDays(today, 7)
        const lastDay = subDays(today, 1)
        let header = `Ranking Semanal de 7 dias.\n`
        return await parseDataFormatted(firstDay, lastDay, header)
    }
}
export const getRankingMensal = async () => {
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    if (getDate(today) === 1) {
        const firstDay = subMonths(today, 1)
        const lastDay = lastDayOfMonth(firstDay)
        let header = `Ranking Mensal de ${getDaysInMonth(firstDay)} dias.\n`
        return await parseDataFormatted(firstDay, lastDay, header)
    }
}

export const getRankingAcumulativo = async () => {
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const weekday = getDay(today)
    if (weekday > 2) {
        const firstDay = subDays(today, weekday - 1)
        const lastDay = subDays(today, 1)
        let header = `Ranking Acumulativo de ${weekday - 1} dias.\n`
        return await parseDataFormatted(firstDay, lastDay, header)
    }
    if (weekday === 0) {
        const firstDay = subDays(today, 6)
        const lastDay = subDays(today, 1)
        let header = `Ranking Acumulativo de 6 dias.\n`
        return await parseDataFormatted(firstDay, lastDay, header)
    }
}

const parseDataFormatted = async (firstDay, lastDay, header) => {
    const firstDayFormatted = formatDate(firstDay, 'dd/MM/yyyy')
    const lastDayFormatted = formatDate(lastDay, 'dd/MM/yyyy')
    header += `Entre as datas ${firstDayFormatted} e ${lastDayFormatted} 🏆\n\n`
    const { data } = await getRankingBetween(firstDay, lastDay)
    const sumData = transformData(data)
    return header + createStringRank(sumData)
}

export const formatDate = (date, pattern) => {
    return format(date, pattern, {
        timeZone: 'America/Sao_Paulo',
        locale: ptBR
    })
}

export const getTotalMinutes = async (userid) => {
    let total
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const weekday = getDay(today)
    // console.log(weekday)
    if (weekday === 0) {
        const fday = subDays(today, 6)
        const { data } = await getMinutesBetweenUser(fday, today, userid)
        total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    } else if (weekday === 1) {
        const { data } = await getMinutesBetweenUser(today, today, userid)
        total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    } else {
        const fday = subDays(today, weekday - 1)
        const { data } = await getMinutesBetweenUser(fday, today, userid)
        total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    }

    return total
}

export const getMetasAcumulativo = async () => {
    let result
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const weekday = getDay(today)
    // console.log(weekday)
    if (weekday === 0) {
        const fdate = subDays(today, 6)
        result = createStringMetas(fdate, today)
    } else if (weekday === 1) {
        result = createStringMetas(today, today)
    } else {
        const fdate = subDays(today, weekday - 1)
        result = createStringMetas(fdate, today)
    }

    return result
}

export const createStringMetas = async (fdate, sdate) => {
    const scale = 10
    const r1 = await getMetasDB(fdate, sdate)
    let header = 'Ranking de Metas'
    const firstDayFormatted = formatDate(fdate, 'dd/MM/yyyy')
    const lastDayFormatted = formatDate(sdate, 'dd/MM/yyyy')
    header += `\nEntre as datas ${firstDayFormatted} e ${lastDayFormatted} 🏆\n\n`

    const r2 = r1.reduce((acc, { nome, minutos, meta, percentage }, idx) => {
        // const hour = (minutos / 60).toFixed(2)
        // const metaHour = meta / 60
        // const bar = percentageToString(minutos, meta, scale)
        const pts = Math.round(percentage * 100)

        if (percentage >= 1.1) {
            acc += `${nome} - ${pts}pts 🔥\n`
        } else if (percentage >= 1 && percentage < 1.1) {
            acc += `${nome} - ${pts}pts 🎖️\n`
        } else if (percentage >= 0.9 && percentage < 1) {
            acc += `${nome} ️- ${pts}pts 😅\n`
        } else {
            acc += `${nome} ️- ${pts}\n`
        }
        // acc += `${nome} - ${(percentage * 100).toFixed(
        //     2
        // )}% (${hour}h/${metaHour}h)`

        return acc
    }, '')
    return header + r2
}

export const getMetasDB = async (fdate, sdate) => {
    const { data } = await getRankingBetween(fdate, sdate)
    const metas = await getMetas()
    const result = metas
        .map(({ userid: id, meta }) => {
            return data
                .map(({ userid, minutos, players: { nome } }) => ({
                    userid,
                    nome,
                    minutos
                }))
                .filter(({ userid }) => userid === id)
                .reduce(
                    (acc, { userid, nome, minutos }) => {
                        return {
                            userid,
                            nome,
                            minutos: acc.minutos + minutos,
                            meta
                        }
                    },
                    { minutos: 0 }
                )
        })
        .map(({ userid, nome, minutos, meta }) => {
            return {
                userid,
                nome,
                minutos,
                meta,
                percentage: minutos / meta
            }
        })
        .sort((a, b) => (a.percentage < b.percentage && 1) || -1)

    return result
}
