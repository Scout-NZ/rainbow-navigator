
import { Bell, Calendar, Edit, Globe, Heart, Settings, Users, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUserProfile, mockEvents, mockGroups, mockPosts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PostCard } from "@/components/feed/PostCard";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormValues {
  name: string;
  username: string;
  bio: string;
  location: string;
  interests: string;
}

export default function ProfilePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState(mockUserProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      location: profile.location || "",
      interests: profile.interests.join(", "),
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    // In a real app, this would call an API to update the profile
    const updatedProfile = {
      ...profile,
      name: values.name,
      username: values.username,
      bio: values.bio,
      location: values.location,
      interests: values.interests.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    
    setProfile(updatedProfile);
    setIsDialogOpen(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload the file to a server
    // For now, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    setProfile({
      ...profile,
      imageUrl,
    });

    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    });
  };

  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <Button variant="outline" size="sm" className="rounded-full">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
      
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-rainbow-gradient relative" />
        
        <CardContent className="p-0">
          <div className="px-4 pb-4 pt-0 relative">
            <div className="absolute -top-12 group">
              <Avatar className="h-24 w-24 border-4 border-background relative">
                <AvatarImage
                  src={profile.imageUrl} 
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                
                <button 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                  onClick={handleProfilePictureClick}
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Avatar>
            </div>
            
            <div className="pt-16 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground text-sm">{profile.username}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <p className="mt-3 text-sm">{profile.bio}</p>
            
            {profile.location && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {profile.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  #{interest}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{profile.friends}</div>
                <div className="text-xs text-muted-foreground">Friends</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{profile.groups}</div>
                <div className="text-xs text-muted-foreground">Groups</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{profile.events}</div>
                <div className="text-xs text-muted-foreground">Events</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="activity">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-0 space-y-4">
          {mockPosts.slice(0, 3).map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-0">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex flex-col items-center">
                <Heart className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium text-center">Saved Resources</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Quick access to resources you've saved
                </p>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex flex-col items-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium text-center">Saved Events</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Events you're interested in or attending
                </p>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex flex-col items-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium text-center">Saved Groups</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Groups you're interested in or following
                </p>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex flex-col items-center">
                <Globe className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium text-center">Saved Places</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Bookmarked businesses and locations
                </p>
              </div>
            </Card>
          </div>
          
          <p className="text-center text-muted-foreground text-sm">
            Items you save will appear here for easy access
          </p>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="card-hover">
                <CardContent className="p-3 flex gap-3">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${i % 3 === 0 ? 'bg-blue-100 text-blue-500' : 
                      i % 3 === 1 ? 'bg-purple-100 text-purple-500' : 
                      'bg-green-100 text-green-500'}
                  `}>
                    {i % 3 === 0 ? <Bell className="h-5 w-5" /> : 
                      i % 3 === 1 ? <Users className="h-5 w-5" /> : 
                      <Calendar className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {i % 3 === 0 ? 'New event in your area: Pride Parade' : 
                        i % 3 === 1 ? 'Jordan accepted your friend request' : 
                        'Reminder: Queer Book Club meeting tomorrow'}
                    </p>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell the community about yourself..." 
                        className="h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Where are you based?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="lgbtq, art, music, activism" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
