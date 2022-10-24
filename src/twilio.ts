import Twilio from 'twilio'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || ''
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || ''
const TWILIO_AUTH_KEY = process.env.TWILIO_AUTH_TOKEN || ''
const TWILIO_API_SID = process.env.TWILIO_API_SID || ''

const AccessToken = Twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_KEY, {
    accountSid: TWILIO_ACCOUNT_SID
})

export function generateTwilioToken(identity: string, room: string) {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created

    const token = new AccessToken(
        TWILIO_ACCOUNT_SID,
        TWILIO_API_SID,
        TWILIO_API_SECRET
    )
    token.identity = identity

    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant()
    grant.room = room
    token.addGrant(grant)

    // Serialize the token to a JWT string
    return token.toJwt()
}

export async function findOrCreateRoom(roomName: string) {
    try {
        await twilioClient.video.rooms(roomName).fetch()
    } catch (error: any) {
        if (error.code === 20404) {
            await twilioClient.video.rooms.create({
                uniqueName: roomName,
                type: 'go'
            })
        } else {
            throw error
        }
    }
}
