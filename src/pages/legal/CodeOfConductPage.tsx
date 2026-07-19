import { Link } from "react-router-dom";

export default function CodeOfConductPage() {
  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Code of Conduct</h1>
        <p className="text-sm text-muted-foreground">
          The agreements that keep this space safe. They apply to everyone — members,
          group organisers, and listed businesses alike.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🏳️‍🌈 Respect every identity</h2>
        <p className="text-sm text-muted-foreground">
          All sexualities, genders, and expressions belong here — takatāpui, MVPFAFF+,
          trans and non-binary whānau, intersex people, aces and aros, questioning folks,
          and allies acting in good faith. Use people's names and pronouns. Debating
          anyone's right to exist is not debate; it's harm, and it gets removed.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🤐 Never out anyone</h2>
        <p className="text-sm text-muted-foreground">
          What people share here stays here. Never reveal someone's identity, presence at
          a place or event, or group membership outside the app — including screenshots.
          Some of our community are not out; treating every member as potentially closeted
          is how we all stay safe.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">💛 Rate honestly, from experience</h2>
        <p className="text-sm text-muted-foreground">
          Rainbow ratings exist so the community can trust the map. Rate only places
          you've genuinely visited, answer only the colours you can speak to, and never
          rate to promote or punish beyond your real experience. Business owners: never
          rate your own place or a competitor's — it will be detected and removed.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🛡️ No harassment, ever</h2>
        <p className="text-sm text-muted-foreground">
          No hate speech, slurs, threats, unwelcome sexual content, or targeting of any
          person or group — inside our community or towards it. This includes dogpiling
          and brigading. One serious breach is enough for removal.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🌱 Look after the spaces</h2>
        <p className="text-sm text-muted-foreground">
          The venues and groups listed here are real community treasures, often volunteer-
          run. Show up kindly, respect their rules, and remember that how we behave in
          listed spaces reflects on the whole community.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🚨 Report, and we act</h2>
        <p className="text-sm text-muted-foreground">
          See something unsafe — in the app or at a listed place? Use the report button
          (no account needed) or email{" "}
          <a className="text-primary underline" href="mailto:scout.schultz.nz@gmail.com">scout.schultz.nz@gmail.com</a>.
          Every report is reviewed by a human. Consequences scale from content removal to
          permanent bans, and safety reports about places can affect their visibility on
          the map. If you're in immediate danger, call 111. For support, OutLine Aotearoa
          is at 0800 688 5463 (6pm–9pm nightly).
        </p>
      </section>

      <p className="text-sm">
        See also: <Link className="text-primary underline" to="/privacy">Privacy Policy</Link> ·{" "}
        <Link className="text-primary underline" to="/terms">Terms of Use</Link>
      </p>
    </div>
  );
}
