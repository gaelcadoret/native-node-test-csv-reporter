import { describe, it } from 'node:test'
import assert from 'node:assert'

import httpClient from './'
import mockHttpRequest, {OptionRequests} from "../../tests/mocks/http/request";

describe('httpClient', () => {
    it('should call http.request 3 times with good parameters add aggregate response correctly', async () => {
        // Given
        const optionRequests: OptionRequests = [
            {
                isMockOne: true,
                mockCallIdx: 0,
                mockData: {
                    statusCode: 200,
                    statusMessage: 'OK',
                    data: {
                        id: 1,
                        title: 'delectus aut autem',
                        completed: false,
                    }
                }
            },
            {
                isMockOne: true,
                mockCallIdx: 1,
                mockData: {
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    data: {
                    }
                }
            },
            {
                isMockOne: true,
                mockCallIdx: 2,
                mockData: {
                    statusCode: 408,
                    statusMessage: 'Request Timeout',
                    data: {
                    }
                }
            },
        ]
        const httpRequestMocked = mockHttpRequest(optionRequests)

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