import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type ComingSoonPageProps = {
  title: string;
  description: string;
};

// Honest placeholder for features that aren't real yet. We show this instead
// of mock data so the app never pretends something works when it doesn't.
export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground">
            We'd rather tell you honestly than show you something that doesn't work yet.
          </p>
          <Button asChild className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
            <Link to="/">Explore the map</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
