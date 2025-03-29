
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";

export function PostCard({ post }: { post: Post }) {
  // Format the timestamp relative to now (e.g., "2 hours ago")
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

  // Get the author's details from either author object or direct properties
  const authorName = post.author?.name || post.userName || "";
  const authorImage = post.author?.avatar || post.userImageUrl || "";
  
  // Handle different content formats
  const contentText = typeof post.content === 'string' ? post.content : post.content?.text || "";
  const contentImage = typeof post.content === 'string' ? (post.imageUrl || "") : (post.content?.imageUrl || "");
  const contentVideo = typeof post.content === 'string' ? "" : (post.content?.videoUrl || "");

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-3 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <AvatarWithStatus 
            src={authorImage} 
            fallback={authorName.charAt(0)} 
            status="online"
          />
          <div>
            <h3 className="font-semibold text-sm">{authorName}</h3>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>
        
        {contentText && (
          <p className="text-sm mb-3">{contentText}</p>
        )}
        
        {contentImage && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={contentImage} 
              alt="Post" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {contentVideo && (
          <div className="mb-3 rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Video content</span>
          </div>
        )}
        
        <div className="flex gap-1 flex-wrap">
          {post.tags && post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between border-t">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Heart className="h-4 w-4 mr-1" /> {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="h-4 w-4 mr-1" /> {post.shares || 0}
        </Button>
      </CardFooter>
    </Card>
  );
}
