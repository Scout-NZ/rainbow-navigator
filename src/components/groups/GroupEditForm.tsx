
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Group } from "@/data/mockData";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";

// Define the schema for group editing
const groupEditSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  rules: z.string().optional(),
  isPrivate: z.boolean().default(false),
  tags: z.string().optional(),
});

type GroupEditFormValues = z.infer<typeof groupEditSchema>;

interface GroupEditFormProps {
  group: Group;
  onSave: (updatedGroup: Partial<Group>) => void;
  onCancel: () => void;
}

export function GroupEditForm({ group, onSave, onCancel }: GroupEditFormProps) {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(group.imageUrl || null);
  
  // Initialize the form with existing group data
  const form = useForm<GroupEditFormValues>({
    resolver: zodResolver(groupEditSchema),
    defaultValues: {
      name: group.name,
      description: group.description,
      category: group.category,
      rules: "", // Rules will be added from the parent component if available
      isPrivate: group.isPrivate,
      tags: group.tags.join(", "),
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = (values: GroupEditFormValues) => {
    // Process the tags from comma-separated string to array
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
    
    // Create the updated group object
    const updatedGroup: Partial<Group> = {
      name: values.name,
      description: values.description,
      category: values.category,
      tags,
      isPrivate: values.isPrivate,
    };

    // If we have a new image, add it to the updated group
    if (imagePreview && imagePreview !== group.imageUrl) {
      updatedGroup.imageUrl = imagePreview;
    }

    // Call the onSave callback with the updated group
    onSave(updatedGroup);
    
    toast({
      title: "Group updated",
      description: "The group details have been successfully updated.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Edit Group Details</h3>
          <p className="text-sm text-muted-foreground">
            Update your group's information to help members understand what your group is about.
          </p>
        </div>

        {/* Group Image */}
        <div className="space-y-2">
          <Label>Group Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Group image preview" 
                  className="w-32 h-32 object-cover rounded-md"
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-md">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <input 
                type="file" 
                id="group-image" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('group-image')?.click()}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 800x400 pixels
              </p>
            </div>
          </div>
        </div>

        {/* Group Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="min-h-[100px]" 
                  placeholder="Describe what your group is about..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Rules */}
        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Rules</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="min-h-[100px]" 
                  placeholder="List the rules for your group, one per line..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter tags separated by commas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Setting */}
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Private Group</FormLabel>
                <p className="text-sm text-muted-foreground">
                  If enabled, only approved members can join and see content.
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Form Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
