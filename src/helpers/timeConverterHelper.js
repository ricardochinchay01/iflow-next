export const convertMicrosecondsToTime = (microseconds) => {
    const seconds = microseconds / 1_000
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes} minutos y ${remainingSeconds} segundos`
}
