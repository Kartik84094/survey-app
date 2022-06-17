export const getStorage = storage => {
    if (storage === 'id') return localStorage.getItem(storage)
    return JSON.parse(localStorage.getItem(storage))
}

export const setUserInStorage = (storage, value) => localStorage.setItem(storage, JSON.stringify([ ...value ]))
