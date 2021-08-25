export const HOJE = new Date()
export const HOJE_SQL = HOJE.toLocaleDateString('af-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
})

export const createStringRank = (data) => {
    const result = data.reduce((acc, { minutos, players: { nome } }, idx) => {
        const hora = Math.floor(minutos / 60)
        let minuto = Number(minutos) % 60
        if (minuto < 10 && minuto != 0) minuto = `0${minuto}`
        minuto
            ? (acc += `${nome} - ${hora}h${minuto}min`)
            : (acc += `${nome} - ${hora}h`)

        if (idx === 0) acc += ' 🥇\n'
        else if (idx === 1) acc += ' 🥈\n'
        else if (idx === 2) acc += ' 🥉\n'
        else acc += '\n'

        return acc
    }, '')
    return result
}
