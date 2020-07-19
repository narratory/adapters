import { RichSay } from "narratory"

/**
 * Interface which is identical to Narratory's RichSay except the string arrays are here single strings
 */
export interface RichSaySingleText extends RichSay {
  text: string
  ssml?: string
}

/**
 * Removes <speak> and </speak> elements from SSML string
 * @param ssml SSML string
 */
export const cleanSSML = (ssml: string) => {
  return ssml.replace("<speak>", "").replace("</speak>", "")
}

/**
 * Joins several text-messages with dot but removing any duplications like ".." and "?."
 * @param messages text messages
 */
export const joinTextsWithDot = (messages: string[]): string => {
  return messages
    .join(". ")
    .split("..")
    .join(".")
    .split("!.")
    .join("!")
    .split("?.")
    .join("?")
}

/**
 * Joins SSML messages with a break of given length
 * @param messages SSML messages
 * @param ms Break time in milliseconds
 */
export const joinSSMLWithBreak = (messages: string[], ms: number) => {
  const joinString = `<break time="${ms}ms"/>`
  return joinTextsWithDot(messages)
    .split(". ")
    .join(`. ${joinString}`)
    .split("? ")
    .join(`? ${joinString}`)
    .split("! ")
    .join(`! ${joinString}`)
}

/**
 * Joins Rich says together to one message. Supporting one content only. If more than one message with a content is present, the last content will be used.
 * @param messages: The Rich say messages but with only one text-message / ssml-message, i.e the optional random selection has already been done
 */
export const joinRichSaysWithDot = (
  messages: RichSaySingleText[]
): RichSaySingleText => {
  const joined: RichSaySingleText = {
    text: joinTextsWithDot(messages.map((msg) => msg.text)),
    ssml: joinTextsWithDot(
      messages.filter((msg) => msg.ssml).map((msg) => msg.ssml as string)
    ),
  }
  if (messages[messages.length - 1].suggestions) {
    joined.suggestions = messages[messages.length - 1].suggestions
  }
  const lastMessageWithContent = messages
    .reverse()
    .find((message) => message.content) // Get the last message with content, if any
  if (lastMessageWithContent) {
    joined.content = lastMessageWithContent.content
  }
  return joined
}
