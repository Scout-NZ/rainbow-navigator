import { useEffect, useState } from "react";
import { KeyRound, LogOut, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Account security: TOTP two-factor enrolment and global sign-out.
// 2FA is optional for everyone and strongly encouraged for admins.
export function SecuritySection() {
  const [factors, setFactors] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const loadFactors = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  };

  useEffect(() => { loadFactors(); }, []);

  const startEnroll = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
      if (error) throw error;
      setEnrolling({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    } catch (err: any) {
      console.error("2FA enroll failed:", err);
      toast({ title: "Couldn't start 2FA setup", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const confirmEnroll = async () => {
    if (!enrolling || code.trim().length < 6) return;
    setBusy(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: enrolling.id });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: enrolling.id,
        challengeId: challenge.data.id,
        code: code.trim(),
      });
      if (verify.error) throw verify.error;
      toast({ title: "Two-factor authentication is on 🎉" });
      setEnrolling(null);
      setCode("");
      loadFactors();
    } catch (err: any) {
      toast({ title: "Code didn't match", description: "Check your authenticator app and try again.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const removeFactor = async (factorId: string) => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      toast({ title: "Two-factor authentication removed" });
      loadFactors();
    } catch (err: any) {
      toast({ title: "Couldn't remove 2FA", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const signOutEverywhere = async () => {
    await supabase.auth.signOut({ scope: "global" });
    toast({ title: "Signed out on all devices" });
  };

  const verified = factors.filter((f) => f.status === "verified");

  return (
    <Card className="mt-6">
      <CardContent className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" /> Security
        </h2>

        {verified.length > 0 ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600" aria-hidden="true" />
              Two-factor authentication is <strong>on</strong>
            </p>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => removeFactor(verified[0].id)}>
              <ShieldOff className="h-4 w-4 mr-1" aria-hidden="true" /> Turn off
            </Button>
          </div>
        ) : enrolling ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with an authenticator app (Google Authenticator, 1Password,
              Authy...), then enter the 6-digit code it shows.
            </p>
            <div
              className="mx-auto w-40 h-40 [&>svg]:w-full [&>svg]:h-full bg-white p-1 rounded"
              dangerouslySetInnerHTML={{ __html: enrolling.qr }}
            />
            <p className="text-xs text-muted-foreground text-center break-all">
              Can't scan? Enter manually: {enrolling.secret}
            </p>
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-label="Authenticator code"
              />
              <Button onClick={confirmEnroll} disabled={busy || code.trim().length < 6}>Verify</Button>
              <Button variant="ghost" onClick={() => { setEnrolling(null); setCode(""); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Add two-factor authentication for extra account protection.
            </p>
            <Button size="sm" disabled={busy} onClick={startEnroll}>
              <ShieldCheck className="h-4 w-4 mr-1" aria-hidden="true" /> Turn on 2FA
            </Button>
          </div>
        )}

        <div className="border-t pt-3">
          <Button size="sm" variant="outline" onClick={signOutEverywhere}>
            <LogOut className="h-4 w-4 mr-1" aria-hidden="true" /> Sign out on all devices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
