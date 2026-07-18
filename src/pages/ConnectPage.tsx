import { useState } from "react";
import { Search, Users, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { GroupCard } from "@/components/groups/GroupCard";
import { mockGroups } from "@/data/mockData";

export default function ConnectPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-4">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search communities..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="groups">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="groups" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="people" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-0">
          {/* Honest preview notice: groups aren't shared between users yet */}
          <Card className="mb-4 border-amber-200 bg-amber-50">
            <CardContent className="p-3 text-sm text-amber-900">
              <strong>Early preview.</strong> These example communities are for
              exploring the design — posts and membership currently only save on
              your own device. Real, shared communities are coming soon.
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredGroups.slice(0, 4).map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-4">All Communities</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} isCompact />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people" className="mt-0">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-rainbow-gradient flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold">Finding people — coming soon</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We're building people discovery carefully, with real profiles,
                consent and safety controls — never fake accounts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
