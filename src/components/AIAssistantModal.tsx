import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, User, ShieldAlert, Mountain } from 'lucide-react';
import { getGeneralConciergeWhatsAppUrl } from '../utils/whatsapp';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content:
        'Greetings from Titan Shilajit. I am your Himalayan Wellness Consultant. How may I assist you with our pure Shilajit resin, honey sticks, or daily morning routine?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/wellness-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.reply || 'Thank you for your inquiry. For specific order assistance, feel free to message our Delhi concierge on WhatsApp.' },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Our wellness team is currently assisting other practitioners. You can reach our Delhi concierge directly on WhatsApp at +91 99584 74229 for instant assistance.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How do I dissolve the Resin in morning water?',
    'What are the 3 Honey Stick flavors?',
    'How long does a 20g jar last?',
    'What makes Himalayan Shilajit pure?',
  ];

  return (
    <div
      id="ai-advisor-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#10110F]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-advisor-modal-card"
        className="w-full max-w-2xl bg-[#F7F3E8] rounded-sm shadow-2xl overflow-hidden border border-[#B88A32]/40 flex flex-col h-[620px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#10110F] text-[#F7F3E8] p-4 px-6 border-b border-[#B88A32]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#183D27] text-[#D4B66A] border border-[#B88A32]/40 flex items-center justify-center">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wider text-[#F7F3E8]">
                  TITAN WELLNESS ADVISOR
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-[#D4B66A] tracking-widest uppercase font-sans">
                Ayurvedic Formulations &amp; Himalayan Product Guidance
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close advisor"
            className="p-1.5 rounded-full text-[#EEE8D7]/70 hover:text-[#F7F3E8] hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety banner */}
        <div className="bg-[#183D27]/10 border-b border-[#183D27]/20 px-4 py-2 flex items-center gap-2 text-[11px] text-[#183D27]">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>General wellness education only. Not medical advice. For diagnoses or medications, please consult your doctor.</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F7F3E8]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-[#10110F] text-[#F7F3E8]'
                    : 'bg-[#183D27] text-[#D4B66A] border border-[#B88A32]/40'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Mountain className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-sm text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#10110F] text-[#F7F3E8]'
                    : 'bg-[#EEE8D7] text-[#10110F] border border-[#10110F]/10'
                }`}
              >
                <p className="whitespace-pre-line font-sans">{m.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#183D27] text-[#D4B66A] flex items-center justify-center">
                <Mountain className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-[#EEE8D7] p-3 rounded-sm text-xs text-[#66704B] italic">
                Formulating Himalayan wellness insights...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Sample Questions */}
        <div className="px-4 py-2 bg-[#EEE8D7]/60 border-t border-[#10110F]/10 flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-xs bg-white/70 hover:bg-[#183D27] hover:text-[#F7F3E8] text-[#10110F] border border-[#10110F]/10 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form & WhatsApp Direct Bridge */}
        <div className="p-4 bg-[#F7F3E8] border-t border-[#10110F]/10 flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Shilajit purity, dosage timing, flavors..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xs bg-white border border-[#10110F]/20 text-xs sm:text-sm text-[#10110F] focus:outline-none focus:border-[#B88A32]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="p-2.5 rounded-xs bg-[#10110F] hover:bg-[#183D27] text-[#F7F3E8] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#66704B] pt-1">
            <span>Need direct concierge assistance?</span>
            <a
              href={getGeneralConciergeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#183D27] font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Concierge (+91 99584 74229)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
