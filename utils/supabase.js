import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { HOJE } from './helperFunctions'
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
    const hoje = HOJE.toLocaleDateString
    const { data: ranking, error } = await supabase
        .from('ranking')
        .select(
            `
        userid, minutos  
    `
        )
        .eq('', '')

    // `
    // select id, nome, minutos
    // from ranking join players
    // on players.id = ranking.userid
    // order by minutos;
    // `
    return { ranking, error }
}

const init = async () => {
    const { data, error } = await getAllRanking()
    console.log(data, error)
    // const players = await getAllPlayers()
    // const { ranking } = await console.log(players)
}

init()
