import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { formatDate, getRankingDiario } from './helperFunctions'
dotenv.config()

const supabaseUrl = 'https://enoubxdmnbaakrbupthf.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const getAllPlayers = async () => {
    let { data: players, error } = await supabase.from('players').select('*')
    return { players, error }
}

export const addRowPlayer = async (id, nome) => {
    const { data, error } = await supabase
        .from('players')
        .insert([{ id, nome }])
    return { data, error }
}

export const addRowRanking = async (userid, date, minutos) => {
    const dia = formatDate(date, 'yyyy-MM-dd')
    const { data, error } = await supabase
        .from('ranking')
        .insert([{ userid, dia, minutos }])
    return { data, error }
}

export const updateRowRanking = async (userid, date, minutos) => {
    const dia = formatDate(date, 'yyyy-MM-dd')
    const { data, error } = await supabase
        .from('ranking')
        .update([{ userid, dia, minutos }])
        .match({ userid: userid, dia: dia })

    return { data, error }
}

export const getRankingBetween = async (
    firstDate = new Date(),
    lastDate = new Date()
) => {
    const { data, error } = await supabase
        .from('ranking')
        .select('userid, players ( nome) ,minutos')
        .gte('dia', formatDate(firstDate, 'yyyy-MM-dd'))
        .lte('dia', formatDate(lastDate, 'yyyy-MM-dd'))
        .order('minutos', { ascending: false })

    return { data, error }
}

const init = async () => {
    // console.log(await getRankingDiario(new Date()))
    // const { data, error } = await getRankingBetween('2021-08-24', '2021-08-26')
    // let result
    // if (!error) {
    //     result = transFormData(data)
    // }
    // console.log(result)
}

// init()
