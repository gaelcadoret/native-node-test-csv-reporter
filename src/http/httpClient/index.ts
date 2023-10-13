import http from "http";

const buildResponse = (acc, result) => {

    // console.log('result ===>', result);

    if (result.status === 'rejected') {
        return {
            ...acc,
            [result.reason.key]: {
                status: result.reason.status,
                reason: result.reason.reason
            }
        }
    }

    if (result.value.status >= 200 && result.value.status < 300) {
        return {
            ...acc,
            [result.value.key]:  result.value
        }
    } else {
        // console.error(`Request failed with status code ${result.status}`);
        return {
            ...acc,
            [result.value.key]: {
                status: result.value.status,
                reason: result.value.reason || result.value.status === 404 ? 'Not found' : 'Something went wrong', //`Request failed with status code ${result.status}`
            }
        }
    }
}

const requestCallback = (request, resolve) => (response) => {
    let responseData = '';

    response.on('data', (chunk) => {
        responseData += chunk;
    });

    response.on('end', () => {
        const parsedData = JSON.parse(responseData);
        resolve({status: response.statusCode, message: response.statusMessage, data: parsedData, key: request.key});
    });
}

const httpClient = async (requests) => {
    const promises = requests.map((request) => {
        return new Promise((resolve, reject) => {

            const req = http.request(request, requestCallback(request, resolve));

            req.on('error', (error) => {
                reject({status: 500, reason: error.message, key: request.key});
            });

            if (request.body) {
                req.write(JSON.stringify(request.body));
            }

            req.end();

            if (request.timeout) {
                req.setTimeout(request.timeout, () => {
                    req.destroy();
                    reject({status: 408, reason: 'Request timed out', key: request.key});
                });
            }
        });
    });

    try {
        const results = await Promise.allSettled(promises);
        console.log('results', results)
        return results.reduce(buildResponse, {});
        // return results;
    } catch (error) {
        console.error(error);
    }
}

export default httpClient;