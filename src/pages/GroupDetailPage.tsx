import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Lock, MessageCircle, Users, UserPlus, LogOut, Crown, UserX, User, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockGroups, mockUserProfile } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DiscussionMessage {
  id: string;
  userId: string;
  userImageUrl: string;
  userName: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
}

interface GroupMember {
  id: string;
  name: string;
  imageUrl: string;
  pronouns: string;
  status: "online" | "offline";
  joinDate: string;
  isAdmin?: boolean;
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinGroup, leaveGroup, isGroupMember, isGroupAdmin, currentUser, userProfile } = useUser();
  const [discussionMessage, setDiscussionMessage] = useState("");
  const [discussions, setDiscussions] = useState<DiscussionMessage[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    const mockMembers: GroupMember[] = [];
    
    if (isMember) {
      mockMembers.push({
        id: currentUser.id,
        name: userProfile.name,
        imageUrl: userProfile.imageUrl,
        pronouns: userProfile.pronouns || "they/them", 
        status: "online",
        joinDate: "Since Oct 2023",
        isAdmin: isAdmin
      });
    }
    
    const placeholderNames = ["Alex Chen", "Jordan Smith", "Taylor Kim", "Sam Rodriguez", "Quinn Patel"];
    const placeholderPronouns = ["she/her", "he/him", "they/them", "she/they", "he/they"];
    
    for (let i = 0; i < Math.min(5, group.memberCount - (isMember ? 1 : 0)); i++) {
      mockMembers.push({
        id: `member-${i + 1}`,
        name: placeholderNames[i] || `Member ${i + 1}`,
        imageUrl: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`,
        pronouns: placeholderPronouns[i] || "they/them",
        status: i % 3 === 0 ? "online" : "offline",
        joinDate: i === 0 ? "Since Oct 2023" : "Joined recently",
        isAdmin: i === 0 && !isAdmin
      });
    }
    
    setGroupMembers(mockMembers);
  }, [groupId, isMember, isAdmin, currentUser.id, group.memberCount, userProfile]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
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

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discussionMessage.trim() && !selectedImage) return;
    
    const newMessage: DiscussionMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userImageUrl: userProfile.imageUrl,
      userName: userProfile.name,
      content: discussionMessage,
      createdAt: new Date().toISOString(),
      imageUrl: imagePreview || undefined
    };
    
    setDiscussions([...discussions, newMessage]);
    
    toast({
      title: "Message sent",
      description: "Your message has been posted to the group discussion",
    });
    
    setDiscussionMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const viewMemberProfile = (member: GroupMember) => {
    setSelectedMember(member);
  };

  const removeMember = (memberId: string) => {
    const updatedMembers = groupMembers.filter(member => member.id !== memberId);
    setGroupMembers(updatedMembers);
    
    toast({
      title: "Member removed",
      description: "The member has been removed from the group",
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
                      className="w-full mb-2"
                      placeholder="Share your thoughts with the group..."
                      value={discussionMessage}
                      onChange={(e) => setDiscussionMessage(e.target.value)}
                    />
                    
                    {imagePreview && (
                      <div className="relative mb-2">
                        <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-cover rounded-md" />
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
                    
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      
                      <Button 
                        type="submit"
                        className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                        disabled={!discussionMessage.trim() && !selectedImage}
                      >
                        Post Message
                      </Button>
                    </div>
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
                            {message.content && <p className="text-sm mb-2">{message.content}</p>}
                            {message.imageUrl && (
                              <div className="mt-2">
                                <img 
                                  src={message.imageUrl} 
                                  alt="Shared image" 
                                  className="rounded-md max-h-80 w-auto" 
                                />
                              </div>
                            )}
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
          <h3 className="text-sm font-medium text-white">Members ({groupMembers.length})</h3>
          <div className="grid grid-cols-2 gap-2">
            {groupMembers.map((member) => (
              <Dialog key={member.id}>
                <Card className="card-hover">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <DialogTrigger className="flex items-center gap-3 flex-grow" asChild>
                        <Button variant="ghost" className="p-0 h-auto w-full justify-start">
                          <AvatarWithStatus 
                            src={member.imageUrl}
                            fallback={member.name}
                            status={member.status}
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-1">
                              <h4 className="font-medium text-sm text-white">
                                {member.name}
                              </h4>
                              {member.isAdmin && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{member.pronouns}</p>
                          </div>
                        </Button>
                      </DialogTrigger>
                      
                      {isAdmin && !member.isAdmin && member.id !== currentUser.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-2 text-red-500 hover:bg-red-500/10 h-8 w-8"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name} from this group? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => removeMember(member.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Member Profile</DialogTitle>
                    <DialogDescription>
                      View {member.name}'s profile information
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col items-center py-4">
                    <AvatarWithStatus 
                      src={member.imageUrl}
                      fallback={member.name}
                      status={member.status}
                      size="lg"
                      className="mb-4"
                    />
                    
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {member.name}
                      {member.isAdmin && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                          <Crown className="h-3 w-3" /> Admin
                        </span>
                      )}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4">{member.pronouns}</p>
                    
                    <div className="grid grid-cols-2 gap-2 w-full text-center mb-4">
                      <div className="p-2 rounded-md bg-muted/30">
                        <div className="text-sm font-medium">Member Since</div>
                        <div className="text-xs text-muted-foreground">{member.joinDate}</div>
                      </div>
                      <div className="p-2 rounded-md bg-muted/30">
                        <div className="text-sm font-medium">Status</div>
                        <div className="text-xs text-muted-foreground capitalize">{member.status}</div>
                      </div>
                    </div>
                    
                    <Button className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
