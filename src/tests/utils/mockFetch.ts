import { mock } from 'node:test'

const mockResolve = (data: any, statusCode: number) =>
	Promise.resolve({
		json: () => data,
		status: statusCode,
	})
const mockReject = (errMsg: string, statusCode: number) =>
	Promise.reject({
		message: errMsg,
		status: statusCode,
	})

const mockFetch =
	(mockOnce: boolean) =>
	(
		promiseResolve = true,
		statusCode = 200,
		data?: any | undefined,
		idxCall?: number | undefined,
		errMsg?: string | undefined
	) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const mockFn = mock.method(global, 'fetch').mock
		const response = promiseResolve
			? mockResolve(data, statusCode)
			: mockReject(errMsg as string, statusCode)

		if (mockOnce) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			mockFn.mockImplementationOnce(() => response, idxCall)
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			mockFn.mockImplementation(() => response)
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return mockFn
	}

export const mockFetchImplementation = mockFetch(false)
export const mockFetchImplementationOnce = mockFetch(true)
