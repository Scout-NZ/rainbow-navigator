import { Bell, Calendar, Edit, Globe, Heart, Settings, Users, Camera, Instagram, Facebook, Twitter, Linkedin, Music, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPosts } from "@/data/mockData";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prideIdentities, getIdentityGradient } from "@/utils/prideFlags";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";

interface ProfileFormValues {
  name: string;
  username: string;
  bio: string;
  location: string;
  interests: string;
  identity: string;
  pronouns: string;
  gender: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    spotify: string;
    tiktok: string;
    linkedin: string;
  };
}

export default function ProfilePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useUser();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: userProfile.name,
      username: userProfile.username || "",
      bio: userProfile.bio || "",
      location: userProfile.location || "",
      interests: userProfile.interests.join(", "),
      identity: userProfile.identity || "",
      pronouns: userProfile.pronouns || "",
      gender: userProfile.gender || "",
      socialLinks: {
        instagram: userProfile.socialLinks?.instagram || "",
        facebook: userProfile.socialLinks?.facebook || "",
        twitter: userProfile.socialLinks?.twitter || "",
        spotify: userProfile.socialLinks?.spotify || "",
        tiktok: userProfile.socialLinks?.tiktok || "",
        linkedin: userProfile.socialLinks?.linkedin || ""
      }
    },
  });

  const socialForm = useForm<{
    instagram: string;
    facebook: string;
    twitter: string;
    spotify: string;
    tiktok: string;
    linkedin: string;
  }>({
    defaultValues: {
      instagram: userProfile.socialLinks?.instagram || "",
      facebook: userProfile.socialLinks?.facebook || "",
      twitter: userProfile.socialLinks?.twitter || "",
      spotify: userProfile.socialLinks?.spotify || "",
      tiktok: userProfile.socialLinks?.tiktok || "",
      linkedin: userProfile.socialLinks?.linkedin || ""
    }
  });

  const onSubmit = (values: ProfileFormValues) => {
    const updatedProfile = {
      name: values.name,
      username: values.username,
      bio: values.bio,
      location: values.location,
      interests: values.interests.split(",").map(tag => tag.trim()).filter(Boolean),
      identity: values.identity,
      pronouns: values.pronouns,
      gender: values.gender,
    };
    
    updateUserProfile(updatedProfile);
    setIsDialogOpen(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const onSocialSubmit = (values: {
    instagram: string;
    facebook: string;
    twitter: string;
    spotify: string;
    tiktok: string;
    linkedin: string;
  }) => {
    updateUserProfile({
      socialLinks: values
    });
    
    setIsSocialDialogOpen(false);
    
    toast({
      title: "Social links updated",
      description: "Your social links have been successfully updated.",
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    updateUserProfile({
      imageUrl,
    });

    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    });
  };

  const headerGradient = getIdentityGradient(userProfile.identity);

  const hasAnySocialLink = userProfile.socialLinks && Object.values(userProfile.socialLinks).some(link => !!link);

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
        <div 
          className="h-32 relative" 
          style={{ background: headerGradient }}
        />
        
        <CardContent className="p-0">
          <div className="px-4 pb-4 pt-0 relative">
            <div className="absolute -top-12 group">
              <Avatar className="h-24 w-24 border-4 border-background relative">
                <AvatarImage
                  src={userProfile.imageUrl} 
                  alt={userProfile.name}
                  className="object-cover"
                />
                <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                
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
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <p className="text-muted-foreground text-sm">{userProfile.username}</p>
                {userProfile.pronouns && <p className="text-sm text-muted-foreground">{userProfile.pronouns}</p>}
                {userProfile.gender && <p className="text-sm text-muted-foreground">{userProfile.gender}</p>}
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
            
            <p className="mt-3 text-sm">{userProfile.bio}</p>
            
            {userProfile.location && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <span>{userProfile.location}</span>
              </div>
            )}
            
            {userProfile.identity && (
              <div className="flex items-center mt-2 text-sm">
                <Badge className="bg-rainbow-gradient text-white">
                  {prideIdentities.find(i => i.id === userProfile.identity)?.label || userProfile.identity}
                </Badge>
              </div>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {userProfile.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  #{interest}
                </Badge>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Social Links</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSocialDialogOpen(true)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </div>
              
              {hasAnySocialLink ? (
                <div className="flex flex-wrap gap-3">
                  {userProfile.socialLinks?.instagram && (
                    <a 
                      href={userProfile.socialLinks.instagram.startsWith('http') ? userProfile.socialLinks.instagram : `https://${userProfile.socialLinks.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-4 w-4 mr-1" />
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {userProfile.socialLinks?.facebook && (
                    <a 
                      href={userProfile.socialLinks.facebook.startsWith('http') ? userProfile.socialLinks.facebook : `https://${userProfile.socialLinks.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      <span>Facebook</span>
                    </a>
                  )}
                  
                  {userProfile.socialLinks?.twitter && (
                    <a 
                      href={userProfile.socialLinks.twitter.startsWith('http') ? userProfile.socialLinks.twitter : `https://${userProfile.socialLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      <span>X</span>
                    </a>
                  )}
                  
                  {userProfile.socialLinks?.spotify && (
                    <a 
                      href={userProfile.socialLinks.spotify.startsWith('http') ? userProfile.socialLinks.spotify : `https://${userProfile.socialLinks.spotify}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Music className="h-4 w-4 mr-1" />
                      <span>Spotify</span>
                    </a>
                  )}
                  
                  {userProfile.socialLinks?.tiktok && (
                    <a 
                      href={userProfile.socialLinks.tiktok.startsWith('http') ? userProfile.socialLinks.tiktok : `https://${userProfile.socialLinks.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      <span>TikTok</span>
                    </a>
                  )}
                  
                  {userProfile.socialLinks?.linkedin && (
                    <a 
                      href={userProfile.socialLinks.linkedin.startsWith('http') ? userProfile.socialLinks.linkedin : `https://${userProfile.socialLinks.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No social links added yet</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{userProfile.friends}</div>
                <div className="text-xs text-muted-foreground">Friends</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{userProfile.groups}</div>
                <div className="text-xs text-muted-foreground">Groups</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{userProfile.events}</div>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
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
                  name="pronouns"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="he/him" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                he/him
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="she/her" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                she/her
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="they/them" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                they/them
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ze/zir" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                ze/zir
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="it/its" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                it/its
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="xe/xem" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                xe/xem
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="fae/faer" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                fae/faer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ey/em" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                ey/em
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                None/Unspecified
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Man" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Man
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Trans Man" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Trans Man
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Woman" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Woman
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Trans Woman" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Trans Woman
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Non-Binary" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Non-Binary
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                None/Unspecified
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
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
                  name="identity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LGBT+ Identity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your identity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No selection</SelectItem>
                          {prideIdentities.map((identity) => (
                            <SelectItem key={identity.id} value={identity.id}>
                              {identity.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Social Links</DialogTitle>
            <DialogDescription>
              Add your social media links below. 
              You can enter the full URL or just your username.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[50vh] pr-4">
            <Form {...socialForm}>
              <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-4">
                <FormField
                  control={socialForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2" /> Instagram
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://instagram.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={socialForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2" /> Facebook
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://facebook.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={socialForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Twitter className="h-4 w-4 mr-2" /> X (Twitter)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://x.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={socialForm.control}
                  name="spotify"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Music className="h-4 w-4 mr-2" /> Spotify
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://open.spotify.com/user/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={socialForm.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Video className="h-4 w-4 mr-2" /> TikTok
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://tiktok.com/@username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={socialForm.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="username or https://linkedin.com/in/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSocialDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                  >
                    Save Links
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
