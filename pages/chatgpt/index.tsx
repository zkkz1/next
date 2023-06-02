"use client";
import useMessages from "./hooks/useMessage";
import { useEffect } from "react";
import { create } from "zustand";
import { Chat } from "./components/Chat/Chat";

// const useStore = create<{
//   chatGptModel: { modal: string }[];
// }>((set) => ({
//   chatGptModel: [{ modal: "gpt-3.5-turbo" }],
// }));

export default function ChatBox() {
  const {
    messages,
    loading,
    messageIsStreaming,
    addMessage,
    cleanMessages,
    redoMessage,
  } = useMessages();
  // const { chatGptModel } = useStore();

  useEffect(() => {
    fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization:
          "Bearer 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",
      },
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center w-[780px] m-auto relative">
      <Chat
        messages={messages}
        loading={loading}
        messageIsStreaming={messageIsStreaming}
        onSend={addMessage}
        onReset={cleanMessages}
        redoMessage={redoMessage}
      />
    </div>
  );
}
