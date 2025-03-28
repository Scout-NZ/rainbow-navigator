
import { Calendar, Compass, Heart, MessageSquare, Settings, User } from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType;
};

export const navItems: NavItem[] = [
  {
    label: "Discover",
    path: "/",
    icon: Compass
  },
  {
    label: "Connect",
    path: "/connect",
    icon: MessageSquare
  },
  {
    label: "Events",
    path: "/events",
    icon: Calendar
  },
  {
    label: "Resources",
    path: "/resources",
    icon: Heart
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User
  }
];

export type Place = {
  id: string;
  name: string;
  type: "business" | "event" | "resource";
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  rating?: number;
  verified: boolean;
  imageUrl?: string;
  tags: string[];
  description: string;
};

export type Group = {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  description: string;
  imageUrl?: string;
  isPrivate: boolean;
  location: string;
  tags: string[];
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  organizer: {
    name: string;
    id: string;
    imageUrl?: string;
  };
  imageUrl?: string;
  description: string;
  attendees: number;
  category: string;
  tags: string[];
  price?: string;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  provider: string;
  description: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  location?: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  imageUrl?: string;
};

export type Post = {
  id: string;
  userId: string;
  userName: string;
  userImageUrl?: string;
  content: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  location?: string;
  interests: string[];
  friends: number;
  groups: number;
  events: number;
  joined: string;
};

// Mock data for places (businesses, events, resources)
export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Rainbow Café",
    type: "business",
    category: "Café",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "123 Pride Street",
      city: "New York"
    },
    rating: 4.8,
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56",
    tags: ["café", "inclusive", "trans-friendly"],
    description: "A cozy café with inclusive atmosphere and great coffee. Regular community events and meetups."
  },
  {
    id: "2",
    name: "Spectrum Bookstore",
    type: "business",
    category: "Books & Media",
    location: {
      lat: 40.7138,
      lng: -74.0070,
      address: "456 Equality Avenue",
      city: "New York"
    },
    rating: 4.6,
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1521056787327-266e2587772f",
    tags: ["bookstore", "queer-owned", "inclusive"],
    description: "LGBTQ+ focused bookstore with a wide selection of queer literature, history, and art books."
  },
  {
    id: "3",
    name: "Pride Health Clinic",
    type: "resource",
    category: "Healthcare",
    location: {
      lat: 40.7148,
      lng: -74.0080,
      address: "789 Rainbow Road",
      city: "New York"
    },
    rating: 4.9,
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf",
    tags: ["healthcare", "trans-care", "mental-health"],
    description: "Specialized healthcare services for LGBTQ+ individuals including gender-affirming care and counseling."
  },
  {
    id: "4",
    name: "Colorful Threads",
    type: "business",
    category: "Clothing",
    location: {
      lat: 40.7158,
      lng: -74.0090,
      address: "321 Diversity Drive",
      city: "New York"
    },
    rating: 4.5,
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
    tags: ["clothing", "pride-merchandise", "queer-owned"],
    description: "Gender-affirming clothing store with a focus on comfortable and stylish options for everyone."
  },
  {
    id: "5",
    name: "Unity Nightclub",
    type: "business",
    category: "Nightlife",
    location: {
      lat: 40.7168,
      lng: -74.0100,
      address: "555 Liberty Lane",
      city: "New York"
    },
    rating: 4.7,
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
    tags: ["nightclub", "dancing", "drag-shows"],
    description: "Popular nightclub with inclusive atmosphere, regular drag shows, and themed party nights."
  }
];

// Mock data for groups
export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Queer Book Club",
    category: "Social",
    memberCount: 87,
    description: "Monthly meetings to discuss LGBTQ+ literature and connect with fellow readers.",
    imageUrl: "https://images.unsplash.com/photo-1530538987395-032d1900e591",
    isPrivate: false,
    location: "New York",
    tags: ["books", "discussion", "social"]
  },
  {
    id: "2",
    name: "Rainbow Hikers",
    category: "Outdoor",
    memberCount: 124,
    description: "Group for LGBTQ+ people who love hiking, camping, and outdoor adventures.",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    isPrivate: false,
    location: "New York",
    tags: ["hiking", "outdoors", "adventure"]
  },
  {
    id: "3",
    name: "Pride Advocacy Network",
    category: "Activism",
    memberCount: 342,
    description: "Coalition working for LGBTQ+ rights through political action and community organizing.",
    imageUrl: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4",
    isPrivate: false,
    location: "New York",
    tags: ["activism", "politics", "advocacy"]
  },
  {
    id: "4",
    name: "Queer Gamers Guild",
    category: "Gaming",
    memberCount: 156,
    description: "Safe space for LGBTQ+ gamers to connect, play, and discuss games.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    isPrivate: false,
    location: "Online",
    tags: ["gaming", "e-sports", "social"]
  },
  {
    id: "5",
    name: "Trans Support Circle",
    category: "Support",
    memberCount: 93,
    description: "Support group for transgender, non-binary, and gender non-conforming individuals.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    isPrivate: true,
    location: "New York",
    tags: ["support", "trans", "mental-health"]
  }
];

