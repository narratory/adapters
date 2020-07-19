import { RichSaySingleText, cleanSSML } from "./util"

export const generalAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  let textMessages = messages
    .filter((msg) => msg.text)
    .map((message) => {
      return {
        text: message.text,
        ssml: message.ssml ? cleanSSML(message.ssml) : message.text,
      }
    })

  return {
    fulfillmentMessages: [
      {
        platform: "PLATFORM_UNSPECIFIED",
        text: {
          text: textMessages.map((message) => message.text),
        },
      },
    ],
  }
}
