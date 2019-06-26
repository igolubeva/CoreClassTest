/* eslint-disable prefer-rest-params */

// простая проверка, что объект содержит пустые ключи
export function isEmptyObject(obj) {
    if (typeof obj !== 'object') {
        throw new Error(`аргумент isEmptyObject ${obj} не является объектом`);
    }
    if (Array.isArray(obj)) {
        throw new Error('аргумент isEmptyObject является массивом');
    }
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== '' && obj[key] !== undefined) {
            return false;
        }
    }
    return true;
}

export function isObject(item) {
    return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}
