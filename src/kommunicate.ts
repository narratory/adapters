import { Content, RichSay, Card, List } from "narratory"
import { RichSaySingleText } from "./util"

const getList = (list: List) => {
  const listData: any = {
    contentType: "300",
    templateId: "7",
    payload: {
      elements: list.items.map((item) => {
        let action: any
        if (item.url) {
          action = {
            type: "link",
            url: item.url,
          }
        } else {
          action = {
            type: "quick_reply",
            text: item.title,
          }
        }

        const itemData: any = {
          title: item.title,
          action,
        }

        if (item.image) {
          itemData.imgSrc = item.image.url
        }

        if (item.description) {
          itemData.description = item.description
        }
        return itemData
      }),
    },
  }

  if (list.image) {
    listData.payload.headerImgSrc = list.image.url
  }
  if (list.title) {
    listData.payload.headerText = list.title
  }

  return listData
}

const getCard = (card: Card) => {
  const buttons = card.buttons
    ? card.buttons.map((button) => {
        return {
          name: button.text,
          action: {
            type: "link",
            payload: {
              url: button.url,
            },
          },
        }
      })
    : null

  const header =
    card.image && card.image.url
      ? {
          imtSrc: card.image.url,
        }
      : {}

  const cardData: any = {
    contentType: "300",
    templateId: "10",
    payload: [
      {
        title: card.title,
        subtitle: card.subtitle,
        header,
        description: card.description,
        //titleExt: "Title extension",
      },
    ],
  }

  if (buttons) {
    cardData.payload[0].buttons = buttons
  }

  return cardData
}

const getSuggestions = (suggestions: string[]) => {
  return {
    contentType: "300",
    templateId: "6",
    payload: suggestions.map((suggestion) => {
      return {
        title: suggestion,
        message: suggestion,
      }
    }),
  }
}

const getContent = (content: Content) => {
  switch (content.type) {
    case "card":
      return getCard(content as Card)
    case "list":
      return getList(content as List)
    default:
      return null
  }
}

const getKommunicateMessage = ({
  message,
  last,
}: {
  message: RichSay
  last: boolean
}) => {
  let kommunicateMessage: any

  if (message.content) {
    // With content
    kommunicateMessage = {
      payload: {
        message: message.text,
        platform: "kommunicate",
        metadata: getContent(message.content),
      },
    }
  } else if (message.suggestions) {
    kommunicateMessage = {
      payload: {
        message: message.text,
        platform: "kommunicate",
        metadata: last ? getSuggestions(message.suggestions) : undefined,
      },
    }
  } else {
    // Without content
    kommunicateMessage = {
      payload: {
        message: message.text,
        platform: "kommunicate",
      },
    }
  }

  return kommunicateMessage
}

/**
 * Adapter for the Kommunicate.io web/app chat platform, supporting a subset of their rich messages
 */
export const kommunicateAdapter = ({
  messages,
}: {
  messages: RichSaySingleText[]
}) => {
  return {
    fulfillmentMessages: messages.map((message, index) => {
      return getKommunicateMessage({
        message,
        last: index == messages.length - 1,
      })
    }),
  }
}
