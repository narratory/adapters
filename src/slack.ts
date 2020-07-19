import { RichSaySingleText } from "./util"

export const slackAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  return {
    fulfillmentMessages: messages.map((message) => {
      return {
        platform: "slack",
        payload: {
          slack: {
            text: message.text,
          },
        },
      }
    }),
  }
}
