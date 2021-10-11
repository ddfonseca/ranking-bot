import { displayTarget, percentageToString } from '../commands/DisplayTarget'
import {
    formatDate,
    getMetasAcumulativo,
    transformData
} from './helperFunctions'
import { getMetas, getRankingBetween, rpcTest } from './supabase'

const init = async () => {
    console.log(await getMetasAcumulativo())
    // console.log(percentageToString(100, 100))
    // console.log(percentageToString(110, 100))
    // console.log(percentageToString(90, 100))
    // console.log(percentageToString(50, 100))

    // const meta = getDBMeta()
    // displayTarget()
}

init()
