import { useState, useRef, useEffect } from "react";
import { Bot, Send, CornerDownLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChatMessage,
  type Message,
} from "@/components/organisms/assistant/chat-message";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá! Eu sou seu assistente de IA. Como posso ajudar você a organizar seus estudos hoje?",
  },
];

const suggestionPrompts = [
  "Crie um plano de estudos para a próxima semana.",
  "Quais são as minhas tarefas mais urgentes?",
  "Resuma minhas anotações sobre 'Cálculo I'.",
  "Me ajude a focar por 25 minutos.",
];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (isLoading || !content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulação de resposta da IA
    setTimeout(() => {
      const assistantResponse: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Recebi sua mensagem: "${content}". No momento, estou em desenvolvimento, mas em breve poderei processar seu pedido.`,
      };
      setMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);

    setInput("");
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="p-4 md:p-4 flex flex-col h-full max-h-[calc(100vh-100px)]">
      {/* Header da Página */}
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          Assistente IA
        </h1>
        <p className="text-muted-foreground">
          Faça perguntas, peça resumos e organize suas tarefas com ajuda da IA.
        </p>
      </header>

      {/* Área do Chat */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Histórico de Mensagens */}
          <CardContent
            ref={scrollAreaRef}
            className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Bot className="h-6 w-6" />
                </div>
                <Card className="p-4 bg-muted w-fit max-w-[80%]">
                  <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                </Card>
              </div>
            )}
          </CardContent>

          {/* Sugestões de Prompts (visível apenas se não houver muitas mensagens) */}
          {!isLoading && messages.length <= 1 && (
            <div className="p-4 border-t grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestionPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}

          {/* Área de Input */}
          <div className="border-t p-4 flex-shrink-0 bg-background">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="Digite sua mensagem ou pergunta..."
                className="pr-24 min-h-[52px] resize-none"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSendMessage(input)}
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar</span>
                </Button>
                <div className="text-xs text-muted-foreground hidden md:block">
                  <CornerDownLeft className="inline h-3 w-3 mr-1" />
                  Enviar
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
