export type TFunctionResponse = {
    statusCode?: number,
    rateLimited: boolean,
    timeToReset: number,
    error?:string
}

export function checkForRateLimit(response: any): TFunctionResponse {

    const headers = response.headers;

    if (!headers) return {
        statusCode: response.status,
        rateLimited: false,
        timeToReset: -1,
        error: 'No headers!'
    } 

    if ('x-ratelimit-remaining' in headers && headers['x-ratelimit-remaining'] === 0) {
        console.log(`RateLimited from GitHub!`);
        return {
            statusCode: response.status,
            rateLimited: true,
            timeToReset: headers[`x-ratelimit-reset`],
            error: 'No remaining attempts'
        }
    }

    return {
        statusCode: response.status,
        rateLimited: false,
        timeToReset: 0,
    }
}