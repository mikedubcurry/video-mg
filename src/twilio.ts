import Twilio from "twilio";

const TWILIO_API_SID = process.env.TWILIO_API_SID || "";
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || "";
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || "";

const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export function generateTwilioToken(identity: string, room: string) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    TWILIO_API_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );

  // Assign identity to the token
  token.identity = identity;

  // Grant the access token Twilio Video capabilities
  const grant = new VideoGrant();
  grant.room = room;
  token.addGrant(grant);

  // Serialize the token to a JWT string
  return token.toJwt();
}
