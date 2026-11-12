import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, HobbyMate, HobbyPlan } from '../types';
import { Send, Sparkles, MessageCircle, Users, X, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: HobbyPlan;
  selectedMateForChat: HobbyMate | null;
  onClearSelectedMate: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  activePlan,
  selectedMateForChat,
  onClearSelectedMate,
}) => {
  const [activeChannel, setActiveChannel] = useState<'coach' | 'tribe' | 'direct'>(
    selectedMateForChat ? 'direct' : 'coach'
  );

  useEffect(() => {
    if (selectedMateForChat) {
      setActiveChannel('direct');
    }
  }, [selectedMateForChat]);

  // Initial messages state
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    coach: [
      {
        id: 'msg-c1',
        sender: 'coach',
        senderName: 'Pulse Coach',
        content: `Hey! Excited to help you master ${activePlan.hobbyName}. You only need 15 minutes today to make real progress. What's on your mind?`,
        timestamp: 'Just now',
      },
    ],
    tribe: [
      {
        id: 'msg-t1',
        sender: 'mate',
        senderName: 'Clara Tan',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        content: 'Just finished my 15-min soap water drill at Bugis CC! The vortex is so much cleaner now. Anyone practicing nearby?',
        timestamp: '12m ago',
      },
      {
        id: 'msg-t2',
        sender: 'mate',
        senderName: 'Marcus Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        content: 'I’m at the 5th floor terrace of National Library till 6pm sketching with pocket watercolor. Shady tables are open!',
        timestamp: '5m ago',
      },
    ],
    direct: selectedMateForChat
      ? [
          {
            id: 'msg-d1',
            sender: 'mate',
            senderName: selectedMateForChat.name,
            senderAvatar: selectedMateForChat.avatar,
            content: `Hey there! Saw you're also practicing on the live map. I'm doing the "${selectedMateForChat.currentDrill}". Let me know if you want to swap quick tips!`,
            timestamp: 'Just now',
          },
        ]
      : [],
  });

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  const currentChannelMessages =
    activeChannel === 'direct' && selectedMateForChat
      ? messages.direct
      : messages[activeChannel] || [];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isSending) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };

    const channelKey = activeChannel === 'direct' ? 'direct' : activeChannel;
    setMessages((prev) => ({
      ...prev,
      [channelKey]: [...(prev[channelKey] || []), userMsg],
    }));

    if (activeChannel === 'coach') {
      setIsSending(true);
      try {
        const response = await fetch('/api/coach-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...(messages.coach || []), userMsg].map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.content,
            })),
            currentHobby: activePlan.hobbyName,
            currentStep: activePlan.chapters.find((c) => !c.completed)?.title || 'Chapter 3',
          }),
        });

        const data = await response.json();
        const replyText =
          data.reply ||
          "Great step! Even 15 minutes today creates lasting muscle memory. Check the live radar map to see if Clara or Marcus are nearby to practice together!";

        setMessages((prev) => ({
          ...prev,
          coach: [
            ...prev.coach,
            {
              id: `coach-${Date.now()}`,
              sender: 'coach',
              senderName: 'Pulse Coach',
              content: replyText,
              timestamp: 'Just now',
            },
          ],
        }));
      } catch (err) {
        setMessages((prev) => ({
          ...prev,
          coach: [
            ...prev.coach,
            {
              id: `coach-${Date.now()}`,
              sender: 'coach',
              senderName: 'Pulse Coach',
              content: "You're doing great! Keep your focus on today's 15-minute drill. Don't worry about perfection right now—muscle memory takes 3 to 4 short reps to lock in.",
              timestamp: 'Just now',
            },
          ],
        }));
      } finally {
        setIsSending(false);
      }
    } else if (activeChannel === 'direct' && selectedMateForChat) {
      // Simulate friendly reply from local HobbyMate
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          direct: [
            ...prev.direct,
            {
              id: `mate-${Date.now()}`,
              sender: 'mate',
              senderName: selectedMateForChat.name,
              senderAvatar: selectedMateForChat.avatar,
              content: `Awesome! That drill helped me so much last week. Drop by the shared table if you're nearby, or ping me when you knock out today's milestone! 🙌`,
              timestamp: 'Just now',
            },
          ],
        }));
      }, 1200);
    } else if (activeChannel === 'tribe') {
      // Community channel response
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          tribe: [
            ...prev.tribe,
            {
              id: `mate-${Date.now()}`,
              sender: 'mate',
              senderName: 'Clara Tan',
              senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
              content: `Awesome progress! Love seeing our cohort staying consistent! Let's get that Chapter 4 badge together.`,
              timestamp: 'Just now',
            },
          ],
        }));
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white border-l border-[#E4E8EF] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#E4E8EF] flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-[#171C21]">
              Organic Chat & Mentoring
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#57F287]" />
          </div>
          <p className="text-xs text-[#454655]">
            Simple, low-friction advice without info overload
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-[#767686] hover:text-[#171C21] rounded-full hover:bg-[#F0F4FA] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Channel Switcher */}
      <div className="px-4 py-2.5 bg-[#F7F9FF] border-b border-[#E4E8EF] flex items-center gap-1.5">
        <button
          onClick={() => setActiveChannel('coach')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeChannel === 'coach'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-[#454655] hover:bg-[#E4E8EF]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Pulse AI Coach</span>
        </button>

        <button
          onClick={() => setActiveChannel('tribe')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeChannel === 'tribe'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-[#454655] hover:bg-[#E4E8EF]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>#tribe-commons</span>
        </button>

        {selectedMateForChat && (
          <button
            onClick={() => setActiveChannel('direct')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeChannel === 'direct'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-[#454655] hover:bg-[#E4E8EF]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#57F287]" />
            <span className="truncate max-w-[90px]">{selectedMateForChat.name}</span>
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F9FF]">
        {currentChannelMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {!isUser && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-[#5865F2]" />
                  )}
                  <span className="text-[11px] font-bold text-[#171C21]">
                    {msg.senderName || 'Pulse Coach'}
                  </span>
                  <span className="text-[10px] text-[#767686]">· {msg.timestamp}</span>
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#5865F2] text-white rounded-tr-xs shadow-sm shadow-[#5865F2]/20'
                    : 'bg-white text-[#171C21] rounded-tl-xs border border-[#E4E8EF] shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {isUser && (
                <span className="text-[10px] text-[#767686] mt-1 mr-1">
                  {msg.timestamp}
                </span>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#5865F2] italic p-2 bg-white rounded-xl border border-[#E4E8EF] w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Pulse Coach is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips for Zero-Friction Chat */}
      {activeChannel === 'coach' && (
        <div className="px-4 py-2 bg-white border-t border-[#E4E8EF] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            "Today's 15-min drill?",
            "What starter gear to avoid?",
            "Why is my foam too stiff?",
            "How to find nearby mates?",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F0F4FA] text-[#2E3338] hover:bg-[#E4E8EF] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-[#E4E8EF]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeChannel === 'coach'
                ? 'Ask Pulse Coach anything about your 15m drill...'
                : activeChannel === 'tribe'
                ? 'Share a tip or coordinate a table...'
                : `Message ${selectedMateForChat?.name}...`
            }
            className="flex-1 px-4 py-2.5 rounded-full bg-[#EBEDEF]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5865F2] text-xs md:text-sm text-[#171C21] placeholder-[#4E5058] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shadow-[#5865F2]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
