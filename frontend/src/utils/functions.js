export function trimText(string, maxChar){
    if(string.length <= maxChar) return string

    return `${string.slice(0, maxChar)}...`
}

export function formatDate(date){
    return new Date(date).toISOString().split('T')[0];
}