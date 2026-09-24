'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, X, Send, Loader2, Sparkles, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendChatMessage, ChatMessage } from '@/services/aiService';

const QUICK_PROMPTS = [
  '¿Cuáles son mis suscripciones activas?',
  '¿Cuánto gastaré este mes?',
  '¿Cuál es mi servicio más caro?',
  'Dame consejos para ahorrar',
];

export function AIChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>('Ivan');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const publicRoutes = ['/login', '/register', '/'];
  if (publicRoutes.includes(pathname)) {
    return null;
  }

  // Cargar usuario y mensaje inicial
  const resetChat = (name: string = userName) => {
    setMessages([
      {
        role: 'assistant',
        content: `¡Hola, ${name}! 👋 Soy tu asistente de Subscrify. Pregúntame sobre tus gastos, cobros próximos o consejos de ahorro.`,
      },
    ]);
  };

  useEffect(() => {
    let name = 'Ivan';
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        name = parsed.name || parsed.firstName || parsed.email?.split('@')[0] || name;
      }
    } catch {
      // Fallback
    }

    setUserName(name);
    resetChat(name);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = (customMessage || input).trim();
    if (!messageToSend || isLoading) return;

    if (!customMessage) setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(messageToSend);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={line.trim().startsWith('*') ? 'pl-2 my-0.5' : 'my-1'}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-zinc-100">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón Flotante con efecto Glow */}
      {!isOpen && (
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 shadow-2xl border border-zinc-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-6 h-6 text-zinc-950 fill-zinc-950" />
          </Button>
        </div>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div
          className={`rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-200 ${
            isExpanded
              ? 'w-[580px] h-[720px] max-h-[85vh]'
              : 'w-[440px] h-[580px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  Subscrify AI{' '}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">Asistente financiero personal</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Reiniciar chat"
                className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 rounded-lg"
                onClick={() => resetChat()}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title={isExpanded ? 'Reducir' : 'Expandir'}
                className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-zinc-300">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-zinc-100 text-zinc-950 font-medium rounded-br-xs text-xs'
                      : 'bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 rounded-bl-xs text-xs space-y-1'
                  }`}
                >
                  {msg.role === 'user' ? msg.content : formatText(msg.content)}
                </div>
              </div>
            ))}

            {/* Sugerencias si solo está el mensaje inicial */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-medium text-zinc-500">Preguntas sugeridas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/90 border border-zinc-800/80 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-2.5 text-zinc-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-200" />
                  <span>Analizando tus suscripciones...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-900/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Pregunta algo sobre tus suscripciones..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-9 w-9 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}