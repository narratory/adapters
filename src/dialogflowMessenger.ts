import { RichSaySingleText } from "./util"
import { Content, Card, List, Button, Image } from "narratory"

//The info response type is a simple title card that users can click or touch.
const getCard = (card: Card) => {
  if (card.description && !card.subtitle) {
    card.subtitle = card.description.substr(0, 80)
  }

  const response: any[] = [
    {
      type: "info",
      title: card.title,
      subtitle: card.subtitle,
      image: {
        src: {
          rawUrl: card.image ? card.image.url : undefined,
        },
      },
    },
  ]

  if (card.buttons) {
    card.buttons.forEach((button) => {
      response.push(getButton(button)[0])
    })
  }

  return response
}

//The image response type is an image card that users can click or touch.
const getImage = (image: Image) => {
  return [
    {
      type: "image",
      rawUrl: image.url,
      accessibilityText: image.alt,
    },
  ]
}

//The button response type is a small button with an icon that users can click or touch.
const getButton = (button: Button) => {
  return [
    {
      type: "button",
      text: button.text,
      link: button.url,
      icon: {
        type: "chevron_right",
        color: "#FF9800",
      },
    },
  ]
}

//The list response type is a card with multiple options users can select from.
const getList = (list: List) => {
  const items: any[] = []

  list.items.forEach((item, index) => {
    const last = index === list.items.length - 1
    items.push({
      type: "list",
      title: item.title,
      subtitle: item.description,
    })
    if (!last) {
      items.push({
        type: "divider",
      })
    }
  })

  return items
}

const getTextMessage = (message: RichSaySingleText) => {
  return {
    text: { text: [message.text] },
  }
}

const getContent = (content: Content) => {
  let contentResponse
  switch (content.type) {
    case "card":
      contentResponse = getCard(content as Card)
      break
    case "list":
      contentResponse = getList(content as List)
      break
    case "image":
      contentResponse = getImage(content as Image)
      break
    case "button":
      contentResponse = getButton(content as Button)
      break
    default:
      return null
  }

  return {
    payload: {
      richContent: [contentResponse],
    },
  }
}

//The suggestion chip response type provides the end-user with a list of clickable suggestion chips.
const getSuggestions = (suggestions: string[]) => {
  const options =
    suggestions && suggestions.length > 0
      ? suggestions.map((suggestion) => {
          return {
            text: suggestion,
          }
        })
      : undefined

  return {
    payload: {
      richContent: [
        [
          {
            type: "chips",
            options: options,
          },
        ],
      ],
    },
  }
}

const getMessages = (messages: RichSaySingleText[]) => {
  const responses: any[] = []

  messages.forEach((message) => {
    if (message.text) {
      responses.push(getTextMessage(message))
    }
    if (message.content) {
      responses.push(getContent(message.content))
    }
    if (message.suggestions) {
      responses.push(getSuggestions(message.suggestions))
    }
  })
  return responses
}

/**
 * Dialogflow messenger adapter, supporting a subset of their rich message formats.
 */
export const dialogflowMessengerAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  return {
    fulfillmentMessages: getMessages(messages),
  }
}
