export function trimText(string, maxChar){
    if(string.length <= maxChar) return string

    return `${string.slice(0, maxChar)}...`
}