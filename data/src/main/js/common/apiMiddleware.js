import { CALL_API, JSON_FORMAT, FORMDATA } from './constants';
import { isEmptyObject, isObject } from './helpers';

// import { delay } from '../helpers/timers';

// В случае ошибки оптимально с бэкенда возращать json с полем error. статус в зависимости от ошибки
// Так же в случае ошибки в объект ответа добавляется:
//      status - статус ответа
//      error - текст ошибки
//      rawResponse - исходный ответ от сервера
// Поэтому массив в случае ошибки возвращать нельзя!
function status(response) {

    if (response.ok) {
        return response.text().then(
            content => (new Promise((resolve, reject) => {
                if (content) {
                    const contentType = response.headers.get('content-type');
                    if (!(contentType && contentType.toLowerCase().includes('application/json'))) {
                        const errorMessage = `no json headers in ${response.url}. contentType: ${contentType}.`;
                        console.error(errorMessage);
                    }
                }
                try {
                    const j = content ? JSON.parse(content) : {};
                    resolve(j);
                } catch (e) {
                    reject({ error: 'bad JSON content', rawResponse: response });
                }
            })
            ));
    }

    return new Promise((resolve, reject) => (
        response.text().then(
            (content) => {
                const jsonResponse = {
                    status: response.status, rawResponse: response, error: response.statusText,
                };
                try {
                    const j = content ? JSON.parse(content) : {};
                    if (Array.isArray(j)) {
                        const errorMessage = 'Warning: Response arrays from backend is deprecated. Use object';
                        console.error(errorMessage, j);
                    }
                    reject({ ...jsonResponse, ...j });
                } catch (e) {
                    reject({ ...jsonResponse });
                }
            })
    ));
}


const csrfTokenRe = /csrftoken=([^ ;]+)/;

function getCsrfToken() {
    const match = document.cookie.match(csrfTokenRe);
    if (!match) {
        return null;
    }
    return match[1];
}

function appendGetParam(url, data) {
    if (!data || isEmptyObject(data)) return url;
    const indexQM = url.indexOf('?');
    const hasQMark = indexQM !== -1;
    const hasParams = hasQMark && indexQM !== url.length - 1;
    const queryString = Object.entries(data).map(([key, value]) => (`${encodeURI(key)}=${encodeURIComponent(value)}`)).join('&');
    let params = '?';
    if (hasQMark) {
        params = hasParams ? '&' : '';
    }
    return `${url}${params}${queryString}`;
}

export function callApi(endpoint, method = 'get', body, bodyFormat = JSON_FORMAT) {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Accept', 'application/json');

    let requestBody = body;
    let requestEndpoint = endpoint;
    if (method.toUpperCase() === 'GET') {
        requestBody = undefined;
        requestEndpoint = appendGetParam(requestEndpoint, body);
    } else if (bodyFormat === JSON_FORMAT) {
        if (typeof body === 'string') {
            requestBody = body;
            // eslint-disable-next-line
            console.error('request body already string');
        } else {
            requestBody = JSON.stringify(body);
        }
        headers.append('Content-Type', 'application/json');
    } else if (bodyFormat === FORMDATA) {
        requestBody = new FormData();
        const addValueInFormData = (key, value) => {
            if ((body[key] !== undefined) && (body[key] !== null)) {
                requestBody.append(key, value);
            }
        };
        for (const key in body) {
            if (Array.isArray(body[key])) {
                for (const arrayValue of body[key]) {
                    addValueInFormData(key, arrayValue);
                }
            } else {
                addValueInFormData(key, body[key]);
            }
        }
    }

    const csrftoken = getCsrfToken();
    if (csrftoken !== undefined) {
        headers.append('X-CSRFToken', csrftoken);
    }

    const requestOptions = {
        method: method.toUpperCase(),
        body: requestBody,
        credentials: 'same-origin',
        headers,
    };

    const request = new Request(requestEndpoint, requestOptions);
    return fetch(request).then(status);
}


export default store => next => (action) => {
    if (action.type !== CALL_API) {
        return next(action);
    }

    const defaultCallback = () => {};
    const defaultPayload = d => d;
    const errorPayload = (d) => {
        const {...result } = d;
        return result;
    };

    const typesWithCallbacks = [];
    const { endpoint, method, types, body, bodyFormat, additionalData, payload = defaultPayload } = action;

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }

    for (const item of types) {
        if (typeof item === 'string') {
            typesWithCallbacks.push(({ type: item, callback: defaultCallback }));
        } else if (isObject(item)) {
            if (typeof item.type !== 'string') {
                throw new Error('Expected type in types items to be a string');
            }
            typesWithCallbacks.push({
                type: item.type,
                callback: (typeof item.callback === 'function' && item.callback) || defaultCallback,
            });
        } else {
            throw new Error('Expected action types to be strings or objects.');
        }
    }

    const [forRequest, forSuccess, forFailure] = typesWithCallbacks;

    const requestAction = {
        type: forRequest.type,
        additionalData,
    };
    store.dispatch(requestAction);
    forRequest.callback(store, requestAction);

    // return delay(5000).then(() => callApi(endpoint, method, body, bodyFormat)).then(
    return callApi(endpoint, method, body, bodyFormat).then(
        (data) => {
            const responseAction = {
                additionalData,
            };
            if (data.error || (data.result || '').toLowerCase() === 'fail') {
                responseAction.type = forFailure.type;
                responseAction.error = data.error;
                responseAction.payload = payload(data);

                store.dispatch(responseAction);
                forFailure.callback(store, responseAction);
                return Promise.resolve({ ...data, fail: true });
            }
            responseAction.type = forSuccess.type;
            responseAction.payload = payload(data);
            store.dispatch(responseAction);
            forSuccess.callback(store, responseAction);

            return Promise.resolve(data);
        },
        (error) => {
            const responseAction = {
                type: forFailure.type,
                payload: errorPayload(error),
                error: errorPayload(error),
                additionalData,
                rawResponse: error.rawResponse,
            };
            store.dispatch(responseAction);
            forFailure.callback(store, responseAction);
            const err = typeof error === 'string' ? { error, fail: true } : { ...error, fail: true };
            return Promise.resolve(err);
        });
};
