import { FC, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { throttle } from "lodash-es";

interface Props {
  messages: IMessage[];
  loading: boolean;
  messageIsStreaming: boolean;
  onSend: (message: IMessage) => void;
  onReset: () => void;
  redoMessage: (message: IMessage) => void;
}

export const Chat: FC<Props> = ({
  messages,
  loading,
  messageIsStreaming,
  onSend,
  onReset,
  redoMessage,
}) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    throttledScrollDown();
  }, [throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-[calc(100%-3rem)] border px-2 border-neutral-300 overflow-scroll m-6 pb-[44px]">
        {messages.map((message, index) => (
          <div key={index} className="my-1">
            <ChatMessage
              message={message}
              messageIsStreaming={
                messageIsStreaming && index === messages.length - 1
              }
              redoMessage={redoMessage}
            />
          </div>
        ))}

        {loading && (
          <div className="my-1">
            <ChatLoader />
          </div>
        )}
        <div className="h-[162px] bg-white" ref={messagesEndRef} />

        <div className="absolute left-0 bottom-6 w-[calc(100%-3rem)] mx-6">
          <ChatInput onSend={onSend} onReset={onReset} />
        </div>
      </div>
    </div>
  );
};
