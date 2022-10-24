import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
config()

import { useAuth } from './middlewares.js'
import { checkAuth, generateAuthToken } from './auth.js'
import { findOrCreateRoom, generateTwilioToken } from './twilio.js'

const app = express()

app.use(express.json())
app.use(
    cors({
        origin: '*',
        optionsSuccessStatus: 200
    })
)
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "https://e8c8-2603-7000-d700-6107-f50d-1b3f-11e9-5c41.ngrok.io/*"); // update to match the domain you will make the request from
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//  });

// routes
app.post('/status-callback', (req, res) => {
    console.log('new status')
    console.log(req.body)

    res.end()
})

app.post('/login', (req, res) => {
    const body = req.body
    const { username, password } = body
    if (!username || !password) {
        return res
            .status(403)
            .json({ message: 'incorrect username or password' })
    }
    if (checkAuth(username, password)) {
        const token = generateAuthToken(username)

        return res.json({ token })
    } else {
        return res
            .status(403)
            .json({ message: 'incorrect username or password' })
    }
})

app.get('/rooms', (req, res) => {
    return res.json({ rooms: ['general', 'random', 'dinner'] })
})
// authhenticated routes
app.use(useAuth)

app.get('/token', (req, res) => {
    const identity = req.user

    if (!identity) {
        return res.status(401).json({ message: 'unauthorized' })
    }
    let room = req.query.room
    if (!room || typeof room !== 'string') {
        room = 'Default Room'
    }

    const token = generateTwilioToken(identity, room)

    return res.json({ token })
})

app.post('/join_room', (req, res) => {
    const identity = req.user
    if (!identity) {
        return res.status(401).json({ message: 'unauthorized' })
    }
    try {
        const roomName = req.body.roomName
        console.log(roomName)
        findOrCreateRoom(roomName)

        const token = generateTwilioToken(identity, roomName)

        return res.json({ token })
    } catch (err: any) {
        return res.status(500).json({ message: 'error creating room' })
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
