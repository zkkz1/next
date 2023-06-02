import { useCallback, useState } from "react";
import { getMessage } from "../server";

const useMessages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageIsStreaming, setMessageIsStreaming] = useState(false);

  const getNextMessage = useCallback(async (messages: IMessage[]) => {
    setMessageIsStreaming(true);
    setLoading(true);
    await getMessage(messages, setMessages, setLoading);
    setMessageIsStreaming(false);
  }, []);

  const addMessage = useCallback(
    async (message: IMessage) => {
      const newMessage = [...messages, message];
      setMessages(newMessage);
      getNextMessage(newMessage);
    },
    [getNextMessage, messages]
  );

  const redoMessage = useCallback(
    async (message: IMessage) => {
      messages.splice(messages.indexOf(message));
      console.log(messages, "newMessage");
      setMessages([...messages]);
      getNextMessage([...messages]);
    },
    [getNextMessage, messages]
  );

  const cleanMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    messageIsStreaming,
    addMessage,
    cleanMessages,
    redoMessage,
    setLoading,
  };
};

export default useMessages;
