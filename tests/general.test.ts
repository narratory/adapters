import { generalAdapter } from "../src/other"
import { voximplantAdapter } from "../src"
import { mockMessages as messages } from "./mockMessages"
import { dialogflowMessengerAdapter } from "../src/dialogflowMessenger"

const responseObject = {
  fulfillmentMessages: [
    {
      platform: "PLATFORM_UNSPECIFIED",
      text: {
        text: ["foo", "bar"],
      },
    },
  ],
}

test("test general adapter", () => {
  const response = generalAdapter({ messages })
  expect(response).toMatchObject(responseObject)
})

test("test voximplant adapter", () => {
  const response = voximplantAdapter({ messages })
  const textResponses = response.fulfillmentMessages[0].text.text

  expect(textResponses).toHaveLength(1)
  expect(textResponses[0]).toEqual(expect.stringContaining("<break"))
  expect(textResponses[0]).toEqual(expect.stringContaining("<speak>"))
  expect(textResponses[0]).toEqual(expect.stringContaining("</speak>"))
  expect(textResponses[0]).toEqual(expect.stringContaining("foo"))
  expect(textResponses[0]).toEqual(expect.stringContaining("ssml"))
})

test("test dialogflow messenger adapter", () => {
  const response = dialogflowMessengerAdapter({messages})

  expect(response.fulfillmentMessages).toHaveLength(3)
  expect(response.fulfillmentMessages[0].text.text).toEqual("foo")
  expect(response.fulfillmentMessages[1].text.text).toEqual("bar")
  expect(response.fulfillmentMessages[2].payload.richContent[0]).toHaveLength(3)
  expect(response.fulfillmentMessages[2].payload.richContent[0][0].title).toEqual("Some title")
  expect(response.fulfillmentMessages[2].payload.richContent[0][1].text).toEqual("Take me to heaven")
  expect(response.fulfillmentMessages[2].payload.richContent[0][2].text).toEqual("Take me elsewhere")
})
