import { Link } from "react-router-dom";

// Plain-language privacy policy. The legal document IS a product feature for
// a rainbow app: the community's trust depends on being able to read exactly
// what we do and don't collect.
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto pb-10 prose-sm space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: July 2026 · Rainbow Navigator, Aotearoa New Zealand</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">The short version</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>You can use the map, events, and groups directory without an account and without telling us anything.</li>
          <li>We never track your location. Check-in verification happens on your device and your coordinates are thrown away there — they never reach our servers.</li>
          <li>Your ratings are public only as anonymous aggregates. Nobody can see which places you rated, saved, or checked in at.</li>
          <li>We don't sell data, we don't run ads, and we never will.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What we collect</h2>
        <p className="text-sm text-muted-foreground">
          <strong>Without an account:</strong> nothing identifying. Standard server logs
          (IP addresses for security) are kept briefly by our hosting providers.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>With an account:</strong> your email, and whatever you choose to add to
          your profile (name, pronouns, identities, interests — all optional). If you sign
          in with Google we receive your email and basic profile only.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>When you participate:</strong> your saves, check-ins, ratings, comments,
          group memberships and submissions, linked to your account so you can manage them.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Location: what we deliberately don't do</h2>
        <p className="text-sm text-muted-foreground">
          Location history of rainbow community members is dangerous data, so we designed
          the app to never hold it. When you tap "Near me" or check in, the comparison
          happens on your phone; only the result ("show Wellington groups", "a check-in at
          this place happened today") reaches us — never your coordinates. Check-in counts
          and busy times are only shown publicly once at least three different people have
          checked in at a place, so no individual can be singled out.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Who else touches the data</h2>
        <p className="text-sm text-muted-foreground">
          Our infrastructure providers process data on our behalf: Supabase (database and
          sign-in, hosted in Australia), Vercel (website hosting), and Google (Maps display,
          and sign-in if you choose it). Events and place imagery come from public sources
          (Eventfinda, Humanitix, venues' own websites). We share no personal data with any
          of them beyond what running the app requires, and no data is ever sold or shared
          for advertising.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your rights</h2>
        <p className="text-sm text-muted-foreground">
          Under the Privacy Act 2020 you can request a copy of the personal information we
          hold about you, and ask us to correct or delete it. You can delete your own
          check-ins, ratings, and saves in the app; deleting your account removes your
          personal data entirely. Contact us any time at{" "}
          <a className="text-primary underline" href="mailto:scout.schultz.nz@gmail.com">scout.schultz.nz@gmail.com</a>.
          If you're not satisfied with our response you can complain to the Office of the
          Privacy Commissioner (privacy.org.nz).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Changes</h2>
        <p className="text-sm text-muted-foreground">
          If we change this policy we'll update this page and note it in the app. We will
          never weaken the location promises above — they're the foundation of the app.
        </p>
      </section>

      <p className="text-sm">
        See also: <Link className="text-primary underline" to="/terms">Terms of Use</Link> ·{" "}
        <Link className="text-primary underline" to="/code-of-conduct">Code of Conduct</Link>
      </p>
    </div>
  );
}
