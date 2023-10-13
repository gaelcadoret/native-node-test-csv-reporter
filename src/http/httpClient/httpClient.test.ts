import { describe, it, mock } from 'node:test'
import assert from 'node:assert'

import http from "http";

import httpClient from './'
import {assertMockCall} from "../../tests/utils/assertMockCall";

const mockedCallback = (mockData) => (event, callback) => {
    console.log('[mockedCallback] event', event)

    if (event === 'data') {
        callback(JSON.stringify(mockData))
    }
    if (event === 'end') {
        callback()
    }
}

describe('httpClient', () => {
    it('should call http.request 3 times with good parameters add aggregate response correctly', async () => {
        // Given
        const httpRequestMocked = mock.method(http, 'request').mock;

        const mockData = {
            id: 1,
            title: 'delectus aut autem',
            completed: false,
        };

        httpRequestMocked.mockImplementationOnce((options, callback) => {
            callback({
                statusCode: 200,
                statusMessage: 'OK',
                on: mockedCallback(mockData)
            })
            return {
                end: () => { },
                on: (event, callback) => {
                    if (event === 'error') {
                        callback(new Error('Something went wrong'))
                    }
                }
            }
        }, 0)
        httpRequestMocked.mockImplementationOnce((options, callback) => {
            callback({
                statusCode: 404,
                statusMessage: 'Not found',
                on: mockedCallback(mockData)
            })
            return {
                end: () => { },
                on: (event, callback) => {
                    console.log('[404] event', event)
                    if (event === 'error') {
                        callback(new Error('Not Found'))
                    }

                }
            }
        }, 1);
        httpRequestMocked.mockImplementationOnce((options, callback) => {
            callback({
                statusCode: 408,
                statusMessage: 'Request Timeout',
                on: mockedCallback(mockData)
            })
            return {
                end: () => { },
                on: (event, callback) => {
                    console.log('[408] event', event)
                    if (event === 'error') {
                        callback(new Error('Request timed out'))
                    }
                }
            }
        }, 2)

        // When
        const requests = [
            {
                hostname: 'jsonplaceholder.typicode.com',
                path: '/todos/1',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
                key: 'todo1',
            },
            {
                hostname: 'jsonplaceholder.typicode.com',
                path: '/todos/test',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 3000,
                key: 'todo2',
            },
            {
                hostname: 'jsonplaceholder.typicode.com',
                path: '/todos/3',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10,
                key: 'todo3',
            }
        ]
        const results = await httpClient(requests);

        // Then
        assert.equal(httpRequestMocked.callCount(), 3)

        const expectedResult = {
            todo1: {
                status: 200,
                message: 'OK',
                data: { id: 1, title: 'delectus aut autem', completed: false },
                key: 'todo1'
            },
            todo2: { status: 404, reason: 'Not found' },
            todo3: { status: 408, reason: 'Something went wrong' }
        };

        assert.deepStrictEqual(results, expectedResult)

        const expectedFirstCallValues = {
            hostname: 'jsonplaceholder.typicode.com',
            path: '/todos/1',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
            key: 'todo1'
        }

        const expectedSecondCallValues = {
            hostname: 'jsonplaceholder.typicode.com',
            path: '/todos/test',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 3000,
            key: 'todo2'
        }

        const expectedThirdCallValues = {
            hostname: 'jsonplaceholder.typicode.com',
            path: '/todos/3',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 10,
            key: 'todo3'
        }

        const firstCall = httpRequestMocked.calls[0].arguments[0];
        const secondCall = httpRequestMocked.calls[1].arguments[0];
        const thirdCall = httpRequestMocked.calls[2].arguments[0];

        httpRequestMocked.calls[0].result.on('end', () => {
            console.log('end')
        })

        assert.deepStrictEqual(firstCall, expectedFirstCallValues)
        assert.deepStrictEqual(secondCall, expectedSecondCallValues)
        assert.deepStrictEqual(thirdCall, expectedThirdCallValues)
    })
})