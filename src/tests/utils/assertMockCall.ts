import { getValueBySymbolName } from '~/domain/core/utils/getValueBySymbolName'
import assert from 'node:assert'

type MethodEnumType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export type Options = {
    method: MethodEnumType
    baseUrl: string
    path: string
    headers?: Record<string, any>
    searchParams?: Record<string, any>
    body?: Record<string, any>
}

const assertSearchParamsEqual =
    (data: Record<string, any>) =>
        ([key, val]: [key: string, val: any]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            assert.equal(data.urlList[0].searchParams.get(key), val)
        }

const assertBodyEqual =
    (data: Record<string, any>) =>
        ([key, val]: [key: string, val: string]) => {
            assert.equal(new URLSearchParams(data.body.source).get(key), val)
        }

const assertMapDeepEqual =
    (headersMap: Map<string, any>) =>
        ([key, val]: [key: string, val: any]) => {
            assert.deepEqual(headersMap.get(key.toLowerCase()), {
                name: key,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: val,
            })
        }

export const assertMockCall = (mockFn, options: Options) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mockData = mockFn.calls[0].arguments[0]

    const getStateValue = getValueBySymbolName('state')
    const getHeadersValue = getValueBySymbolName('headers map')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const data = getStateValue(mockData)

    console.log('data', data)

    const headersData = data.headersList
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const headersMap = getHeadersValue(headersData)

    assert.equal(data.urlList[0].origin, options.baseUrl)
    assert.equal(data.urlList[0].pathname, options.path)
    assert.equal(data.method, options.method)

    if (options.searchParams) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.entries(options.searchParams).forEach(assertSearchParamsEqual(data))
    }

    if (options.headers) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.entries(options.headers).forEach(assertMapDeepEqual(headersMap))
    }

    if (options.body) {
        Object.entries(options.body).forEach(assertBodyEqual(data))
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    assert.strictEqual(mockFn.callCount(), 1)
}