// Mock data for events
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Pride Month Kick-Off Party",
    date: "2023-06-01",
    time: "19:00",
    location: {
      name: "Unity Nightclub",
      address: "555 Liberty Lane, New York",
      lat: 40.7168,
      lng: -74.0100
    },
    organizer: {
      name: "NYC Pride",
      id: "org1",
      imageUrl: "https://images.unsplash.com/photo-1575472782454-bf0a7f9fe625"
    },
    imageUrl: "https://images.unsplash.com/photo-1561612217-e5147162fd31",
    description: "Join us for the official kick-off celebration of Pride Month with music, performances, and community.",
    attendees: 325,
    category: "Party",
    tags: ["pride", "celebration", "party"],
    price: "Free"
  },
  {
    id: "2",
    title: "Queer Art Exhibition",
    date: "2023-06-10",
    time: "14:00",
    location: {
      name: "Rainbow Gallery",
      address: "789 Creative Street, New York",
      lat: 40.7178,
      lng: -74.0110
    },
    organizer: {
      name: "Queer Artists Collective",
      id: "org2",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
    },
    imageUrl: "https://images.unsplash.com/photo-1545989253-02cc26577f88",
    description: "Exhibition showcasing artwork by local LGBTQ+ artists exploring themes of identity and community.",
    attendees: 150,
    category: "Art",
    tags: ["art", "exhibition", "culture"],
    price: "$10"
  },
  {
    id: "3",
    title: "Trans Rights Rally",
    date: "2023-06-15",
    time: "12:00",
    location: {
      name: "City Hall Park",
      address: "City Hall, New York",
      lat: 40.7128,
      lng: -74.0060
    },
    organizer: {
      name: "Trans Action Network",
      id: "org3",
      imageUrl: "https://images.unsplash.com/photo-1592621385612-4d7129426394"
    },
    imageUrl: "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d",
    description: "Peaceful demonstration in support of transgender rights and visibility.",
    attendees: 500,
    category: "Activism",
    tags: ["trans", "rights", "rally"],
    price: "Free"
  },
  {
    id: "4",
    title: "Drag Queen Story Hour",
    date: "2023-06-20",
    time: "11:00",
    location: {
      name: "Community Library",
      address: "123 Reading Avenue, New York",
      lat: 40.7138,
      lng: -74.0070
    },
    organizer: {
      name: "Inclusive Education Initiative",
      id: "org4",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
    },
    imageUrl: "https://images.unsplash.com/photo-1485221237651-96bc8d4ab392",
    description: "Family-friendly storytelling event featuring local drag performers reading inclusive children's books.",
    attendees: 75,
    category: "Family",
    tags: ["family", "drag", "education"],
    price: "Free"
  },
  {
    id: "5",
    title: "Pride Parade",
    date: "2023-06-25",
    time: "10:00",
    location: {
      name: "Downtown",
      address: "Main Street, New York",
      lat: 40.7148,
      lng: -74.0080
    },
    organizer: {
      name: "NYC Pride",
      id: "org1",
      imageUrl: "https://images.unsplash.com/photo-1575472782454-bf0a7f9fe625"
    },
    imageUrl: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f",
    description: "Annual Pride Parade celebrating the LGBTQ+ community with floats, performances, and community groups.",
    attendees: 10000,
    category: "Parade",
    tags: ["pride", "parade", "celebration"],
    price: "Free"
  }
];

