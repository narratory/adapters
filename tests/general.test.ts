import { generalAdapter } from "../src/other"
import { voximplantAdapter } from "../src"
import { mockMessages as messages } from "./mockMessages"

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
