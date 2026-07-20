import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, MapPin, Phone, ShieldCheck } from "lucide-react";

// The safety hub: what this app is (and isn't), how we keep the map
// trustworthy, and where to get real support. Public — no login needed.
export default function SafetyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="text-center space-y-2 pt-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold">Safety comes first</h1>
        <p className="text-muted-foreground">
          Rainbow Navigator exists to help our community find each other in real
          life — safely, gently, and on your own terms.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" aria-hidden="true" />
            What this app is — and isn't
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>This is a friendship and community app.</strong> It's for finding the cafés, clubs, groups and services where rainbow people gather, so genuine connections can happen naturally.</p>
          <p><strong>It is not a hookup or dating app.</strong> There are good apps for that — this isn't one of them, by design.</p>
          <p><strong>We never track your live location.</strong> The map shows places, not people. Your location is only used, on your device, if you tap "find me" — and it's never stored or shared.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Community code of conduct</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Respect identity.</strong> Names, pronouns and identities are honoured here — all of them, always.</li>
            <li><strong>Consent in everything.</strong> Connection is invited, never pressured.</li>
            <li><strong>Protect privacy.</strong> Never share someone's identity, whereabouts or story without their okay. Outing someone is a serious violation.</li>
            <li><strong>Keep spaces safe.</strong> If a listed place isn't living up to being safe and welcoming, report it — we act on every report.</li>
            <li><strong>No harassment, no hate.</strong> Transphobia, biphobia, racism, ableism and all other flavours of harm have no place here.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            How the map stays trustworthy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium text-green-700">✓ Verified</span> places have been checked by us against current information.</p>
          <p><span className="font-medium text-amber-700">Community submitted</span> places were suggested by community members and haven't been re-verified yet — treat details as a starting point.</p>
          <p>Anyone can <Link to="/suggest" className="text-primary underline">suggest a place</Link>; every suggestion is reviewed before it appears. And every place has a report link if something's wrong or unsafe.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
            Need support right now?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium">OutLine Aotearoa</p>
              <p className="text-muted-foreground">Rainbow peer support, 6pm–9pm nightly</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="tel:08006885463">0800 688 5463</a>
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium">1737 — Need to talk?</p>
              <p className="text-muted-foreground">Free counselling, call or text, 24/7</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="tel:1737">Call/text 1737</a>
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium">Emergency</p>
              <p className="text-muted-foreground">If you're in immediate danger</p>
            </div>
            <Button asChild variant="destructive" size="sm">
              <a href="tel:111">Call 111</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Our commitments to you:{" "}
        <Link className="text-primary underline" to="/code-of-conduct">Code of Conduct</Link> ·{" "}
        <Link className="text-primary underline" to="/privacy">Privacy Policy</Link> ·{" "}
        <Link className="text-primary underline" to="/terms">Terms of Use</Link>
      </p>
    </div>
  );
}
