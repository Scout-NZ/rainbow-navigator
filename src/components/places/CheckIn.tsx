import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPinCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

const DOW_NAMES = ["", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
const BLOCK_NAMES: Record<string, string> = {
  morning: "mornings", afternoon: "afternoons", evening: "evenings", late: "late nights",
};

// Privacy contract: proximity verification happens HERE, on the device.
// Coordinates are compared locally and discarded — the server only ever
// learns that a check-in happened, never where the user was.
function verifyProximity(place: { lat?: number; lng?: number }): Promise<"near" | "far" | "unknown"> {
  return new Promise((resolve) => {
    if (!navigator.geolocation || !place.lat || !place.lng) return resolve("unknown");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dLat = (pos.coords.latitude - place.lat!) * 111_000;
        const dLng = (pos.coords.longitude - place.lng!) * 111_000 * Math.cos((place.lat! * Math.PI) / 180);
        const metres = Math.sqrt(dLat * dLat + dLng * dLng);
        resolve(metres <= 2000 ? "near" : "far");
      },
      () => resolve("unknown"),
      { timeout: 6000, maximumAge: 120000 },
    );
  });
}

export function CheckInSection({ placeId, placeName, lat, lng }: {
  placeId: string; placeName: string; lat?: number; lng?: number;
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: activity } = useQuery({
    queryKey: ["place-activity", placeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_activity").select("*").eq("location_id", placeId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: busyTimes = [] } = useQuery({
    queryKey: ["busy-times", placeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_busy_times").select("*").eq("location_id", placeId);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: checkedInToday = false } = useQuery({
    queryKey: ["my-checkin", placeId, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("place_checkins")
        .select("id")
        .eq("location_id", placeId)
        .eq("user_id", user!.id)
        .gte("created_at", startOfDay.toISOString())
        .limit(1);
      if (error) throw error;
      return (data || []).length > 0;
    },
  });

  const busiest = busyTimes.length
    ? [...busyTimes].sort((a: any, b: any) => b.checkins - a.checkins)[0]
    : null;

  const handleCheckIn = async () => {
    if (!user) { navigate("/auth"); return; }
    setBusy(true);
    try {
      const proximity = await verifyProximity({ lat, lng });
      if (proximity === "far") {
        toast({
          title: "You look far from " + placeName,
          description: "Check-ins work best in person — visit and tap again!",
        });
        return;
      }
      const { error } = await supabase.from("place_checkins").insert({
        location_id: placeId,
        user_id: user.id,
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already checked in today ✓" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Checked in 🌈", description: "Thanks for helping the community find its places." });
      }
      queryClient.invalidateQueries({ queryKey: ["my-checkin", placeId] });
      queryClient.invalidateQueries({ queryKey: ["place-activity", placeId] });
    } catch (err) {
      console.error("Check-in failed:", err);
      toast({ title: "Couldn't check in", description: "Please try again.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 space-y-1.5">
      <Button
        className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        onClick={handleCheckIn}
        disabled={busy || checkedInToday}
      >
        <MapPinCheck className="h-4 w-4 mr-2" aria-hidden="true" />
        {checkedInToday ? "Checked in today ✓" : "Check in — I'm here 🌈"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        {activity?.has_checkin_data
          ? `${activity.checkins} community check-in${activity.checkins === 1 ? "" : "s"} this year`
          : "Check-ins show the community where we gather — counts appear once a few people have checked in."}
        {busiest && ` · Usually busiest ${DOW_NAMES[busiest.dow]} ${BLOCK_NAMES[busiest.block] ?? ""}`}
      </p>
    </div>
  );
}
