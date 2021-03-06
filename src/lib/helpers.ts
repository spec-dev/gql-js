export function stripTrailingSlash(url: string): string {
    return url.replace(/\/$/, '')
}

export function firstOr(arr: any[] = [], fallback: any = null) {
    return arr && arr.length ? arr[0] : fallback
}
