
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

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-3 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <AvatarWithStatus 
            src={post.userImageUrl} 
            fallback={post.userName} 
            status="online"
          />
          <div>
            <h3 className="font-semibold text-sm">{post.userName}</h3>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>
        
        {post.content.text && (
          <p className="text-sm mb-3">{post.content.text}</p>
        )}
        
        {post.content.imageUrl && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={post.content.imageUrl} 
              alt="Post" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {post.content.videoUrl && (
          <div className="mb-3 rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Video content</span>
          </div>
        )}
        
        <div className="flex gap-1 flex-wrap">
          {post.tags.map(tag => (
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
          <Share2 className="h-4 w-4 mr-1" /> {post.shares}
        </Button>
      </CardFooter>
    </Card>
  );
}
