import { useState } from "react";
import { MessageCircle, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCard } from "@/components/groups/GroupCard";
import { ChatBot } from "@/components/ai/ChatBot";
import { mockGroups } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";

export default function ConnectPage() {
  const [filter, setFilter] = useState("");
  
  const filteredGroups = mockGroups.filter(group => 
    group.name.toLowerCase().includes(filter.toLowerCase()) ||
    group.category.toLowerCase().includes(filter.toLowerCase()) ||
    group.description.toLowerCase().includes(filter.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );
  
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Connect</h1>
        <Button 
          size="sm" 
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>
      
      <Tabs defaultValue="groups">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
          <TabsTrigger value="chats" className="flex-1">Chats</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
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
            <Button variant="outline" size="sm">
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
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Start a conversation</h3>
              <p className="text-muted-foreground mb-4">
                Connect with friends, join group chats, or start a new conversation
              </p>
              <Button className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-white">Recent Chats</h3>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-3 flex items-center gap-3">
                    <AvatarWithStatus 
                      src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 5}.jpg`}
                      fallback={`User ${i}`}
                      status={i === 1 ? "online" : "offline"}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm truncate">
                          {i === 1 ? "Queer Book Club" : `User ${i}`}
                        </h4>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {i === 1 
                          ? "Alex: When's our next meeting?" 
                          : "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="friends" className="mt-0">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search friends..." 
                className="pl-9"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-white">Friend Suggestions</h3>
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Card key={i} className="card-hover min-w-[150px]">
                      <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                        <AvatarWithStatus 
                          src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i}.jpg`}
                          fallback={`Friend ${i}`}
                          size="lg"
                          status={i % 3 === 0 ? "online" : "none"}
                        />
                        <div>
                          <h4 className="font-medium text-sm">Jamie Kim</h4>
                          <p className="text-xs text-muted-foreground">3 mutual groups</p>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          <Plus className="h-3 w-3 mr-1" /> Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-white">Your Friends</h3>
                <span className="text-xs text-muted-foreground">12 total</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="card-hover">
                    <CardContent className="p-3 flex items-center gap-3">
                      <AvatarWithStatus 
                        src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 10}.jpg`}
                        fallback={`Friend ${i}`}
                        status={i % 2 === 0 ? "online" : "offline"}
                      />
                      <div>
                        <h4 className="font-medium text-sm">Alex Chen</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          <span>2 groups</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
