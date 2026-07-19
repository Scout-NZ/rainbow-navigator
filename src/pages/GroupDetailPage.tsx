import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, MapPin, MessageCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// Real group page: what the group is, who it's for, when they meet, how to
// take part — with the group's own WhatsApp/Facebook/site one tap away.
export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: joined = false } = useQuery({
    queryKey: ["group-membership", groupId, user?.id],
    enabled: !!groupId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("group_id", groupId!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["group-events", groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("group_id", groupId!)
        .eq("status", "approved")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at");
      if (error) throw error;
      return data || [];
    },
  });

  const handleJoinToggle = async () => {
    if (!user) { navigate("/auth"); return; }
    const result = joined
      ? await supabase.from("group_members").delete().eq("group_id", groupId!).eq("user_id", user.id)
      : await supabase.from("group_members").insert({ group_id: groupId!, user_id: user.id });
    if (!result.error) {
      queryClient.invalidateQueries({ queryKey: ["group-membership"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-muted-foreground">We couldn't find that group.</p>
        <Button asChild variant="outline"><Link to="/connect">Back to Connect</Link></Button>
      </div>
    );
  }

  const externalLink = group.contact_link || group.website;

  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-5">
      {/* Hero: the group's own logo/banner, pulled from their website or
          Facebook page (group owners will be able to change it) */}
      {group.image_url ? (
        <div className="relative -mx-4 md:mx-0 md:rounded-xl overflow-hidden">
          <div
            className="h-48 md:h-64 bg-cover bg-center bg-muted"
            style={{ backgroundImage: `url(${group.image_url})` }}
            role="img"
            aria-label={group.name}
          />
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-800" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
      )}

      <div className="space-y-2">
        <h1 className="text-2xl font-bold leading-tight">{group.name}</h1>
        {group.city && (
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {group.city}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {(group.audience || []).map((a: string) => (
            <Badge key={a} variant="secondary">{a}</Badge>
          ))}
          {(group.activities || []).map((act: string) => (
            <Badge key={act} variant="outline">{act}</Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleJoinToggle}
          className={joined ? "bg-rainbow-gradient hover:bg-rainbow-gradient-hover flex-1" : "flex-1"}
          variant={joined ? "default" : "outline"}
        >
          <Users className="h-4 w-4 mr-2" aria-hidden="true" />
          {joined ? "Joined ✓" : "Join this group"}
        </Button>
        {externalLink && (
          <Button asChild variant="outline" className="flex-1">
            <a href={externalLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
              {group.contact_link ? "Group page" : "Website"}
            </a>
          </Button>
        )}
      </div>

      {group.member_count > 0 && (
        <p className="text-sm text-muted-foreground">
          {group.member_count} member{group.member_count === 1 ? "" : "s"} on Rainbow Navigator.
          For privacy, member lists are never shown.
        </p>
      )}

      {group.description && (
        <div className="space-y-2">
          <h2 className="font-semibold">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
        </div>
      )}

      {group.meeting_info && (
        <div className="space-y-2">
          <h2 className="font-semibold">When & where</h2>
          <p className="text-sm text-muted-foreground">{group.meeting_info}</p>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" /> Upcoming events
        </h2>
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No events listed yet. Know of one?{" "}
              <Link to="/events" className="text-primary underline">Add it on the Events page</Link>.
            </CardContent>
          </Card>
        ) : (
          events.map((ev: any) => (
            <Card key={ev.id}>
              <CardContent className="p-4 space-y-1">
                <h3 className="font-medium">{ev.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(ev.starts_at).toLocaleString("en-NZ", {
                    weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
                  })}
                  {ev.venue ? ` · ${ev.venue}` : ""}
                </p>
                {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground flex items-start gap-2">
          <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            In-app group chat is coming. Until then, joining here shows your
            interest — and the group's own page (above) is the best way to say hi.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