// Mock data for resources
export const mockResources: Resource[] = [
  {
    id: "1",
    title: "LGBTQ+ Legal Aid Network",
    category: "Legal",
    provider: "Rainbow Rights Coalition",
    description: "Free legal consultation and representation for LGBTQ+ individuals facing discrimination or legal challenges.",
    contact: {
      phone: "555-123-4567",
      email: "help@lgbtlegalaid.org",
      website: "www.lgbtlegalaid.org"
    },
    location: {
      address: "100 Justice Lane",
      city: "New York",
      lat: 40.7128,
      lng: -74.0060
    },
    tags: ["legal", "discrimination", "rights"],
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
  },
  {
    id: "2",
    title: "Queer Youth Housing Program",
    category: "Housing",
    provider: "Safe Horizons",
    description: "Emergency and transitional housing services for LGBTQ+ youth experiencing homelessness.",
    contact: {
      phone: "555-987-6543",
      email: "housing@safehorizons.org",
      website: "www.safehorizons.org/lgbtq-housing"
    },
    location: {
      address: "250 Shelter Street",
      city: "New York",
      lat: 40.7138,
      lng: -74.0070
    },
    tags: ["housing", "youth", "emergency"],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
  },
  {
    id: "3",
    title: "Gender-Affirming Healthcare Directory",
    category: "Healthcare",
    provider: "Trans Health Initiative",
    description: "Comprehensive directory of healthcare providers offering gender-affirming care and services.",
    contact: {
      email: "info@transhealth.org",
      website: "www.transhealth.org/directory"
    },
    tags: ["healthcare", "trans", "gender-affirming"],
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf"
  },
  {
    id: "4",
    title: "LGBTQ+ Crisis Hotline",
    category: "Mental Health",
    provider: "Rainbow Support Network",
    description: "24/7 crisis intervention and suicide prevention services for LGBTQ+ individuals in distress.",
    contact: {
      phone: "1-800-PRIDE-HELP",
      website: "www.rainbowsupport.org"
    },
    tags: ["crisis", "mental-health", "support"],
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624"
  },
  {
    id: "5",
    title: "Queer Financial Aid Scholarships",
    category: "Education",
    provider: "Pride Education Fund",
    description: "Scholarships and financial assistance for LGBTQ+ students pursuing higher education.",
    contact: {
      email: "scholarships@prideeducation.org",
      website: "www.prideeducation.org"
    },
    tags: ["education", "scholarships", "financial-aid"],
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
  }
];

// Mock data for posts
export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alex Rivera",
    userImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content: {
      text: "Just attended my first Pride parade! The energy was incredible and I felt so welcomed. #PrideMonth #Community",
      imageUrl: "https://images.unsplash.com/photo-1563506644863-444710d1f416"
    },
    createdAt: "2023-06-25T15:30:00Z",
    likes: 124,
    comments: 18,
    shares: 5,
    tags: ["pride", "community", "celebration"]
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jordan Lee",
    userImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    content: {
      text: "My journey with gender-affirming care has been life-changing. Happy to share my experience with anyone who has questions.",
      imageUrl: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f"
    },
    createdAt: "2023-06-24T12:15:00Z",
    likes: 256,
    comments: 42,
    shares: 23,
    tags: ["trans", "healthcare", "journey"]
  },
  {
    id: "3",
    userId: "user3",
    userName: "Morgan Taylor",
    userImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content: {
      videoUrl: "example-video-url.mp4",
      text: "Check out my recap of yesterday's Queer Art Exhibition! So many talented artists in our community."
    },
    createdAt: "2023-06-11T18:45:00Z",
    likes: 89,
    comments: 12,
    shares: 7,
    tags: ["art", "exhibition", "talent"]
  },
  {
    id: "4",
    userId: "user4",
    userName: "Sam Johnson",
    userImageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    content: {
      text: "Proud to announce that our Rainbow Hikers group just raised $5,000 for LGBTQ+ youth programs! Thanks to everyone who participated in our charity hike."
    },
    createdAt: "2023-06-20T09:30:00Z",
    likes: 312,
    comments: 28,
    shares: 41,
    tags: ["fundraising", "outdoors", "charity"]
  },
  {
    id: "5",
    userId: "user5",
    userName: "Riley Chen",
    userImageUrl: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb",
    content: {
      text: "Today marks 5 years since I came out! Feeling grateful for the supportive community I've found. ❤️🧡💛💚💙💜",
      imageUrl: "https://images.unsplash.com/photo-1596890096735-5d7f6f02d2dd"
    },
    createdAt: "2023-06-15T21:00:00Z",
    likes: 478,
    comments: 63,
    shares: 12,
    tags: ["coming-out", "anniversary", "gratitude"]
  }
];

// Mock user profile
export const mockUserProfile: UserProfile = {
  id: "user1",
  name: "Alex Rivera",
  username: "@alexrivera",
  bio: "Queer artist and advocate passionate about community building and inclusive spaces.",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  location: "New York, NY",
  interests: ["art", "activism", "nature", "books"],
  friends: 186,
  groups: 5,
  events: 12,
  joined: "2022-03-15"
};
