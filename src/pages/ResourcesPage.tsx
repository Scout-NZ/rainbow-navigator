import { useEffect, useState } from "react";
import { BookOpen, Filter, Phone, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { mockResources, Resource } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getCategoryImage } from "@/lib/categoryImages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CombinedResource = Resource;

const healthcareTags = [
  "All", 
  "GP", 
  "Health Network", 
  "Health Centre", 
  "Sexual Health Clinic", 
  "Voice Therapy", 
  "Mental Health", 
  "Counselor", 
  "Psychotherapist", 
  "Clinical Psychologist", 
  "Endocrinologist", 
  "Laser Clinic and Hair", 
  "Other"
];

const resourceCategories = [
  "All",
  "Healthcare",
  "Legal",
  "Housing",
  "Education",
  "Mental Health",
  "Crisis",
  "Youth",
  "Trans"
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<CombinedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealthcareTag, setSelectedHealthcareTag] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchHealthcareLocations() {
      try {
        const { data: locations, error } = await supabase
          .from('locations')
          .select('*')
          .eq('category', 'Healthcare')
          .order('name');

        if (error) {
          console.error("Error fetching healthcare locations:", error);
          toast({
            title: "Error loading healthcare resources",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched healthcare locations:", locations);

        const healthcareResources: CombinedResource[] = locations.map(location => ({
          id: location.id,
          title: location.name,
          category: "Healthcare",
          provider: location.name,
          description: location.description || "Healthcare provider",
          contact: {
            phone: location.phone,
            email: location.email,
            website: location.website,
          },
          location: {
            address: location.address || "",
            city: location.city || "",
            lat: location.lat || 0,
            lng: location.lng || 0,
            neighbourhood: "",
          },
          tags: location.tags || ["healthcare"],
          imageUrl: location.image_url || getCategoryImage(location.category),
          url: location.website || "",
          source: "database",
          featured: false,
          createdAt: new Date().toISOString(),
        }));

        const otherCategoryResources: CombinedResource[] = mockResources.filter(
          resource => resource.category.toLowerCase() !== "healthcare"
        ).map(resource => ({
          ...resource,
          provider: resource.source,
          contact: {
            website: resource.url
          }
        }));
        
        setResources([...healthcareResources, ...otherCategoryResources]);
      } catch (error) {
        console.error("Failed to fetch healthcare locations:", error);
        toast({
          title: "Error",
          description: "Failed to load healthcare resources. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHealthcareLocations();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== "Healthcare") {
      setSelectedHealthcareTag("All");
    }
  };

  const resourcesByCategory = resources.reduce((groups, resource) => {
    const category = resource.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(resource);
    return groups;
  }, {} as Record<string, CombinedResource[]>);

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const filteredHealthcareResources = resourcesByCategory["Healthcare"] ? 
    resourcesByCategory["Healthcare"].filter(resource => {
      if (selectedHealthcareTag === "All") return true;
      return resource.tags.some(tag => 
        tag.toLowerCase() === selectedHealthcareTag.toLowerCase());
    }) : [];

  const displayedCategories = selectedCategory === "All" 
    ? Object.keys(resourcesByCategory) 
    : [selectedCategory];

  return (
    <div className="pb-4">
      <div className="flex justify-end items-center mb-4">
        <Button 
          size="sm"
          className="rounded-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
        <div className="flex items-center gap-2 mb-4 px-1">
          {resourceCategories.map(category => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full cursor-pointer px-4 py-2 ${
                selectedCategory === category 
                  ? "bg-primary text-white" 
                  : "bg-background hover:bg-muted/50"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </ScrollArea>
      
      <Tabs defaultValue="directory">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="directory" className="flex-1">Directory</TabsTrigger>
          <TabsTrigger value="news" className="flex-1">News & Updates</TabsTrigger>
          <TabsTrigger value="emergency" className="flex-1">Emergency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="mt-0 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : (
            <>
              {selectedCategory === "All" || selectedCategory === "Healthcare" ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Healthcare Resources
                    </h2>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Filter by Type</span>
                          {selectedHealthcareTag !== "All" && (
                            <Badge className="ml-1 bg-primary/20 text-primary border-0 text-xs">
                              {selectedHealthcareTag}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-popover">
                        {healthcareTags.map(tag => (
                          <DropdownMenuCheckboxItem
                            key={tag}
                            checked={selectedHealthcareTag === tag}
                            onCheckedChange={() => setSelectedHealthcareTag(tag)}
                            className="cursor-pointer"
                          >
                            {tag}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {selectedHealthcareTag !== "All" && (
                    <div className="mb-3 flex items-center">
                      <Badge className="bg-primary/10 text-primary border-0 flex gap-1 items-center">
                        {selectedHealthcareTag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSelectedHealthcareTag("All")}
                        />
                      </Badge>
                    </div>
                  )}
                  
                  {filteredHealthcareResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredHealthcareResources.map(resource => (
                        <ResourceCard key={String(resource.id)} resource={resource} />
                      ))}
                    </div>
                  ) : (
                    <Card className="mb-4">
                      <CardContent className="py-6 text-center">
                        <p className="text-muted-foreground">
                          {selectedHealthcareTag === "All" 
                            ? "No healthcare resources found." 
                            : `No healthcare resources found with tag: ${selectedHealthcareTag}`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : null}
              
              {displayedCategories
                .filter(category => category.toLowerCase() !== "healthcare")
                .map(category => {
                  const categoryResources = resourcesByCategory[category] || [];
                  
                  return (
                    <div key={category}>
                      <h2 className="text-lg font-semibold mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        {category} Resources
                      </h2>
                      {categoryResources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryResources.map(resource => (
                            <ResourceCard key={String(resource.id)} resource={resource} />
                          ))}
                        </div>
                      ) : (
                        <Card className="mb-4">
                          <CardContent className="py-6 text-center">
                            <p className="text-muted-foreground">No {category.toLowerCase()} resources found.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  );
                })
              }
            </>
          )}
        </TabsContent>
        
        <TabsContent value="news" className="mt-0">
          <Card className="mb-4">
            <CardContent className="p-0">
              <div 
                className="h-40 bg-muted bg-cover bg-center relative"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1569937756447-1d44f657cd7b)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="mb-2 bg-rainbow-gradient text-white border-0">
                    Featured
                  </Badge>
                  <h2 className="text-xl font-bold text-white">
                    New Gender-Affirming Care Guidelines Released
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  The National Health Association has released updated guidelines for gender-affirming care, 
                  expanding access and improving standards for transgender and non-binary individuals.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">June 15, 2023</span>
                  <Button variant="link" size="sm" className="text-primary p-0">
                    Read More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="card-hover">
                <CardContent className="p-3 flex gap-3">
                  <div 
                    className="h-20 w-20 bg-muted rounded-md bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(https://picsum.photos/200/200?random=${i})` }}
                  />
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Local</Badge>
                    <h3 className="font-semibold">Community Center Announces Summer Program</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                      The Rainbow Community Center will offer free programs for LGBTQ+ youth this summer.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">June 10, 2023</span>
                      <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-0">
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4 flex gap-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Emergency Support Line</h3>
                <p className="text-sm mb-2">
                  24/7 crisis intervention and suicide prevention services for LGBTQ+ individuals in distress.
                </p>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Call 1-800-PRIDE-HELP
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <h3 className="text-lg font-semibold mb-3">Emergency Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockResources.filter(r => r.category === "Mental Health" || r.category === "Healthcare").map(resource => (
              <ResourceCard key={String(resource.id)} resource={resource} />
            ))}
          </div>
          
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Safety Tips</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="h-5 min-w-5 rounded-full bg-rainbow-gradient flex items-center justify-center text-white font-bold">1</span>
                  <span>If you feel unsafe, move to a public place with other people around.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 min-w-5 rounded-full bg-rainbow-gradient flex items-center justify-center text-white font-bold">2</span>
                  <span>Share your location with a trusted friend when meeting someone new.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 min-w-5 rounded-full bg-rainbow-gradient flex items-center justify-center text-white font-bold">3</span>
                  <span>Use the emergency features in the app to quickly contact support if needed.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
