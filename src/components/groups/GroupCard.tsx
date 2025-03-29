
import { Lock, Users } from "lucide-react";
import { Group } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

interface GroupCardProps {
  group: Group;
  isCompact?: boolean;
}

export function GroupCard({ group, isCompact = false }: GroupCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinGroup, isGroupMember, currentUser } = useUser();
  const isMember = isGroupMember(group.id);
  const [memberCount, setMemberCount] = useState(group.memberCount);
  
  // Ensure the member count reflects the correct number from localStorage or updates if the user joins
  useEffect(() => {
    const syncMemberCount = () => {
      const storedMemberCount = localStorage.getItem(`group-${group.id}-member-count`);
      
      if (storedMemberCount) {
        // Always use the stored count if available
        setMemberCount(parseInt(storedMemberCount));
      } else if (isMember && memberCount === group.memberCount) {
        // If user is a member but count hasn't been updated, increment it
        const newCount = group.memberCount + 1;
        setMemberCount(newCount);
        localStorage.setItem(`group-${group.id}-member-count`, newCount.toString());
      }
    };
    
    syncMemberCount();
    
    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `group-${group.id}-member-count` && e.newValue) {
        setMemberCount(parseInt(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [group.id, group.memberCount, isMember, memberCount]);
  
  const handleViewGroup = () => {
    console.log("Viewing group:", group.name);
    navigate(`/connect/groups/${group.id}`);
  };

  const handleJoinGroup = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the join button
    console.log("Joining group:", group.name);
    
    joinGroup(group.id);
    
    // Update the member count in local storage
    const newMemberCount = memberCount + 1;
    setMemberCount(newMemberCount);
    localStorage.setItem(`group-${group.id}-member-count`, newMemberCount.toString());
    
    toast({
      title: "Group joined!",
      description: `You have successfully joined ${group.name}`,
    });
  };

  return (
    <Card className={`card-hover overflow-hidden ${isCompact ? "flex" : ""}`}>
      <div 
        className={`${isCompact ? "h-24 w-24 flex-shrink-0" : "h-32"} bg-muted bg-cover bg-center relative`}
        style={{ 
          backgroundImage: group.imageUrl 
            ? `url(${group.imageUrl})` 
            : undefined 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {!isCompact && (
          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
            <h3 className="text-white font-semibold truncate">{group.name}</h3>
            {group.isPrivate && (
              <span className="flex items-center gap-1 text-white text-xs bg-black/40 p-1 rounded">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </div>
        )}
      </div>
      
      <CardContent className={`p-3 ${isCompact ? "flex-1" : ""}`}>
        {isCompact && (
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold">{group.name}</h3>
            {group.isPrivate && (
              <span className="flex items-center gap-1 text-xs">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="bg-background/80">
            {group.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{memberCount} members</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        
        {!isCompact && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {group.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      {!isCompact && (
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-1/2"
            onClick={handleViewGroup}
          >
            View
          </Button>
          {isMember ? (
            <Button 
              size="sm" 
              className="w-1/2"
              variant="secondary"
              onClick={handleViewGroup}
            >
              View Group
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="w-1/2 bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
              onClick={handleJoinGroup}
            >
              Join
            </Button>
          )}
        </CardFooter>
      )}
      
      {isCompact && (
        <div className="flex items-center p-3 pl-0">
          {isMember ? (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleViewGroup}
            >
              View
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
              onClick={handleJoinGroup}
            >
              Join
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
