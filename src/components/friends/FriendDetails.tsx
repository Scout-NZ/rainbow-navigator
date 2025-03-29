
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { useToast } from "@/hooks/use-toast";

export interface FriendData {
  id: string;
  name: string;
  imageUrl: string;
  status: "online" | "offline" | "none";
  mutualGroups: number;
}

interface FriendDetailsProps {
  friend: FriendData;
  onSendMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
}

export function FriendDetails({ friend, onSendMessage, onViewProfile }: FriendDetailsProps) {
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(friend.id);
    } else {
      toast({
        title: "Message sent",
        description: `Started a conversation with ${friend.name}`,
      });
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(friend.id);
    } else {
      toast({
        title: "Profile view",
        description: `Viewing ${friend.name}'s profile`,
      });
    }
  };

  return (
    <div className="p-2 space-y-4">
      <div className="flex flex-col items-center text-center mb-2">
        <AvatarWithStatus
          src={friend.imageUrl}
          fallback={friend.name.charAt(0)}
          size="lg"
          status={friend.status}
        />
        <h3 className="font-medium mt-2">{friend.name}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Users className="h-3 w-3 mr-1" />
          <span>{friend.mutualGroups} mutual groups</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleSendMessage}
        >
          <MessageCircle className="h-4 w-4 mr-1" /> Message
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}
