
import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EventCreationFormProps {
  groupId: string;
  groupName: string;
  onSubmit: (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: {
      name: string;
      address: string;
    };
    category: string;
  }) => void;
  onCancel: () => void;
}

export function EventCreationForm({ groupId, groupName, onSubmit, onCancel }: EventCreationFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date || !time || !locationName.trim() || !category) {
      return; // Basic validation
    }
    
    onSubmit({
      title,
      description,
      date: date.toISOString().split('T')[0],
      time,
      location: {
        name: locationName,
        address,
      },
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="Name your event"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="time">Time</Label>
          <div className="flex items-center border rounded-md">
            <Clock className="ml-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-0"
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pride">Pride</SelectItem>
            <SelectItem value="Activism">Activism</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Cultural">Cultural</SelectItem>
            <SelectItem value="Family">Family</SelectItem>
            <SelectItem value="Nightlife">Nightlife</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Educational">Educational</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="location">Location Name</Label>
        <div className="flex items-center border rounded-md">
          <MapPin className="ml-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            placeholder="Enter venue name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="border-0"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Street address, city, etc."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-rainbow-gradient hover:bg-rainbow-gradient-hover"
        >
          Create Event
        </Button>
      </div>
    </form>
  );
}
