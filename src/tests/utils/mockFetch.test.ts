import {describe, it, mock } from "node:test";
import assert from 'node:assert'

const callService = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options)
        const data = await response.json()

        const result = {
            status: response.status,
            statusText: response.statusText,
            data,
        }

        return [null, result];
    } catch (e) {
        if (e instanceof Error) {
            return [e, null]
        }
    }

}

const mockFetchImplementation = (data, status, statusText) => {
    const mockFetch = mock.method(global, 'fetch').mock
    mockFetch.mockImplementation(() => Promise.resolve(new Response(JSON.stringify(data), { status, statusText })))
    return mockFetch;
}

describe('mockFetch', () => {
    it('should mock native fetch function and return 200', async () => {
        // Given
        const users = [
            {
                id: 1,
                name: 'Leanne Graham',
                username: 'Bret',
                email: 'leanne.graham@gmail.com',
            },
            {
                id: 2,
                name: 'Ervin Howell',
                username: 'Antonette',
                email: '',
            }
        ]
        const mockFetch = mockFetchImplementation(users, 200, 'OK')

        // When
        const [error, response] = await callService('https://jsonplaceholder.typicode.com/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Then
        assert.equal(error, null)
        assert.equal(mockFetch.callCount(), 1)
        assert.equal(response.status, 200)
        assert.deepStrictEqual(response.data, [
            {
                id: 1,
                name: 'Leanne Graham',
                username: 'Bret',
                email: 'leanne.graham@gmail.com',
            },
            {
                id: 2,
                name: 'Ervin Howell',
                username: 'Antonette',
                email: '',
            }
        ])
    })

    it('should mock native fetch function and return 400', async () => {
        // Given
        const mockError = {
            context: '400 Bad Request',
            error: 'Query parameter is missing',
        }
        const mockFetch = mockFetchImplementation(mockError, 400, 'Bad Request')

        // When
        const [error, response] = await callService('https://jsonplaceholder.typicode.com/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log('response', response)

        // Then
        assert.equal(error, null)
        assert.equal(mockFetch.callCount(), 1)
        assert.equal(response.status, 400)
        assert.equal(response.statusText, 'Bad Request')
        assert.deepStrictEqual(response.data, {
            context: '400 Bad Request',
            error: 'Query parameter is missing'
        })
    })
})