import { Card, Image, Button } from "narratory"
import { RichSaySingleText } from "../src/util"

export const mockMessages: RichSaySingleText[] = [
    {
      text: "foo",
    },
    {
      text: "bar",
      ssml: "ssml",
      content: new Card({
        title: "Some title",
        description: "Some description",
        image: new Image("https://halktv.com.tr/d/news/41337.jpg", "grumpy"),
        buttons: [
          new Button("Take me to heaven", "http://narratory.io/"),
          new Button("Take me elsewhere", "https://www.urbandictionary.com/"),
        ],
      }),
    },
  ]