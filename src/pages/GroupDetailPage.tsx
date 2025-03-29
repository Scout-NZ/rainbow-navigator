
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Lock, MessageCircle, Users, UserPlus, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockGroups, mockUserProfile } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

// Add an interface for discussion messages
interface DiscussionMessage {
  id: string;
  userId: string;
  userImageUrl: string;
  userName: string;
  content: string;
  createdAt: string;
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinGroup, leaveGroup, isGroupMember, isGroupAdmin, currentUser } = useUser();
  const [discussionMessage, setDiscussionMessage] = useState("");
  const [discussions, setDiscussions] = useState<DiscussionMessage[]>([]);
  
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

  const isMember = isGroupMember(group.id);
  const isAdmin = isGroupAdmin(group.id);

  const handleJoinGroup = () => {
    console.log("Joining group:", group.name);
    
    joinGroup(group.id);
    
    toast({
      title: "Group joined!",
      description: `You have successfully joined ${group.name}`,
    });
  };

  const handleLeaveGroup = () => {
    console.log("Leaving group:", group.name);
    
    leaveGroup(group.id);
    
    toast({
      title: "Group left",
      description: `You have left ${group.name}`,
    });
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discussionMessage.trim()) return;
    
    // Create a new message object
    const newMessage: DiscussionMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userImageUrl: mockUserProfile.imageUrl,
      userName: mockUserProfile.name,
      content: discussionMessage,
      createdAt: new Date().toISOString(),
    };
    
    // Add the new message to the discussions array
    setDiscussions([...discussions, newMessage]);
    
    toast({
      title: "Message sent",
      description: "Your message has been posted to the group discussion",
    });
    
    setDiscussionMessage("");
  };

  // Function to format time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
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
            {isAdmin && (
              <span className="flex items-center gap-1 text-white text-xs bg-yellow-500/80 px-2 py-1 rounded">
                <Crown className="h-3 w-3" /> Admin
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
        <div className="flex gap-2 flex-wrap">
          {group.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
        {isMember ? (
          <Button 
            variant="outline"
            className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
            onClick={handleLeaveGroup}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Group
          </Button>
        ) : (
          <Button 
            className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
            onClick={handleJoinGroup}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join Group
          </Button>
        )}
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
          {isMember ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <form onSubmit={handleSubmitMessage}>
                    <h3 className="font-semibold text-white mb-2">Add to the discussion</h3>
                    <Textarea 
                      className="w-full"
                      placeholder="Share your thoughts with the group..."
                      value={discussionMessage}
                      onChange={(e) => setDiscussionMessage(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      className="mt-2 bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                    >
                      Post Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {discussions.length > 0 ? (
                <div className="space-y-3">
                  {discussions.map((message) => (
                    <Card key={message.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AvatarWithStatus 
                            src={message.userImageUrl} 
                            fallback={message.userName} 
                            status="online"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold text-sm">{message.userName}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Be the first to start a discussion!</p>
                </div>
              )}
            </div>
          ) : (
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
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          <Card className="text-center p-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-white mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-4">
              There are no upcoming events for this group
            </p>
            {isAdmin && (
              <Button 
                className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
              >
                Create Event
              </Button>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="members" className="mt-0 space-y-4">
          <h3 className="text-sm font-medium text-white">Members ({group.memberCount})</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Only show the current user as a member if they've joined */}
            {isMember && (
              <Card className="card-hover">
                <CardContent className="p-3 flex items-center gap-3">
                  <AvatarWithStatus 
                    src={mockUserProfile.imageUrl}
                    fallback={mockUserProfile.name}
                    status="online"
                  />
                  <div>
                    <h4 className="font-medium text-sm text-white">
                      {isAdmin ? `${mockUserProfile.name} (Admin)` : mockUserProfile.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      You
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Show other members if needed - in a real app we would fetch the actual members */}
            {group.memberCount > (isMember ? 1 : 0) && (
              // Only show placeholder members if memberCount is higher than current user
              Array.from({ length: Math.min(5, group.memberCount - (isMember ? 1 : 0)) }).map((_, i) => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-3 flex items-center gap-3">
                    <AvatarWithStatus 
                      src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`}
                      fallback={`Member ${i + 1}`}
                      status={i % 3 === 0 ? "online" : "offline"}
                    />
                    <div>
                      <h4 className="font-medium text-sm text-white">
                        {i === 0 && isAdmin ? "Alex Chen (Admin)" : `Member ${i + 1}`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "Since Oct 2023" : "Joined recently"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
