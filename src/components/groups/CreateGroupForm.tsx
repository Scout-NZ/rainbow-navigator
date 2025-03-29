import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckIcon, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { mockGroups } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Group name must be at least 3 characters.",
  }).max(50, {
    message: "Group name must not exceed 50 characters."
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
  isPrivate: z.boolean().default(false),
  location: z.string().min(1, {
    message: "Location is required."
  }),
  tags: z.string().transform(val => 
    val.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean)
  ),
});

// Define the type with the transformed value
type FormValues = z.infer<typeof formSchema> & {
  tags: string[];
};

export function CreateGroupForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      isPrivate: false,
      location: "",
      tags: "",
    } as any, // Use 'as any' to bypass the type check for the initial empty string value
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      // In a real app, this would be an API call to create the group
      const newGroup = {
        id: (mockGroups.length + 1).toString(),
        name: values.name,
        category: values.category,
        description: values.description,
        isPrivate: values.isPrivate,
        location: values.location,
        tags: values.tags, // This is now correctly typed as string[] after transformation
        memberCount: 1,
        imageUrl: imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}`,
      };
      
      // Add the new group to the mock data
      mockGroups.unshift(newGroup);
      
      toast({
        title: "Group created!",
        description: "Your group was created successfully.",
      });
      
      // After creating the group, set the current user as admin
      const { createGroup } = useUser();
      createGroup(newGroup.id);
      
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  // Categories based on the existing ones in mockData plus the new ones added
  const categories = [
    "Social", "Outdoor", "Activism", "Gaming", "Support",
    "Creative", "Professional", "Family", "Entertainment", "Sports"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div 
              className="w-full h-40 bg-muted rounded-md flex items-center justify-center relative overflow-hidden"
              style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {!imageUrl && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mb-2" />
                  <span>Group image</span>
                </div>
              )}
              <Input
                type="text"
                placeholder="Enter image URL"
                className="absolute bottom-2 left-2 right-2 max-w-[calc(100%-16px)] bg-background/80 backdrop-blur-sm"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your group..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  What is your group about? What activities do you plan?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City or region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tags separated by commas" {...field} />
                </FormControl>
                <FormDescription>
                  Example: lgbtq, community, support
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Private Group</FormLabel>
                  <FormDescription>
                    Private groups require approval to join
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-rainbow-gradient hover:bg-rainbow-gradient-hover" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Create Group
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
