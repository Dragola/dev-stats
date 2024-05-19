export type TFunctionResponse = {
    statusCode: number,
    rateLimited: boolean,
    timeToReset: number,
}

export function checkForRateLimit(response: any): TFunctionResponse {

    console.log(`response = ${response}`);

    const headers = response.headers;
    if ('x-ratelimit-remaining' in headers && headers['x-ratelimit-remaining'] === 0) {
        console.log(`RateLimited from GitHub!`);
        return {
            statusCode: response.status,
            rateLimited: true,
            timeToReset: headers[`x-ratelimit-reset`]
        }
    }

    console.log(`Not RateLimited!`);
    return {
        statusCode: response.status,
        rateLimited: false,
        timeToReset: 0
    }
}