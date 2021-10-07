export const getTotalMinutes = async (fn) => {
    let total
    const today = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const weekday = getDay(today)
    // console.log(weekday)
    if (weekday === 0) {
        const fday = subDays(today, 6)
        // const { data } = await getMinutesBetweenUser(fday, today, userid)
        // total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    } else if (weekday === 1) {
        // const { data } = await getMinutesBetweenUser(today, today, userid)
        // total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    } else {
        const fday = subDays(today, weekday - 1)
        // const { data } = await getMinutesBetweenUser(fday, today, userid)
        // total = data.reduce((acc, { minutos }) => acc + minutos, 0)
    }

    return total
}
