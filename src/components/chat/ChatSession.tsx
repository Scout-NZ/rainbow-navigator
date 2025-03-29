
import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { useUser } from "@/contexts/UserContext";

type Message = {
  id: string;
  content: string;
  sender: "user" | "contact";
  timestamp: Date;
  imageUrl?: string;
};

type ChatContact = {
  id: string;
  name: string;
  imageUrl: string;
  status: "online" | "offline" | "none";
  lastMessage?: string;
  lastMessageTime?: string;
  isGroupChat?: boolean;
};

interface ChatSessionProps {
  contact: ChatContact;
  onBack: () => void;
}

export function ChatSession({ contact, onBack }: ChatSessionProps) {
  const { userProfile } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: contact.isGroupChat 
        ? `Welcome to the ${contact.name} group!` 
        : `Kia ora! This is the start of your conversation with ${contact.name}.`,
      sender: "contact",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() && !imagePreview) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      imageUrl: imagePreview || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Simulate reply after a short delay
    setTimeout(() => {
      let replyContent = "";
      
      // Generate different replies based on the group or person
      if (contact.isGroupChat) {
        if (contact.name === "Queer Book Club") {
          replyContent = "Hey team, shall we decide on our next book? I'm keen on 'Gideon the Ninth'!";
        } else {
          replyContent = "Thanks for your message! Someone will respond soon.";
        }
      } else {
        const responses = [
          "Sweet as! I'll get back to you soon.",
          "Chur, thanks for reaching out.",
          "Tu meke! I appreciate your message.",
          "Yeah, nah, I'm pretty busy but I'll make time.",
          "That sounds choice! Let's catch up soon.",
        ];
        replyContent = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const contactMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: replyContent,
        sender: "contact",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, contactMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-3 bg-muted/30 flex items-center gap-2 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <AvatarWithStatus 
          src={contact.imageUrl}
          fallback={contact.name.charAt(0)}
          status={contact.status}
        />
        <div>
          <h3 className="font-medium text-sm">{contact.name}</h3>
          <span className="text-xs text-muted-foreground">
            {contact.status === "online" ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "contact" && (
              <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                <AvatarImage src={contact.imageUrl} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content && <p className="text-sm">{message.content}</p>}
              {message.imageUrl && (
                <div className={`mt-2 ${message.content ? "mt-2" : "mt-0"}`}>
                  <img 
                    src={message.imageUrl} 
                    alt="Shared image" 
                    className="rounded-md max-h-60 w-auto" 
                  />
                </div>
              )}
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.sender === "user" && (
              <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                <AvatarImage src={userProfile.imageUrl} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        <div ref={endOfMessagesRef} />
      </CardContent>
      
      <div className="p-3 bg-background border-t">
        {imagePreview && (
          <div className="relative mb-2">
            <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-cover rounded-md" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <Input 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!input.trim() && !imagePreview}
            className="bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
