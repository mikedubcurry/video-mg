import { sign } from 'jsonwebtoken'

import { users } from './users.js'

const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET || ''

export function checkAuth(username: string, password: string) {
    return (
        users.filter(user => {
            return user.username === username && user.password === password
        }).length === 1
    )
}

export function generateAuthToken(username: string) {
    const token = sign({ identity: username }, JWT_AUTH_SECRET, {
        expiresIn: 3600
    })

    return token
}
