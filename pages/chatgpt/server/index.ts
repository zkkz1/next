import { fetchEventSource } from "@microsoft/fetch-event-source";

const getMessage = async (
  messages: IMessage[],
  setMessages: any,
  setLoading: any
) => {
  await fetchEventSource("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as [1](link), etc, as you use them. Maximum 4 sentences.`,
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
    }),
    onmessage(ev) {
      if (ev.data === "[DONE]") {
        return;
      }
      try {
        const data = JSON.parse(ev.data);
        const next = data.choices[0].delta;
        if (next?.role === "assistant") {
          setLoading(false);
          setMessages((messages: any) => {
            return [...messages, { content: "", role: "assistant" as const }];
          });
        } else if (next?.content) {
          setMessages((messages: any) => {
            const newMessage = [...messages];
            newMessage[newMessage.length - 1].content += next?.content;
            return newMessage;
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
};

export { getMessage };
