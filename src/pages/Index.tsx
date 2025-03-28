
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero section with gradient background like the image */}
      <section className="w-full rounded-b-3xl overflow-hidden bg-gradient-to-r from-rainbow-orange via-rainbow-yellow to-rainbow-green p-6 pb-12">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 max-w-xl">
            <h1 className="text-4xl font-bold text-white">
              Welcome to Rainbow Navigator
            </h1>
            <p className="text-xl text-white/90">
              Your vibrant hub for connecting with LGBTQ+ spaces, events, and resources
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button className="rainbow-btn" asChild>
                <Link to="/discover">Explore Map</Link>
              </Button>
              <Button variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30" asChild>
                <Link to="/connect">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content section */}
      <section className="container py-8 px-4 mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Discover Queer-Friendly Spaces</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-hover p-6 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center mb-2">
                <span className="text-white text-xl">🗺️</span>
              </div>
              <h3 className="text-xl font-medium">Safe Spaces</h3>
              <p className="text-muted-foreground">Find LGBTQ+ friendly venues, businesses, and community spaces near you.</p>
            </div>
          </div>

          <div className="card-hover p-6 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center mb-2">
                <span className="text-white text-xl">📅</span>
              </div>
              <h3 className="text-xl font-medium">Local Events</h3>
              <p className="text-muted-foreground">Stay updated on pride events, meetups, and social gatherings in your area.</p>
            </div>
          </div>

          <div className="card-hover p-6 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center mb-2">
                <span className="text-white text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-medium">Community Support</h3>
              <p className="text-muted-foreground">Connect with organizations offering resources and support for the queer community.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button className="rainbow-btn" size="lg" asChild>
            <Link to="/discover">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
