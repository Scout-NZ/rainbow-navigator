
import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/feed/PostCard";
import { mockPosts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

export default function FeedPage() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  
  const goToPrevPost = () => {
    setCurrentPostIndex(prev => (prev > 0 ? prev - 1 : mockPosts.length - 1));
  };
  
  const goToNextPost = () => {
    setCurrentPostIndex(prev => (prev < mockPosts.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Feed</h1>
        <Button 
          size="sm"
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <Tabs defaultValue="forYou">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="forYou" className="flex-1">For You</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
          <TabsTrigger value="latest" className="flex-1">Latest</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forYou" className="mt-0">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
            <Badge variant="outline" className="rounded-full bg-background hover:bg-muted/50 cursor-pointer">
              All
            </Badge>
            {["Pride", "Community", "Art", "Activism", "Personal", "Celebration"].map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="rounded-full bg-background hover:bg-muted/50 cursor-pointer whitespace-nowrap"
              >
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="relative h-[70vh] rounded-xl overflow-hidden border mb-6">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: mockPosts[currentPostIndex].content.imageUrl 
                  ? `url(${mockPosts[currentPostIndex].content.imageUrl})` 
                  : undefined,
                filter: "blur(20px)",
                transform: "scale(1.1)",
                opacity: 0.2
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <img 
                      src={mockPosts[currentPostIndex].userImageUrl} 
                      alt={mockPosts[currentPostIndex].userName}
                      className="object-cover"
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{mockPosts[currentPostIndex].userName}</h3>
                    <p className="text-xs text-white/70">
                      {new Date(mockPosts[currentPostIndex].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {mockPosts[currentPostIndex].tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-white/30 text-white bg-black/30">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10">
                {mockPosts[currentPostIndex].content.imageUrl && (
                  <div className="w-full max-h-[50vh] flex items-center justify-center overflow-hidden">
                    <img 
                      src={mockPosts[currentPostIndex].content.imageUrl} 
                      alt="Post" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-white mb-4 text-lg font-medium">{mockPosts[currentPostIndex].content.text}</p>
                
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="text-white border-white/30 bg-black/30">
                      <Heart className="h-4 w-4 mr-2" /> {mockPosts[currentPostIndex].likes}
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white/30 bg-black/30">
                      <MessageCircle className="h-4 w-4 mr-2" /> {mockPosts[currentPostIndex].comments}
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white/30 bg-black/30">
                      <Share2 className="h-4 w-4 mr-2" /> {mockPosts[currentPostIndex].shares}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full text-white border-white/30 bg-black/30"
                      onClick={goToPrevPost}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full text-white border-white/30 bg-black/30"
                      onClick={goToNextPost}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
          <div className="space-y-4">
            {mockPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          <div className="space-y-4">
            {mockPosts.slice().reverse().map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="latest" className="mt-0">
          <div className="space-y-4">
            {mockPosts.slice().sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
