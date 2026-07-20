import { Bell, Calendar, Edit, Globe, Heart, Settings, Users, Camera, Instagram, Facebook, Twitter, Linkedin, Music, Video, LogOut } from "lucide-react";
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
import { SecuritySection } from "@/components/profile/SecuritySection";
import { useUser } from "@/contexts/UserContext";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user, updateProfile, signOut } = useUser();
  const { savedPlaces, toggleSave } = useSavedPlaces();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      location: "",
      interests: "",
      identity: "",
      pronouns: "",
      gender: "",
      socialLinks: {
        instagram: "",
        facebook: "",
        twitter: "",
        spotify: "",
        tiktok: "",
        linkedin: ""
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
      instagram: "",
      facebook: "",
      twitter: "",
      spotify: "",
      tiktok: "",
      linkedin: ""
    }
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (user && user.name !== form.getValues().name) {
    form.reset({
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      location: user.location || "",
      interests: user.interests?.join(", ") || "",
      identity: user.identity || "",
      pronouns: user.pronouns || "",
      gender: user.gender || "",
      socialLinks: {
        instagram: user.socialLinks?.instagram || "",
        facebook: user.socialLinks?.facebook || "",
        twitter: user.socialLinks?.twitter || "",
        spotify: user.socialLinks?.spotify || "",
        tiktok: user.socialLinks?.tiktok || "",
        linkedin: user.socialLinks?.linkedin || ""
      }
    });
    
    socialForm.reset({
      instagram: user.socialLinks?.instagram || "",
      facebook: user.socialLinks?.facebook || "",
      twitter: user.socialLinks?.twitter || "",
      spotify: user.socialLinks?.spotify || "",
      tiktok: user.socialLinks?.tiktok || "",
      linkedin: user.socialLinks?.linkedin || ""
    });
  }

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
    
    updateProfile(updatedProfile);
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
    updateProfile({
      socialLinks: {
        ...user.socialLinks,
        ...values
      }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);

      const previewUrl = URL.createObjectURL(file);

      await updateProfile({
        imageUrl: previewUrl,
      });

      toast({
        title: "Profile picture updated",
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const headerGradient = getIdentityGradient(user.identity || "");

  const hasAnySocialLink = user.socialLinks && Object.values(user.socialLinks).some(link => !!link);

  const friendsCount = typeof user.friends === 'number' ? user.friends : user.friends?.length || 0;
  const groupsCount = typeof user.groups === 'number' ? user.groups : user.groups?.length || 0;
  const eventsCount = typeof user.events === 'number' ? user.events : user.events?.length || 0;
  const profileImageUrl = user.imageUrl || user.avatar || "";

  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
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
                  src={profileImageUrl} 
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                
                <button 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                  onClick={handleProfilePictureClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="h-8 w-8 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </Avatar>
            </div>
            
            <div className="pt-16 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground text-sm">{user.username}</p>
                {user.pronouns && <p className="text-sm text-muted-foreground">{user.pronouns}</p>}
                {user.gender && <p className="text-sm text-muted-foreground">{user.gender}</p>}
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
            
            <p className="mt-3 text-sm">{user.bio}</p>
            
            {user.location && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user.identity && (
              <div className="flex items-center mt-2 text-sm">
                <Badge className="bg-rainbow-gradient text-white">
                  {prideIdentities.find(i => i.id === user.identity)?.label || user.identity}
                </Badge>
              </div>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {user.interests?.map((interest, idx) => (
                <Badge key={interest + idx} variant="secondary" className="text-xs">
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
                  {user.socialLinks?.instagram && (
                    <a 
                      href={user.socialLinks.instagram.startsWith('http') ? user.socialLinks.instagram : `https://${user.socialLinks.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-4 w-4 mr-1" />
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {user.socialLinks?.facebook && (
                    <a 
                      href={user.socialLinks.facebook.startsWith('http') ? user.socialLinks.facebook : `https://${user.socialLinks.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      <span>Facebook</span>
                    </a>
                  )}
                  
                  {user.socialLinks?.twitter && (
                    <a 
                      href={user.socialLinks.twitter.startsWith('http') ? user.socialLinks.twitter : `https://${user.socialLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      <span>X</span>
                    </a>
                  )}
                  
                  {user.socialLinks?.spotify && (
                    <a 
                      href={user.socialLinks.spotify.startsWith('http') ? user.socialLinks.spotify : `https://${user.socialLinks.spotify}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Music className="h-4 w-4 mr-1" />
                      <span>Spotify</span>
                    </a>
                  )}
                  
                  {user.socialLinks?.tiktok && (
                    <a 
                      href={user.socialLinks.tiktok.startsWith('http') ? user.socialLinks.tiktok : `https://${user.socialLinks.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      <span>TikTok</span>
                    </a>
                  )}
                  
                  {user.socialLinks?.linkedin && (
                    <a 
                      href={user.socialLinks.linkedin.startsWith('http') ? user.socialLinks.linkedin : `https://${user.socialLinks.linkedin}`} 
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
                <div className="text-lg font-bold">{friendsCount}</div>
                <div className="text-xs text-muted-foreground">Friends</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{groupsCount}</div>
                <div className="text-xs text-muted-foreground">Groups</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{eventsCount}</div>
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
          {savedPlaces.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center space-y-3">
                <Heart className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
                <h3 className="font-medium">No saved places yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Tap the heart on any place on the map to keep it here for quick access.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/">Explore the map</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedPlaces.map((place: any) => (
                <Card key={place.id} className="card-hover overflow-hidden">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div
                      className="h-14 w-14 rounded-md bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${place.imageUrl})` }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{place.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {place.category} · {place.location.city}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSave(String(place.id))}
                      aria-label={`Remove ${place.name} from saved places`}
                    >
                      <Heart className="h-5 w-5 fill-current text-primary" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

      <SecuritySection />
    </div>
  );
}
