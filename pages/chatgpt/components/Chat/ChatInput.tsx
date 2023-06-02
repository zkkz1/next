// import { IconArrowUp } from "@tabler/icons-react";
import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SendOutlined, ClearOutlined } from "@ant-design/icons";
import { IPrompt, PromptList } from "./PromptList";

interface Props {
  onSend: (message: IMessage) => void;
  onReset: () => void;
}

const prompts = [
  {
    id: "JavaScript",
    name: "Act as a JavaScript Console",
    content:
      "I want you to act as a javascript console. I will type commands and you will reply with what the javascript console should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. when I need to tell you something in english, I will do so by putting text inside curly brackets {like this}. My first command is console.log(“Hello World”);",
  },
  {
    id: "Travel",
    name: "Act as a Travel Guide",
    content:
      "I want you to act as a travel guide. I will write you my location and you will suggest a place to visit near my location. In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location. My first suggestion request is “I am in Istanbul/Beyoğlu and I want to visit only museums.”",
  },
  {
    id: "Storyteller",
    name: "Act as a Storyteller",
    content:
      "I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people’s attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if it’s children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is “I need an interesting story on perseverance.”",
  },
];

export const ChatInput: FC<Props> = ({ onSend, onReset }) => {
  const [content, setContent] = useState<string>();
  const [showPromptList, setShowPromptList] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptListRef = useRef<HTMLUListElement | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase())
  );

  const handlePromptSelect = (prompt: IPrompt) => {
    setContent((prevContent) => {
      const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content);
      return updatedContent;
    });
    updatePromptListVisibility(prompt.content);
  };

  const updatePromptListVisibility = useCallback((text: string) => {
    const match = text.match(/\/\w*$/);

    if (match) {
      setShowPromptList(true);
      setPromptInputValue(match[0].slice(1));
    } else {
      setShowPromptList(false);
      setPromptInputValue("");
    }
  }, []);

  const handleInitModal = () => {
    const selectedPrompt = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,
          selectedPrompt.content
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
    }
    setShowPromptList(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPromptList) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === "Tab") {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleInitModal();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowPromptList(false);
      } else {
        setActivePromptIndex(0);
      }
    } else if (e.key === "Enter" && !isTyping && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
    updatePromptListVisibility(value);
  };

  const handleSend = () => {
    if (!content) {
      alert("Please enter a message");
      return;
    }
    onSend({ role: "user", content });
    setContent("");
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    if (promptListRef.current) {
      promptListRef.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        promptListRef.current &&
        !promptListRef.current.contains(e.target as Node)
      ) {
        setShowPromptList(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative flex border border-neutral-300 bg-white items-end">
      <button onClick={onReset} className="mx-2 my-1">
        <ClearOutlined className="flex justify-center items-center h-8 w-8 hover:cursor-pointer rounded-full border hover:opacity-80" />
      </button>
      <textarea
        ref={textareaRef}
        className="min-h-[44px] pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300"
        style={{ resize: "none" }}
        placeholder="输入信息，“/”打开模版"
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
      />

      <button onClick={handleSend} className="mx-2 my-1">
        <SendOutlined className="flex justify-center items-center h-8 w-8 hover:cursor-pointer rounded-full bg-blue-500 text-white hover:opacity-80" />
      </button>
      {showPromptList && filteredPrompts.length > 0 && (
        <div className="absolute bottom-12 w-full">
          <PromptList
            activePromptIndex={activePromptIndex}
            prompts={filteredPrompts}
            onSelect={handleInitModal}
            onMouseOver={setActivePromptIndex}
            promptListRef={promptListRef}
          />
        </div>
      )}
    </div>
  );
};
