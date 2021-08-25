import { format } from 'date-fns'
import {
    createStringRank,
    formatDate,
    getRankingDiario,
    headerDate,
    transFormData
} from './helperFunctions'
import { getRankingBetween } from './supabase'

const init = async () => {
    const { data } = await getRankingBetween('2021-08-23')
    // const { data } = await getRankingBetween()
    // const result = transFormData(data)
    // const ranking = createStringRank(result)
    // console.log(data)
    // console.log(result)
    // console.log(ranking)
    console.log(headerDate(new Date(2021, 0, 20)))
}

init()
