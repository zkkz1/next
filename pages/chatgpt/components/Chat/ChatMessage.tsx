import { FC } from "react";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MemoizedReactMarkdown } from "../Markdown/MemoizedReactMarkdown";
import { CodeBlock } from "../Markdown/CodeBlock";
import { EditOutlined, RedoOutlined } from "@ant-design/icons";

interface Props {
  message: IMessage;
  messageIsStreaming: boolean;
  redoMessage: (message: IMessage) => void;
}

export const ChatMessage: FC<Props> = ({
  message,
  messageIsStreaming,
  redoMessage,
}) => {
  return (
    <div
      className={`flex justify-between ${
        message.role === "user" ? "flex-row-reverse" : "flex-row"
      } items-center group`}
    >
      {message.role === "user" ? (
        <div
          className={`flex items-center 
               bg-blue-500 text-white
           rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
          style={{ overflowWrap: "anywhere" }}
        >
          {message.content}
        </div>
      ) : (
        <div
          className={`flex items-center  bg-neutral-200 text-neutral-900 
          rounded-2xl px-3 py-2 max-w-[90%] whitespace-pre-wrap`}
          style={{ overflowWrap: "anywhere" }}
        >
          <MemoizedReactMarkdown
            className="prose dark:prose-invert flex-1"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeMathjax]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == "▍") {
                    return (
                      <span className="animate-pulse cursor-default mt-1">
                        ▍
                      </span>
                    );
                  }

                  children[0] = (children[0] as string).replace("`▍`", "▍");
                }

                const match = /language-(\w+)/.exec(className || "");

                return !inline ? (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                    {children}
                  </table>
                );
              },
              th({ children }) {
                return (
                  <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="break-words border border-black px-3 py-1 dark:border-white">
                    {children}
                  </td>
                );
              },
            }}
          >
            {`${message.content}${messageIsStreaming ? "`▍`" : ""}`}
          </MemoizedReactMarkdown>
        </div>
      )}

      <div
        className="cursor-pointer invisible group-hover:visible  mx-4"
        onClick={() => redoMessage(message)}
      >
        {message.role === "assistant" && !messageIsStreaming && (
          <RedoOutlined className="flex items-center justify-center h-8 w-8 rounded-full border hover:opacity-80" />
        )}
      </div>
    </div>
  );
};
