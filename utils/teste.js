import { getRankingAcumulativo } from './helperFunctions'

const init = async () => {
    console.log(await getRankingAcumulativo())
}

init()
