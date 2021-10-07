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

export const addRowGoal = async (userid, meta) => {
    const { data, error } = await supabase
        .from('goal')
        .insert([{ userid, meta }])
    return { data, error }
}

export const updateRowGoal = async (userid, meta) => {
    const { data, error } = await supabase
        .from('goal')
        .update([{ userid, meta }])
        .match({ userid })
    return { data, error }
}

export const getMinutesBetweenUser = async (
    firstDate = new Date(),
    lastDate = new Date(),
    userid
) => {
    const { data, error } = await supabase
        .from('ranking')
        .select('userid, players ( nome) ,minutos')
        .gte('dia', formatDate(firstDate, 'yyyy-MM-dd'))
        .lte('dia', formatDate(lastDate, 'yyyy-MM-dd'))
        .eq('userid', userid)

    return { data, error }
}

export const getDBMeta = async (userid) => {
    const { data, error } = await supabase
        .from('goal')
        .select('meta')
        .eq('userid', userid)
    return data
}

export const getMetas = async () => {
    const { data, error } = await supabase.from('goal').select('userid, meta')
    return data
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

export const rpcTest = async () => {
    return await supabase.rpc('getMinutosBetween', {
        params: {
            fdate: '2021-10-01',
            sdate: '2021-10-07'
        }
    })
}
// await supabase.rpc('echo_city', params: { 'name': 'The Shire' })  .execute();
