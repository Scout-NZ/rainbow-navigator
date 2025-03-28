
import { Bell, Calendar, Edit, Globe, Heart, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUserProfile, mockEvents, mockGroups, mockPosts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/feed/PostCard";

export default function ProfilePage() {
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold rainbow-text">Profile</h1>
        <Button variant="outline" size="sm" className="rounded-full">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
      
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-rainbow-gradient relative" />
        
        <CardContent className="p-0">
          <div className="px-4 pb-4 pt-0 relative">
            <Avatar className="h-24 w-24 border-4 border-background absolute -top-12">
              <img 
                src={mockUserProfile.imageUrl} 
                alt={mockUserProfile.name}
                className="object-cover"
              />
            </Avatar>
            
            <div className="pt-16 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{mockUserProfile.name}</h2>
                <p className="text-muted-foreground text-sm">{mockUserProfile.username}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            
            <p className="mt-3 text-sm">{mockUserProfile.bio}</p>
            
            {mockUserProfile.location && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <span>{mockUserProfile.location}</span>
              </div>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {mockUserProfile.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  #{interest}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{mockUserProfile.friends}</div>
                <div className="text-xs text-muted-foreground">Friends</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{mockUserProfile.groups}</div>
                <div className="text-xs text-muted-foreground">Groups</div>
              </div>
              <div className="p-2 rounded-md bg-muted/30">
                <div className="text-lg font-bold">{mockUserProfile.events}</div>
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
    </div>
  );
}
