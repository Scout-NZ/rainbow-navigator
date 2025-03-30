
import { useState, useRef, useEffect } from "react";
import { Send, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUserProfile } from "@/data/mockData";
import { mockResources } from "@/data/mockData";

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

  // App content for the AI to search through
  const appContent = {
    resources: mockResources,
    events: [
      { id: 1, title: "Pride Parade", date: "2023-07-15", location: "Auckland CBD", description: "Annual Pride Parade celebrating the LGBTQ+ community." },
      { id: 2, title: "Rainbow Youth Workshop", date: "2023-07-20", location: "Wellington", description: "Workshop for LGBTQ+ youth focusing on mental health and wellbeing." },
      { id: 3, title: "Trans Support Group", date: "2023-07-25", location: "Christchurch", description: "Monthly support group for transgender individuals." }
    ],
    commonQuestions: {
      "what is rainbow navigator": "Rainbow Navigator is a vibrant, user-friendly queer community hub designed to connect LGBTQ+ individuals with safe spaces, events, community groups, and essential resources throughout New Zealand.",
      "how do i find resources": "You can find resources by going to the Resources tab where you'll see categories like Healthcare, Legal, Housing, and more. You can filter by category or type to find what you need.",
      "how do i join a community group": "Head to the Connect section where you'll find various community groups. You can browse, view details, and join groups that interest you.",
      "where can i find lgbtq friendly healthcare": "In the Resources section, select the Healthcare category and you'll see a list of LGBTQ+ friendly healthcare providers across New Zealand.",
      "is my data safe": "Sweet as! Your privacy is tumeke important to us. We only collect information needed to provide our services and never share your personal data with third parties without your consent."
    }
  };

  // Advanced search function to find relevant content in the app
  const searchAppContent = (query: string) => {
    query = query.toLowerCase();
    let results = [];
    
    // First check if we have a direct answer to the question
    for (const [question, answer] of Object.entries(appContent.commonQuestions)) {
      if (query.includes(question) || question.includes(query)) {
        return {
          type: "direct_answer",
          content: answer
        };
      }
    }
    
    // Search resources
    const resourceMatches = appContent.resources.filter(resource => 
      resource.title.toLowerCase().includes(query) || 
      resource.description.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query)
    );
    
    if (resourceMatches.length > 0) {
      results.push({
        type: "resources",
        items: resourceMatches.slice(0, 3),
        content: `I found ${resourceMatches.length} resources that might help you. Here are a few: ${resourceMatches.slice(0, 3).map(r => r.title).join(", ")}. You can find these in the Resources section.`
      });
    }
    
    // Search events
    const eventMatches = appContent.events.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
    
    if (eventMatches.length > 0) {
      results.push({
        type: "events",
        items: eventMatches,
        content: `There are ${eventMatches.length} events that match your query: ${eventMatches.map(e => e.title).join(", ")}. Check them out in the Events section.`
      });
    }
    
    if (results.length > 0) {
      return results;
    }
    
    // NZ-flavored responses with Māori words for common topics
    if (query.includes("healthcare") || query.includes("doctor") || query.includes("medical")) {
      return {
        type: "topic_response",
        content: "For hauora (health) services, we've got heaps of LGBTQ+ friendly healthcare providers listed in our Resources tab. You can filter by 'Healthcare' to find GPs, mental health professionals, and sexual health clinics across Aotearoa."
      };
    }
    
    if (query.includes("legal") || query.includes("lawyer") || query.includes("rights")) {
      return {
        type: "topic_response",
        content: "Looking for ture (legal) help? Our Resources section has a category for legal services where you can find LGBTQ+ friendly lawyers and legal aid. They can help with name changes, discrimination issues, and other legal matters, eh."
      };
    }
    
    if (query.includes("mental health") || query.includes("depression") || query.includes("anxiety")) {
      return {
        type: "topic_response",
        content: "Your hinengaro (mental wellbeing) is important to our whānau. We have mental health resources in the Resources section, and community support groups in the Connect section. If it's urgent, check out the Emergency tab in Resources for crisis support lines."
      };
    }
    
    // Default response if no matches found
    return {
      type: "no_results",
      content: "I'm not quite sure how to help with that yet, but our whānau is always here to support you. Would you like to check out any specific sections of the app like Resources, Events, or Connect?"
    };
  };

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
    
    // Process the query and generate a response
    setTimeout(() => {
      const searchResults = searchAppContent(input);
      let botResponse = "";
      
      if (Array.isArray(searchResults)) {
        // Multiple result types
        botResponse = "Kia ora! " + searchResults.map(result => result.content).join(" Also, ");
      } else {
        // Single result type
        botResponse = searchResults.content;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
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
                <AvatarImage src={mockUserProfile.avatar} />
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
