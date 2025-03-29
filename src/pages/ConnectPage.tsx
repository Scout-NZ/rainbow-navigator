import { useState } from "react";
import { MessageCircle, Plus, Search, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCard } from "@/components/groups/GroupCard";
import { ChatBot } from "@/components/ai/ChatBot";
import { mockGroups } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FriendData, FriendDetails } from "@/components/friends/FriendDetails";
import { useToast } from "@/hooks/use-toast";
import { ChatSession } from "@/components/chat/ChatSession";

type ChatContact = {
  id: string;
  name: string;
  imageUrl: string;
  status: "online" | "offline" | "none";
  lastMessage?: string;
  lastMessageTime?: string;
  isGroupChat?: boolean;
};

export default function ConnectPage() {
  const [filter, setFilter] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [friendFilter, setFriendFilter] = useState("");
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const { toast } = useToast();
  
  const friendSuggestions: FriendData[] = [
    { id: "f1", name: "Jamie Kim", imageUrl: "https://randomuser.me/api/portraits/women/1.jpg", status: "online", mutualGroups: 3 },
    { id: "f2", name: "Ray Garcia", imageUrl: "https://randomuser.me/api/portraits/men/2.jpg", status: "none", mutualGroups: 1 },
    { id: "f3", name: "Taylor Wong", imageUrl: "https://randomuser.me/api/portraits/women/3.jpg", status: "none", mutualGroups: 4 },
    { id: "f4", name: "Jordan Smith", imageUrl: "https://randomuser.me/api/portraits/men/4.jpg", status: "online", mutualGroups: 2 },
    { id: "f5", name: "Sam Rivera", imageUrl: "https://randomuser.me/api/portraits/women/5.jpg", status: "none", mutualGroups: 3 },
  ];
  
  const existingFriends: FriendData[] = [
    { id: "f6", name: "Riley Johnson", imageUrl: "https://randomuser.me/api/portraits/women/11.jpg", status: "online", mutualGroups: 2 },
    { id: "f7", name: "Casey Martinez", imageUrl: "https://randomuser.me/api/portraits/men/12.jpg", status: "offline", mutualGroups: 1 },
    { id: "f8", name: "Quinn Chen", imageUrl: "https://randomuser.me/api/portraits/women/13.jpg", status: "online", mutualGroups: 3 },
    { id: "f9", name: "Drew Patel", imageUrl: "https://randomuser.me/api/portraits/men/14.jpg", status: "offline", mutualGroups: 2 },
  ];
  
  const recentChats: ChatContact[] = [
    { 
      id: "chat1", 
      name: "Queer Book Club", 
      imageUrl: "https://randomuser.me/api/portraits/women/5.jpg", 
      status: "online",
      lastMessage: "Alex: When's our next meeting?",
      lastMessageTime: "2h ago",
      isGroupChat: true
    },
    { 
      id: "chat2", 
      name: "Jordan Smith", 
      imageUrl: "https://randomuser.me/api/portraits/men/4.jpg", 
      status: "offline",
      lastMessage: "Can we catch up next week?",
      lastMessageTime: "1d ago"
    },
    { 
      id: "chat3", 
      name: "Pride Youth Group", 
      imageUrl: "https://randomuser.me/api/portraits/women/3.jpg", 
      status: "none",
      lastMessage: "Riley: Thanks everyone for coming!",
      lastMessageTime: "3d ago",
      isGroupChat: true
    },
  ];

  const filteredGroups = mockGroups.filter(group => 
    group.name.toLowerCase().includes(filter.toLowerCase()) ||
    group.category.toLowerCase().includes(filter.toLowerCase()) ||
    group.description.toLowerCase().includes(filter.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  const filteredFriends = existingFriends.filter(friend => 
    friend.name.toLowerCase().includes(friendFilter.toLowerCase())
  );
  
  const handleConnectFriend = (friendId: string) => {
    const friend = friendSuggestions.find(f => f.id === friendId);
    if (friend) {
      toast({
        title: "Friend request sent",
        description: `Connection request sent to ${friend.name}`,
      });
    }
  };
  
  const handleSendMessage = (friendId: string) => {
    const friend = existingFriends.find(f => f.id === friendId) || 
                  friendSuggestions.find(f => f.id === friendId);
    
    if (friend) {
      const chatContact: ChatContact = {
        id: friend.id,
        name: friend.name,
        imageUrl: friend.imageUrl,
        status: friend.status,
      };
      
      setActiveChat(chatContact);
      
      toast({
        title: "Chat started",
        description: `Started a conversation with ${friend.name}`,
      });
    }
  };
  
  const handleOpenChat = (chat: ChatContact) => {
    setActiveChat(chat);
  };
  
  const handleBackFromChat = () => {
    setActiveChat(null);
  };
  
  const handleCreateNewChat = () => {
    toast({
      title: "New chat",
      description: "Please select a friend to start a new chat with",
    });
    document.getElementById("friendsTab")?.click();
  };
  
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Connect</h1>
        <Button 
          size="sm" 
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          onClick={() => setOpenCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>
      
      {activeChat ? (
        <ChatSession 
          contact={activeChat} 
          onBack={handleBackFromChat} 
        />
      ) : (
        <Tabs defaultValue="groups">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
            <TabsTrigger value="chats" className="flex-1">Chats</TabsTrigger>
            <TabsTrigger id="friendsTab" value="friends" className="flex-1">Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="mt-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search groups..." 
                className="pl-9"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Popular Groups</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setOpenCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chats" className="mt-0">
            {recentChats.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Start a conversation</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with friends, join group chats, or start a new conversation
                  </p>
                  <Button 
                    className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                    onClick={handleCreateNewChat}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Button 
                  className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                  onClick={handleCreateNewChat}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                
                <h3 className="text-sm font-medium mb-2 text-white">Recent Chats</h3>
                <div className="space-y-2">
                  {recentChats.map(chat => (
                    <Card 
                      key={chat.id} 
                      className="card-hover cursor-pointer" 
                      onClick={() => handleOpenChat(chat)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <AvatarWithStatus 
                          src={chat.imageUrl}
                          fallback={chat.name.charAt(0)}
                          status={chat.status}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">
                              {chat.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="friends" className="mt-0">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search friends..." 
                  className="pl-9"
                  value={friendFilter}
                  onChange={(e) => setFriendFilter(e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 text-white">Friend Suggestions</h3>
                <ScrollArea className="w-full whitespace-nowrap pb-4">
                  <div className="flex gap-3">
                    {friendSuggestions.map(friend => (
                      <HoverCard key={friend.id}>
                        <HoverCardTrigger asChild>
                          <Card className="card-hover min-w-[150px] cursor-pointer">
                            <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                              <AvatarWithStatus 
                                src={friend.imageUrl}
                                fallback={friend.name.charAt(0)}
                                size="lg"
                                status={friend.status}
                              />
                              <div>
                                <h4 className="font-medium text-sm">{friend.name}</h4>
                                <p className="text-xs text-muted-foreground">{friend.mutualGroups} mutual groups</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleConnectFriend(friend.id)}
                              >
                                <UserPlus className="h-3 w-3 mr-1" /> Connect
                              </Button>
                            </CardContent>
                          </Card>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <FriendDetails 
                            friend={friend} 
                            onSendMessage={handleSendMessage} 
                          />
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Your Friends</h3>
                  <span className="text-xs text-muted-foreground">{filteredFriends.length} shown</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {filteredFriends.map(friend => (
                    <Popover key={friend.id}>
                      <PopoverTrigger asChild>
                        <Card className="card-hover cursor-pointer">
                          <CardContent className="p-3 flex items-center gap-3">
                            <AvatarWithStatus 
                              src={friend.imageUrl}
                              fallback={friend.name.charAt(0)}
                              status={friend.status}
                            />
                            <div>
                              <h4 className="font-medium text-sm">{friend.name}</h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{friend.mutualGroups} groups</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <FriendDetails 
                          friend={friend} 
                          onSendMessage={handleSendMessage} 
                        />
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a New Group</DialogTitle>
          </DialogHeader>
          <CreateGroupForm onSuccess={() => setOpenCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
