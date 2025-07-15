import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  avatar?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        !isAssistant && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        {message.avatar && <AvatarImage src={message.avatar} />}
        <AvatarFallback
          className={cn(
            isAssistant ? "bg-primary/10 text-primary" : "bg-muted"
          )}
        >
          {isAssistant ? (
            <Bot className="h-6 w-6" />
          ) : (
            <User className="h-6 w-6" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Balão da Mensagem */}
      <Card
        className={cn(
          "p-4 w-fit max-w-[80%]",
          isAssistant ? "bg-muted" : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </Card>
    </div>
  );
}
