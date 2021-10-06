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

const percentageToString = (total, meta) => {
    const percentage = total / meta
    const metaHour = (meta / 60).toString()
    const totalHour = (total / 60).toFixed(2)
    const fill = '█'
    const scale = 4
    const length = 100
    const filledLength = Math.round(percentage * 100)
    const bar =
        '|' +
        fill.repeat(filledLength / scale) +
        '.'.repeat((length - filledLength) / scale) +
        '| ' +
        filledLength +
        `% Completo ${totalHour}h / ${metaHour}h`
    return bar
}
