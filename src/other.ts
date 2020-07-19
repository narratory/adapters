import { RichSaySingleText } from "./util"

/**
 * General adapter, only supporting text output
 */
export const generalAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  return {
    fulfillmentMessages: [
      {
        platform: "PLATFORM_UNSPECIFIED",
        text: {
          text: messages
            .filter((message) => message.text) // Remove empty
            .map((message) => message.text),
        },
      },
    ],
  }
}
