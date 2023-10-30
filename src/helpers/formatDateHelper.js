export const formatDate = dateString => {
    try {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, options)
    } catch (error) {
        console.error('Error al formatear la fecha: ', error)
        return dateString // Si hay un error, retorna la fecha original.
    }
}
