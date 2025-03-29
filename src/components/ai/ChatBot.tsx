
import { useState, useRef, useEffect } from "react";
import { Send, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUserProfile } from "@/data/mockData";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Kia ora! I'm your Rainbow Navigator assistant. How can I help you today, mate?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Bot responses with NZ tone
  const botResponses = [
    { keywords: ["hello", "hi", "hey"], response: "Kia ora! How can I help you today, mate?" },
    { keywords: ["event", "events"], response: "Looking for some choice events? You can find upcoming LGBTQ+ events in the Events tab. Would you like me to recommend some that are sweet as?" },
    { keywords: ["resource", "resources", "help"], response: "We've got heaps of community resources available. Are you looking for healthcare, legal aid, housing support, or something else, whānau?" },
    { keywords: ["group", "community", "communities"], response: "Our Connect section has many community groups you can join, eh. What sorts of interests or support are you keen on?" },
    { keywords: ["business", "shop", "store"], response: "You can find LGBTQ+ friendly businesses in the Discover section. Want recommendations for a specific category? They're all good as gold." },
    { keywords: ["safe", "safety"], response: "Your safety is tumeke important. Rainbow Navigator only lists verified safe spaces. You can also check user reviews and ratings for a bit more peace of mind." },
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate bot thinking and then respond
    setTimeout(() => {
      // Find a matching response based on keywords
      const matchingResponse = botResponses.find(resp => 
        resp.keywords.some(keyword => 
          input.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // Default response if no keyword matches
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: matchingResponse 
          ? matchingResponse.response 
          : "I'm not quite sure how to help with that yet, but our whānau is always here to support you. Would you like to check out any specific sections of the app?",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-card border rounded-xl shadow-lg flex flex-col overflow-hidden z-40">
      <div className="p-3 bg-rainbow-gradient text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="/lovable-uploads/bd55a184-9d3b-4c0b-b50c-b212d4be16a8.png" />
            <AvatarFallback>RN</AvatarFallback>
          </Avatar>
          <span className="font-semibold">Tautoko Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-muted/20">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "bot" && (
              <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                <AvatarImage src="/lovable-uploads/bd55a184-9d3b-4c0b-b50c-b212d4be16a8.png" />
                <AvatarFallback>RN</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.sender === "user" && (
              <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                <AvatarImage src={mockUserProfile.imageUrl} />
                <AvatarFallback>{mockUserProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/lovable-uploads/bd55a184-9d3b-4c0b-b50c-b212d4be16a8.png" />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-3 bg-background border-t flex items-center gap-2">
        <Input 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className="bg-primary text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
