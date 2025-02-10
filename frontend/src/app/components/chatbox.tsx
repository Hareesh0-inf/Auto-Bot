import Markdown from "markdown-to-jsx";

export default function ChatBox({ messages }: { messages: { role: string; content: string }[] }) {
    return (
      <>
      <div className="p-4 h-max overflow-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'assistant' ? 'text-left' : 'text-right'
            }`}
          >
            <div
              className="chat"
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
      </div></>
    );
  }
  