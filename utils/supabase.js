import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { createStringRank, HOJE, HOJE_SQL } from './helperFunctions'
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

export const addRowRanking = async (userid, dia, minutos) => {
    const { data, error } = await supabase
        .from('ranking')
        .insert([{ userid, dia, minutos }])
    return { data, error }
}

export const updateRowRanking = async (userid, dia, minutos) => {
    const { data, error } = await supabase
        .from('ranking')
        .update([{ userid, dia, minutos }])
        .match({ userid: userid, dia: dia })

    return { data, error }
}

export const getRankingDiario = async () => {
    const { data, error } = await supabase
        .from('ranking')
        .select('players ( nome) ,minutos')
        .eq('dia', HOJE_SQL)
        .order('minutos', { ascending: false })
    return { data, error }
}

export const getRankingBetween = async (firstDate, lastDate) => {
    const { data, error } = await supabase
        .from('ranking')
        .select('userid, players ( nome) ,minutos')
        .gte('dia', firstDate)
        .lte('dia', lastDate)
        .order('minutos', { ascending: false })
    return { data, error }
}

const init = async () => {
    const { data, error } = await getRankingBetween('2021-08-24', '2021-08-26')
    console.log(data)
    const result = data.reduce((acc, { players: { nome }, minutos }) => {
        acc[]

        console.log(acc)
        return acc
    }, [])
    console.log('result:', result)
    // if (!error) {
    //     console.log(createStrin)
    // }
    // const players = await getAllPlayers()
    // const { ranking } = await console.log(players)
}

init()
