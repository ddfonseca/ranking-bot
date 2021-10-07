import { displayTarget } from '../commands/DisplayTarget'
import {
    formatDate,
    getMetasAcumulativo,
    transformData
} from './helperFunctions'
import { getMetas, getRankingBetween, rpcTest } from './supabase'

const init = async () => {
    console.log(await getMetasAcumulativo())

    // const meta = getDBMeta()
    // displayTarget()
}

init()
