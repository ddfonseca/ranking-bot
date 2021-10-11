import { getTotalMinutes } from '../utils/helperFunctions'
import { getDBMeta } from '../utils/supabase'

export const displayTarget = async (userid) => {
    const total = await getTotalMinutes(userid)
    const meta = await getMeta(userid)
    if (meta) {
        return percentageToString(total, meta)
    } else {
        return ''
    }
}

const getMeta = async (userid) => {
    const result = await getDBMeta(userid)
    if (result.length !== 0) {
        const meta = result[0].meta
        return meta
    } else {
        return false
    }
}

export const percentageToString = (total, meta, scale = 4) => {
    const percentage = total / meta
    console.log(percentage)
    const metaHour = (meta / 60).toString()
    const totalHour = (total / 60).toFixed(2)
    const fill = '█'
    const length = 100
    let filledLength
    if (total > meta) {
        filledLength = 100
    } else {
        filledLength = Math.round(percentage * 100)
    }
    const bar =
        '|' +
        fill.repeat(filledLength / scale) +
        '.'.repeat((length - filledLength) / scale) +
        '| ' +
        Math.round(percentage * 100) +
        `pts - ${totalHour}h de ${metaHour}h`
    return bar
}
