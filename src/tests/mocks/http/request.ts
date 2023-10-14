import {mock} from "node:test";
import http from "http";

export type OptionRequests = [{
    isMockOne: boolean
    mockCallIdx: number
    mockData: {
        statusCode: number
        statusMessage: string
        data: Record<string, unknown>
    }
}]

const mockedCallback = (mockData) => (event, callback) => {
    console.log('[mockedCallback] event', event)

    if (event === 'data') {
        callback(JSON.stringify(mockData))
    }
    if (event === 'end') {
        callback()
    }
}

const mockHttpRequest = (optionRequests: OptionRequests) => {
    const httpRequestMocked = mock.method(http, 'request').mock;

    optionRequests.forEach((requestOptions) => {
        httpRequestMocked.mockImplementationOnce((opts, callback) => {
            callback({
                statusCode: requestOptions.mockData.statusCode,
                statusMessage: requestOptions.mockData.statusMessage,
                on: mockedCallback(requestOptions.mockData.data)
            })
            return {
                end: () => { },
                on: (event, callback) => {
                    if (event === 'error') {
                        callback(new Error('Something went wrong'))
                    }
                }
            }
        }, requestOptions.mockCallIdx);
    })

    return httpRequestMocked;
}

export default mockHttpRequest;