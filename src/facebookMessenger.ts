import { RichSaySingleText } from "./util"
import { Content, Card, List, Button } from "narratory"

const getButton = (button: Button) => {
  return {
    title: button.text,
    url: button.url,
    type: "web_url",
  }
}

const getCard = (card: Card) => {
  if (card.description && !card.subtitle) {
    card.subtitle = card.description.substr(0, 80)
  }

  const fbCard: any = {
    title: card.title,
    subtitle: card.subtitle,
    image_url: card.image ? card.image.url : undefined,
    buttons: card.buttons
      ? card.buttons.map((button) => getButton(button))
      : undefined,
  }
  return fbCard
}

const getList = (list: List) => {
  return list.items && list.items.length > 0
    ? list.items.map((item) => {
        return {
          title: item.title,
          subtitle: item.description
            ? item.description.substr(0, 80)
            : undefined,
          image_url: item.image ? item.image.url : undefined,
          default_action: {
            type: "web_url",
            title: "Open",
            url: item.url,
          },
        }
      })
    : null
}

const getContent = (content: Content) => {
  switch (content.type) {
    case "card":
      return {
        platform: "facebook",
        payload: {
          facebook: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [getCard(content as Card)],
              },
            },
          },
        },
      }
    case "list": // Not working
      return {
        platform: "facebook",
        payload: {
          facebook: {
            attachment: {
              type: "template",
              payload: {
                // template_type: "generic",
                // elements: getList(content as List)
                template_type: "generic",
                elements: getList(content as List),
              },
            },
          },
        },
      }
    default:
      return null
  }
}

const getTextMessage = ({
  message,
  last,
}: {
  message: RichSaySingleText
  last: boolean
}) => {
  return {
    platform: "facebook",
    payload: {
      facebook: {
        text: message.text,
        quick_replies: last ? getSuggestions(message.suggestions) : undefined,
      },
    },
  }
}

const getSuggestions = (suggestions: string[] | undefined) => {
  return suggestions && suggestions.length > 0
    ? suggestions.map((suggestion) => {
        return {
          content_type: "text",
          title: suggestion,
          payload: suggestion,
        }
      })
    : undefined
}

const getMessages = (messages: RichSaySingleText[]) => {
  const fbMessages: any[] = []

  messages.forEach((message, index) => {
    const last = index === messages.length - 1
    if (last && message.suggestions && message.content) {
      // Content first if this is the last message
      fbMessages.push(getContent(message.content))
      fbMessages.push(getTextMessage({ message, last }))
    } else {
      // ...otherwise we put content last
      fbMessages.push(getTextMessage({ message, last }))
      if (message.content) {
        fbMessages.push(getContent(message.content))
      }
    }
  })
  return fbMessages
}

/**
 * Facebook messenger adapter, supporting a subset of their rich message formats.
 * @TODO: Lists currently broken
 */
export const facebookAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  return {
    fulfillmentMessages: getMessages(messages),
  }
}
