import { format, subDays, getHours, getMinutes } from 'date-fns'
import {
    createStringRank,
    formatDate,
    getRankingAcumulativo,
    getRankingDiario,
    headerDate,
    transFormData
} from './helperFunctions'
import { getRankingBetween } from './supabase'

const init = async () => {
    // const { data } = await getRankingBetween('2021-08-23')
    // console.log(await getRankingAcumulativo())
    // console.log(formatDate(subDays(new Date(2021, 8, 1), 1), 'PPPP'))
    // const { data } = await getRankingBetween()
    // const result = transFormData(data)
    // const ranking = createStringRank(result)
    // console.log(data)
    // console.log(result)
    // console.log(ranking)
    const today = new Date()
    const minutos = getHours(today) * 3600 + getMinutes(today)
    const threshold = 9 * 3600
    console.log(minutos, threshold)
    console.log(getDateSQL())
}

const getDateSQL = () => {
    const today = new Date()
    const minutes = getHours(today) * 3600 + getMinutes(today)
    const THRESHOLD = 9 * 3600
    if (minutes >= THRESHOLD) {
        return formatDate(new Date(), 'yyyy-MM-dd')
    } else {
        return formatDate(subDays(new Date(), 1), 'yyyy-MM-dd')
    }
}

init()
