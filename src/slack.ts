import { RichSaySingleText } from "./util"

/**
 * Adapter for Slack, currently only supporting text
 */
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
