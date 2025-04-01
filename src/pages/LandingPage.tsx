
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-6 rainbow-text">Rainbow Navigator App</h1>
      <p className="text-xl mb-8 max-w-md">
        This is a standalone app page. Your main website content would be at the root domain.
      </p>
      <Button className="bg-rainbow-gradient" asChild>
        <Link to="/">Enter App</Link>
      </Button>
    </div>
  );
};

export default LandingPage;
