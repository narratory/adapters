import { RichSaySingleText, joinSSMLWithBreak, cleanSSML } from "./util"

const BREAK_LENGTH = 500

/**
 * Adapter for Voximplant telephony gateway. Using SSML primarily, but text as backup if SSML not provided
 */
export const voximplantAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  // We take any SSML provided and use text whenever SSML is not present
  const ssmlMessages = messages
    .map((message) => {
      return message.ssml ? cleanSSML(message.ssml) : cleanSSML(message.text)
    })
    .filter(Boolean)

  // We join all messages (with a break) since there's no point in using several messages with speech. And, Dialogflow seems to only provide TTS for the first message..
  let voiceMessage = `<speak>${joinSSMLWithBreak(
    ssmlMessages,
    BREAK_LENGTH
  )}</speak>`

  return {
    fulfillmentMessages: [
      {
        platform: "PLATFORM_UNSPECIFIED",
        text: {
          text: [voiceMessage],
        },
      },
    ],
  }
}
