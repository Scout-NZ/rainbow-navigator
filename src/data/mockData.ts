export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  neighbourhood: string;
  lat: number;
  lng: number;
  category: string;
  type: string;
  tags: string[];
  lgbt_status: string;
  description: string;
  image_url: string;
  website: string;
  email: string;
  phone: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export type Group = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  members: string[];
  admins: string[];
}

export type Event = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
  };
  price: string;
  attendees: number;
  tags: string[];
}

export type Resource = {
  id: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  imageUrl?: string;
  location?: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    neighbourhood?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  tags: string[];
};

export const mockLocations: Location[] = [
  {
    id: "location1",
    name: "The Lavender Lounge",
    address: "123 Main St",
    city: "New York",
    neighbourhood: "Greenwich Village",
    lat: 40.7128,
    lng: -74.0060,
    category: "Bar",
    type: "Nightlife",
    tags: ["LGBTQ+", "Bar", "Drinks", "Social"],
    lgbt_status: "Safe Space",
    description: "A cozy and inclusive bar for the LGBTQ+ community.",
    image_url: "https://example.com/lavenderlounge.jpg",
    website: "https://lavenderlounge.com",
    email: "info@lavenderlounge.com",
    phone: "555-1234",
    verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "location2",
    name: "Rainbow Community Center",
    address: "456 Oak St",
    city: "San Francisco",
    neighbourhood: "Castro",
    lat: 37.7749,
    lng: -122.4194,
    category: "Community Center",
    type: "Community",
    tags: ["LGBTQ+", "Community", "Support", "Events"],
    lgbt_status: "Affirming",
    description: "A community center providing resources and support for the LGBTQ+ community.",
    image_url: "https://example.com/rainbowcenter.jpg",
    website: "https://rainbowcenter.org",
    email: "info@rainbowcenter.org",
    phone: "555-5678",
    verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "location3",
    name: "Pride Bookstore",
    address: "789 Pine St",
    city: "Seattle",
    neighbourhood: "Capitol Hill",
    lat: 47.6062,
    lng: -122.3321,
    category: "Bookstore",
    type: "Shopping",
    tags: ["LGBTQ+", "Bookstore", "Books", "Reading"],
    lgbt_status: "Safe Space",
    description: "A bookstore specializing in LGBTQ+ literature.",
    image_url: "https://example.com/pridebookstore.jpg",
    website: "https://pridebookstore.com",
    email: "info@pridebookstore.com",
    phone: "555-9012",
    verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "location4",
    name: "Transcend Gym",
    address: "101 Elm St",
    city: "Los Angeles",
    neighbourhood: "West Hollywood",
    lat: 34.0522,
    lng: -118.2437,
    category: "Gym",
    type: "Fitness",
    tags: ["LGBTQ+", "Gym", "Fitness", "Health"],
    lgbt_status: "Affirming",
    description: "A gym that is trans-friendly and offers a safe space for all.",
    image_url: "https://example.com/transcendgym.jpg",
    website: "https://transcendgym.com",
    email: "info@transcendgym.com",
    phone: "555-3456",
    verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "location5",
    name: "Equality Law Firm",
    address: "222 Oak St",
    city: "Chicago",
    neighbourhood: "Uptown",
    lat: 41.8781,
    lng: -87.6298,
    category: "Law Firm",
    type: "Legal",
    tags: ["LGBTQ+", "Law Firm", "Legal", "Support"],
    lgbt_status: "Affirming",
    description: "A law firm specializing in LGBTQ+ legal issues.",
    image_url: "https://example.com/equalitylaw.jpg",
    website: "https://equalitylaw.com",
    email: "info@equalitylaw.com",
    phone: "555-7890",
    verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
];

export const mockGroups: Group[] = [
  {
    id: "group1",
    name: "Rainbow Hikers",
    category: "Outdoors",
    description: "A group for LGBTQ+ individuals who enjoy hiking and outdoor activities.",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
    memberCount: 42,
    isPrivate: false,
    tags: ["Outdoors", "Hiking", "Social", "LGBTQ+"],
    members: ["user1", "user2", "user3"],
    admins: ["user1"],
  },
  {
    id: "group2",
    name: "Queer Book Club",
    category: "Culture",
    description: "A book club for discussing LGBTQ+ literature and related topics.",
    imageUrl: "https://images.unsplash.com/photo-1450107579224-2d9b2bf1adc8?q=80&w=1000&auto=format&fit=crop",
    memberCount: 56,
    isPrivate: false,
    tags: ["Culture", "Books", "Discussion", "LGBTQ+"],
    members: ["user2", "user3", "user4"],
    admins: ["user2"],
  },
  {
    id: "group3",
    name: "Trans Support Network",
    category: "Support",
    description: "A support group for transgender individuals and their allies.",
    imageUrl: "https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=1000&auto=format&fit=crop",
    memberCount: 103,
    isPrivate: true,
    tags: ["Support", "Transgender", "Community", "LGBTQ+"],
    members: ["user1", "user5", "user6"],
    admins: ["user5"],
  },
  {
    id: "group4",
    name: "Gaymer Group",
    category: "Social",
    description: "A social group for LGBTQ+ gamers to connect and play together.",
    imageUrl: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=1000&auto=format&fit=crop",
    memberCount: 78,
    isPrivate: false,
    tags: ["Social", "Gaming", "Community", "LGBTQ+"],
    members: ["user3", "user4", "user7"],
    admins: ["user3"],
  },
  {
    id: "group5",
    name: "Lesbian Art Collective",
    category: "Art",
    description: "A collective for lesbian artists to share their work and collaborate.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
    memberCount: 35,
    isPrivate: true,
    tags: ["Art", "Community", "Collaboration", "LGBTQ+"],
    members: ["user8", "user9", "user10"],
    admins: ["user8"],
  },
];

export const mockEvents: Event[] = [
  {
    id: "event1",
    title: "Pride Parade",
    category: "Pride",
    description: "Join us for the annual Pride Parade!",
    imageUrl: "https://images.unsplash.com/photo-1570976447640-ac859a116aab?q=80&w=1000&auto=format&fit=crop",
    date: "2024-08-20",
    time: "12:00 PM",
    location: {
      name: "Downtown",
      address: "Main Street",
    },
    price: "Free",
    attendees: 500,
    tags: ["Pride", "Parade", "Community", "Celebration"],
  },
  {
    id: "event2",
    title: "Queer Poetry Slam",
    category: "Culture",
    description: "An evening of queer poetry and spoken word.",
    imageUrl: "https://images.unsplash.com/photo-1543337724-5030f4448294?q=80&w=1000&auto=format&fit=crop",
    date: "2024-08-25",
    time: "7:00 PM",
    location: {
      name: "The Bean Scene",
      address: "123 Coffee St",
    },
    price: "$5",
    attendees: 50,
    tags: ["Culture", "Poetry", "LGBTQ+", "Art"],
  },
  {
    id: "event3",
    title: "Transgender Day of Remembrance",
    category: "Activism",
    description: "A vigil to honor transgender individuals who have lost their lives to violence.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Transgender_flag.svg/1200px-Transgender_flag.svg.png",
    date: "2024-11-20",
    time: "6:00 PM",
    location: {
      name: "Community Park",
      address: "456 Park Ave",
    },
    price: "Free",
    attendees: 100,
    tags: ["Activism", "Transgender", "Remembrance", "Community"],
  },
  {
    id: "event4",
    title: "LGBTQ+ Board Game Night",
    category: "Social",
    description: "A fun night of board games and socializing for the LGBTQ+ community.",
    imageUrl: "https://images.unsplash.com/photo-1549608078-145b58c46dd4?q=80&w=1000&auto=format&fit=crop",
    date: "2024-09-10",
    time: "7:30 PM",
    location: {
      name: "Gamezilla",
      address: "789 Boardgame Blvd",
    },
    price: "$10",
    attendees: 30,
    tags: ["Social", "Gaming", "LGBTQ+", "Community"],
  },
  {
    id: "event5",
    title: "Drag Show",
    category: "Nightlife",
    description: "An evening of fabulous drag performances!",
    imageUrl: "https://images.unsplash.com/photo-1604318782944-71099352906b?q=80&w=1000&auto=format&fit=crop",
    date: "2024-09-15",
    time: "9:00 PM",
    location: {
      name: "The Glitterati Lounge",
      address: "101 Sparkle St",
    },
    price: "$15",
    attendees: 75,
    tags: ["Nightlife", "Drag", "Performance", "LGBTQ+"],
  },
];

export type PostContent = {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export type Post = {
  id: string;
  userName: string;
  userImageUrl: string;
  createdAt: string;
  content: PostContent;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

export const mockPosts: Post[] = [
  {
    id: "post1",
    userName: "Alex Rivera",
    userImageUrl: "/lovable-uploads/81d7e401-05ab-439f-9086-8a67457532e2.png",
    createdAt: "2024-08-15T10:30:00Z",
    content: {
      text: "Had an amazing time at the Pride Parade today! So much love and community spirit 🌈✨",
      imageUrl: "https://images.unsplash.com/photo-1570976447640-ac859a116aab?q=80&w=1000&auto=format&fit=crop"
    },
    likes: 87,
    comments: 12,
    shares: 5,
    tags: ["Pride", "Community", "Celebration"]
  },
  {
    id: "post2",
    userName: "Jamie Wong",
    userImageUrl: "/lovable-uploads/bd55a184-9d3b-4c0b-b50c-b212d4be16a8.png",
    createdAt: "2024-08-14T15:45:00Z",
    content: {
      text: "Just joined the Rainbow Hikers group! Looking forward to our first mountain adventure this weekend.",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop"
    },
    likes: 42,
    comments: 8,
    shares: 2,
    tags: ["Outdoors", "Community", "GroupActivities"]
  },
  {
    id: "post3",
    userName: "Sam Taylor",
    userImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
    createdAt: "2024-08-13T09:15:00Z",
    content: {
      text: "Our local queer book club discussion about 'Giovanni's Room' was so insightful. Love these meaningful conversations!",
      imageUrl: "https://images.unsplash.com/photo-1450107579224-2d9b2bf1adc8?q=80&w=1000&auto=format&fit=crop"
    },
    likes: 56,
    comments: 23,
    shares: 7,
    tags: ["Culture", "Literature", "Discussion"]
  },
  {
    id: "post4",
    userName: "Jordan Lee",
    userImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    createdAt: "2024-08-12T18:20:00Z",
    content: {
      text: "Advocacy workshop was super informative today. Learned so much about how we can better support our trans community members.",
      imageUrl: "https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=1000&auto=format&fit=crop"
    },
    likes: 103,
    comments: 31,
    shares: 18,
    tags: ["Activism", "Education", "Support"]
  },
  {
    id: "post5",
    userName: "Riley Johnson",
    userImageUrl: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=1000&auto=format&fit=crop",
    createdAt: "2024-08-11T21:05:00Z",
    content: {
      text: "Check out my art installation at the downtown gallery! It's all about queer identity and expression through color.",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
    },
    likes: 78,
    comments: 14,
    shares: 9,
    tags: ["Art", "Expression", "Identity"]
  }
];

export const mockUserProfile = {
  id: "user1",
  name: "Alex Rivera",
  email: "alex@example.com",
  pronouns: "they/them",
  bio: "LGBTQ+ advocate and outdoor enthusiast",
  location: "Auckland, New Zealand",
  imageUrl: "/lovable-uploads/81d7e401-05ab-439f-9086-8a67457532e2.png",
  coverImageUrl: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1000&auto=format&fit=crop",
  joinedDate: "2023-04-15",
  interests: ["hiking", "reading", "activism", "photography"],
  socialLinks: {
    instagram: "alex_rivera",
    twitter: "alexrivera",
    website: "https://alexrivera.com"
  }
};

export const mockPlaces = [
  {
    id: "place1",
    name: "Rainbow Café",
    location: {
      address: "123 Main St",
      city: "Auckland",
      neighbourhood: "Central",
      lat: -36.848461,
      lng: 174.763336
    },
    category: "Café",
    type: "Food & Drink",
    tags: ["Coffee", "LGBTQ+ Friendly", "Vegan Options"],
    lgbt_status: "lgbt_owned",
    description: "A cozy café with a welcoming atmosphere for the LGBTQ+ community.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
    contact: {
      website: "www.rainbowcafe.co.nz",
      email: "info@rainbowcafe.co.nz",
      phone: "09-555-1234"
    },
    verified: true
  },
  {
    id: "place2",
    name: "Pride Community Center",
    location: {
      address: "456 Oak Ave",
      city: "Wellington",
      neighbourhood: "Newtown",
      lat: -41.286461,
      lng: 174.773336
    },
    category: "Community Center",
    type: "Services",
    tags: ["Support", "LGBTQ+", "Resources", "Events"],
    lgbt_status: "lgbt_managed",
    description: "A community center providing resources and support for the LGBTQ+ community.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop",
    contact: {
      website: "www.pridecenter.org.nz",
      email: "contact@pridecenter.org.nz",
      phone: "04-555-5678"
    },
    verified: true
  },
  {
    id: "place3",
    name: "Ally Bookstore",
    location: {
      address: "789 Pine St",
      city: "Christchurch",
      neighbourhood: "Riccarton",
      lat: -43.531637,
      lng: 172.636645
    },
    category: "Bookstore",
    type: "Retail",
    tags: ["Books", "LGBTQ+ Literature", "Inclusive"],
    lgbt_status: "ally",
    description: "An inclusive bookstore with a diverse selection of LGBTQ+ literature.",
    imageUrl: "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=1000&auto=format&fit=crop",
    contact: {
      website: "www.allybookstore.co.nz",
      email: "books@allybookstore.co.nz",
      phone: "03-555-9012"
    },
    verified: true
  }
];

export const mockResources: Resource[] = [
  {
    id: "resource1",
    title: "LGBTQ+ Health Services",
    provider: "Rainbow Health NZ",
    category: "Health",
    description: "Comprehensive health services catering specifically to LGBTQ+ individuals.",
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000&auto=format&fit=crop",
    location: {
      address: "123 Health St",
      city: "Auckland",
      lat: -36.848461,
      lng: 174.763336
    },
    contact: {
      phone: "0800-123-456",
      email: "health@rainbowhealth.co.nz",
      website: "www.rainbowhealth.co.nz"
    },
    tags: ["Health", "Medical", "Mental Health", "LGBTQ+"]
  },
  {
    id: "resource2",
    title: "Trans Support Group",
    provider: "Gender Diverse Collective",
    category: "Support",
    description: "A support group for transgender, non-binary, and gender diverse individuals.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    location: {
      address: "456 Community Ave",
      city: "Wellington",
      lat: -41.286461,
      lng: 174.773336
    },
    contact: {
      phone: "0800-789-012",
      email: "support@gendercollective.org.nz",
      website: "www.gendercollective.org.nz"
    },
    tags: ["Transgender", "Support", "Community", "LGBTQ+"]
  },
  {
    id: "resource3",
    title: "LGBTQ+ Legal Aid",
    provider: "Rainbow Rights",
    category: "Legal",
    description: "Legal assistance and advice for LGBTQ+ individuals facing discrimination.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop",
    location: {
      address: "789 Justice Rd",
      city: "Christchurch",
      lat: -43.531637,
      lng: 172.636645
    },
    contact: {
      phone: "0800-345-678",
      email: "legal@rainbowrights.org.nz",
      website: "www.rainbowrights.org.nz"
    },
    tags: ["Legal", "Rights", "Discrimination", "LGBTQ+"]
  }
];

export const navItems = [
  {
    label: "Discover",
    path: "/",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  },
  {
    label: "Connect",
    path: "/connect",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    label: "Feed",
    path: "/feed",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  },
  {
    label: "Events",
    path: "/events",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    label: "Resources",
    path: "/resources",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  }
];
