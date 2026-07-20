import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto pb-10 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last updated: July 2026 · Rainbow Navigator, Aotearoa New Zealand</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">What Rainbow Navigator is</h2>
        <p className="text-sm text-muted-foreground">
          A community-built map, directory, events calendar and groups platform for the
          rainbow communities of Aotearoa. It is not a hookup app, not a tracking app,
          and not an advertising platform. Information is provided in good faith from
          community knowledge and public sources — always check details (hours, venues,
          events) before travelling, as things change.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your account</h2>
        <p className="text-sm text-muted-foreground">
          Browsing needs no account. Participating (saving, checking in, rating, joining
          groups, submitting content) requires one, so contributions are accountable. Keep
          your credentials secure; you're responsible for activity on your account. You
          must be 13 or older to create an account. You can delete your account and your
          data at any time.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your content</h2>
        <p className="text-sm text-muted-foreground">
          Ratings, comments, suggestions and other content you submit remain yours. You
          grant us a licence to display them within the app (aggregated anonymously where
          the <Link className="text-primary underline" to="/privacy">Privacy Policy</Link> says
          so). Submit honestly: ratings must reflect your genuine experience, and content
          must respect the <Link className="text-primary underline" to="/code-of-conduct">Code of Conduct</Link>.
          We may remove content that breaches these terms and suspend accounts that
          repeatedly do.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Businesses and trust</h2>
        <p className="text-sm text-muted-foreground">
          Listings, rankings, ratings and badges can never be bought — by anyone, for any
          price. Businesses attempting to manipulate ratings (their own or a competitor's)
          will be removed from the directory. Community reports of unsafe experiences are
          taken seriously and reviewed by a human.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">The practical legal bits</h2>
        <p className="text-sm text-muted-foreground">
          The app is provided "as is", free of charge, without warranties; to the extent
          permitted by New Zealand law we aren't liable for losses arising from use of the
          app or reliance on listings (nothing in these terms limits your rights under the
          Consumer Guarantees Act where it applies). These terms are governed by New
          Zealand law. If we make material changes, we'll note it in the app; continued
          use means acceptance.
        </p>
      </section>

      <p className="text-sm">
        Questions: <a className="text-primary underline" href="mailto:scout.schultz.nz@gmail.com">scout.schultz.nz@gmail.com</a>
      </p>
    </div>
  );
}
