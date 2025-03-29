
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockPosts, Post } from "@/data/mockData";
import { PostCard } from "@/components/feed/PostCard";
import { Camera, Image, MapPin, Smile, Tag, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

// This component handles the feed page with posts
export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeImage, setComposeImage] = useState<string | null>(null);
  const [composeTags, setComposeTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [localPosts, setLocalPosts] = useState<Post[]>(mockPosts);

  // Function to submit a new post
  const handleSubmitPost = () => {
    if (!composeText.trim() && !composeImage) return;
    
    const newPost: Post = {
      id: localPosts.length + 1,
      content: {
        text: composeText.trim(),
        ...(composeImage && { imageUrl: composeImage })
      },
      tags: composeTags,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      userImageUrl: "https://picsum.photos/200?random=99",
      userName: "You",
      author: {
        id: 999,
        name: "You",
        username: "you",
        avatar: "https://picsum.photos/200?random=99"
      }
    };
    
    setLocalPosts([newPost, ...localPosts]);
    setComposeOpen(false);
    setComposeText("");
    setComposeImage(null);
    setComposeTags([]);
    setTagInput("");
  };

  // Function to add a tag to the post
  const handleAddTag = () => {
    if (tagInput.trim() && !composeTags.includes(tagInput.trim())) {
      setComposeTags([...composeTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Function to handle tag input keypress
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Function to remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setComposeTags(composeTags.filter(tag => tag !== tagToRemove));
  };

  // Simulating image upload
  const handleImageUpload = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setComposeImage(`https://picsum.photos/600/400?random=${randomId}`);
  };

  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-2xl font-bold">Community Feed</h1>
      
      <Card>
        <CardContent className="p-4">
          {!composeOpen ? (
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setComposeOpen(true)}
            >
              <Avatar className="h-10 w-10">
                <img src="https://picsum.photos/200?random=99" alt="Your avatar" />
              </Avatar>
              <div className="bg-muted rounded-full flex-1 px-4 py-2 text-muted-foreground">
                Share something with the community...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <Avatar className="h-10 w-10">
                  <img src="https://picsum.photos/200?random=99" alt="Your avatar" />
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder="What's on your mind?"
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    className="w-full resize-none border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={3}
                  />
                  
                  {composeImage && (
                    <div className="mt-2 relative w-full rounded-lg overflow-hidden">
                      <img 
                        src={composeImage} 
                        alt="Upload preview" 
                        className="w-full h-auto max-h-60 object-cover"
                      />
                      <button 
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                        onClick={() => setComposeImage(null)}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {composeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {composeTags.map(tag => (
                        <div 
                          key={tag} 
                          className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full flex items-center"
                        >
                          #{tag}
                          <XCircle 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Add a tag..."
                        className="pl-8 py-1 h-8 bg-muted/50"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyPress}
                      />
                      <Tag className="h-4 w-4 absolute left-2 top-2 text-muted-foreground" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={handleImageUpload}
                    >
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                    >
                      <Smile className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setComposeOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
                  onClick={handleSubmitPost}
                  disabled={!composeText.trim() && !composeImage}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid-cols-3">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {localPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4 mt-4">
          {localPosts
            .filter(post => post.tags.some(tag => ['community', 'event', 'support'].includes(tag)))
            .map(post => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-4 mt-4">
          {localPosts
            .filter(post => post.author.id < 4) // Just a simple filter for demo
            .map(post => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
