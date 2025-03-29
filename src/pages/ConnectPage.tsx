import { useState } from "react";
import { Search, Plus, Users, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupCard } from "@/components/groups/GroupCard";
import { mockGroups, mockUsers } from "@/data/mockData";

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredGroups = mockGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="pb-4">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search communities and people..." 
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="groups" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="groups" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="people" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            People
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Popular Communities</h2>
            <Button 
              size="sm"
              className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Popular groups */}
            {filteredGroups.slice(0, 4).map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          
          <h2 className="text-lg font-semibold mb-4">All Communities</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} isCompact />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="people" className="mt-0">
          {/* People tab content */}
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="card-hover">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge variant="outline" className="ml-2">{user.pronouns}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
                    <div className="flex gap-1 mt-1">
                      {user.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{interest}</Badge>
                      ))}
                      {user.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{user.interests.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">Connect</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
