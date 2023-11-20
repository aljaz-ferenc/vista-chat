export function trimText(string, maxChar) {
    if (string.length <= maxChar) return string

    return `${string.slice(0, maxChar)}...`
}

export function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

export function setThemeColors(theme) {
    switch (theme) {
        case 'light':
            document.documentElement.style.setProperty('--color-primary', '#1755a2')
            document.documentElement.style.setProperty('--color-primary-light', '#4c9afa')
            document.documentElement.style.setProperty('--color-accent', '#ef7e4c')
            document.documentElement.style.setProperty('--color-accent-light', '#f1956e')
            document.documentElement.style.setProperty('--color-text', 'rgb(75, 75, 75)')
            document.documentElement.style.setProperty('--color-background', 'rgb(255, 255, 255)')
            document.documentElement.style.setProperty('--color-messages-background', 'rgb(255, 255, 255)')
            document.documentElement.style.setProperty('--color-user-background', 'rgb(255, 255, 255)')
            document.documentElement.style.setProperty('--color-my-message', '#e8f3ff')
            document.documentElement.style.setProperty('--color-other-message', '#4b9af9')
            document.documentElement.style.setProperty('--color-chats-list-bg', '#f2f5fc')
            document.documentElement.style.setProperty('--color-chats-list-item', 'rgb(255, 255, 255)')
            document.documentElement.style.setProperty('--color-border', '#f2f5fc')
            document.documentElement.style.setProperty('--color-shared-files', '#4c9afa')
            document.documentElement.style.setProperty('--color-shared-files-tab-active', '#fff')
            document.documentElement.style.setProperty('--color-shared-files-tab-inactive', '#4c9afa')
            document.documentElement.style.setProperty('--color-active-line', '#4c9afa')
            break
        case 'dark':
            document.documentElement.style.setProperty('--color-primary', 'rgb(33, 33, 33)')
            document.documentElement.style.setProperty('--color-primary-light', '#151a28')
            document.documentElement.style.setProperty('--color-accent', '#e13073')
            document.documentElement.style.setProperty('--color-accent-light', '#f14788')
            document.documentElement.style.setProperty('--color-text', 'white')
            document.documentElement.style.setProperty('--color-background', '#32405d')
            document.documentElement.style.setProperty('--color-messages-background', '#32405d')
            document.documentElement.style.setProperty('--color-user-background', '#232b40')
            document.documentElement.style.setProperty('--color-my-message', '#3d4b6c')
            document.documentElement.style.setProperty('--color-other-message', '#232a3e')
            document.documentElement.style.setProperty('--color-chats-list-bg', '#232b40')
            document.documentElement.style.setProperty('--color-chats-list-item', '#3d4b6c')
            document.documentElement.style.setProperty('--color-border', '#232b40')
            document.documentElement.style.setProperty('--color-shared-files', '#32405d')
            document.documentElement.style.setProperty('--color-shared-files-tab-active', '#fff')
            document.documentElement.style.setProperty('--color-shared-files-tab-inactive', '#475b82')
            document.documentElement.style.setProperty('--color-active-line', 'white')
    }
}