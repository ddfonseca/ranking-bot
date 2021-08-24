export const HOJE = new Date()
export const HOJE_SQL = HOJE.toLocaleDateString('af-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
})
