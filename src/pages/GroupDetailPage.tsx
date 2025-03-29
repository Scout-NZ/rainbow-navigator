
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Lock, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockGroups } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const group = mockGroups.find(g => g.id === groupId);
  
  if (!group) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Group Not Found</h1>
        <Button onClick={() => navigate("/connect")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Connect
        </Button>
      </div>
    );
  }

  const handleJoinGroup = () => {
    console.log("Joining group:", group.name);
    
    // In a real app, this would be an API call to join the group
    toast({
      title: "Group joined!",
      description: `You have successfully joined ${group.name}`,
    });
  };
  
  return (
    <div className="pb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 text-white"
        onClick={() => navigate("/connect")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      
      <div 
        className="h-48 md:h-64 rounded-lg bg-muted bg-cover bg-center relative mb-4"
        style={{ 
          backgroundImage: group.imageUrl 
            ? `url(${group.imageUrl})` 
            : undefined 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg"></div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-background/80">
              {group.category}
            </Badge>
            {group.isPrivate && (
              <span className="flex items-center gap-1 text-white text-xs bg-black/60 px-2 py-1 rounded">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">{group.name}</h1>
          <div className="flex items-center text-white/80 text-sm mt-1">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.memberCount} members</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {group.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
        <Button 
          className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          onClick={handleJoinGroup}
        >
          Join Group
        </Button>
      </div>
      
      <Tabs defaultValue="about">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          <TabsTrigger value="discussions" className="flex-1">Discussions</TabsTrigger>
          <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-0 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Description</h3>
              <p className="text-muted-foreground">{group.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Group Rules</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Be respectful and kind to other members</li>
                <li>No hate speech or discriminatory content</li>
                <li>Keep discussions relevant to the group's purpose</li>
                <li>Respect privacy and confidentiality</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussions" className="mt-0">
          <Card className="text-center p-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-white mb-2">Join the conversation</h3>
            <p className="text-muted-foreground mb-4">
              Join this group to participate in discussions
            </p>
            <Button 
              className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
              onClick={handleJoinGroup}
            >
              Join Group
            </Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          <Card className="text-center p-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-white mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-4">
              There are no upcoming events for this group
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="members" className="mt-0 space-y-4">
          <h3 className="text-sm font-medium text-white">Members ({group.memberCount})</h3>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-3 flex items-center gap-3">
                  <AvatarWithStatus 
                    src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`}
                    fallback={`Member ${i + 1}`}
                    status={i % 3 === 0 ? "online" : "offline"}
                  />
                  <div>
                    <h4 className="font-medium text-sm text-white">
                      {i === 0 ? "Alex Chen (Admin)" : `Member ${i + 1}`}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {i === 0 ? "Since Oct 2023" : "Joined recently"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
