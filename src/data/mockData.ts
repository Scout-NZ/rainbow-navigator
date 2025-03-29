export interface Place {
  id: number;
  name: string;
  type: string;
  category: string;
  tags: string[];
  featured?: boolean;
  description: string;
  location: {
    address: string;
    neighbourhood: string;
    city: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  imageUrl: string;
  verified: boolean;
  lgbt_status: string | null;
}

export interface Group {
  id: number;
  name: string;
  category: string;
  tags: string[];
  description: string;
  imageUrl: string;
  isPrivate: boolean;
  memberCount: number;
  city: string;
  members?: string[];
  admins?: string[];
  rules?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  city: string;
  pronouns: string;
  interests: string[];
  role: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  description: string;
  category: string;
  price: string;
  attendees: number | any[];
  imageUrl: string;
  tags?: string[];
  organizer?: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt: string;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  imageUrl?: string;
  source: string;
  featured: boolean;
  createdAt: string;
}

export const mockUserProfile = {
  id: 1,
  name: "Alex Rivera",
  username: "alexr",
  email: "alex@example.com",
  avatar: "https://picsum.photos/200?random=1",
  coverPhoto: "https://picsum.photos/800/300?random=1",
  bio: "LGBT+ advocate and community organizer",
  location: "Auckland",
  pronouns: "they/them",
  identities: ["queer", "non-binary"],
  interests: ["activism", "art", "community"],
  joinDate: "2023-06-15",
  badges: ["Verified", "Community Leader"],
  socialLinks: {
    instagram: "alex_rivera",
    twitter: "alexrivera",
    website: "https://alexrivera.example.com"
  },
  settings: {
    privacy: "public",
    notifications: true,
    theme: "light"
  }
};

export const mockPosts = [
  {
    id: 1,
    content: "Just attended an amazing Pride event in Auckland! The community here is incredible.",
    imageUrl: "https://picsum.photos/600/400?random=1",
    likes: 42,
    comments: 7,
    createdAt: "2023-09-15T14:30:00Z",
    author: {
      id: 1,
      name: "Alex Rivera",
      username: "alexr",
      avatar: "https://picsum.photos/200?random=1"
    }
  },
  {
    id: 2,
    content: "Found this amazing queer-owned café today. The coffee is excellent and the atmosphere is so welcoming!",
    imageUrl: "https://picsum.photos/600/400?random=2",
    likes: 28,
    comments: 5,
    createdAt: "2023-09-14T10:15:00Z",
    author: {
      id: 2,
      name: "Sam Johnson",
      username: "samj",
      avatar: "https://picsum.photos/200?random=2"
    }
  },
  {
    id: 3,
    content: "Looking for recommendations for LGBT-friendly healthcare providers in Wellington. Any suggestions?",
    likes: 15,
    comments: 12,
    createdAt: "2023-09-13T18:45:00Z",
    author: {
      id: 3,
      name: "Jordan Smith",
      username: "jordans",
      avatar: "https://picsum.photos/200?random=3"
    }
  }
];

export const mockEvents = [
  {
    id: 1,
    title: "Auckland Pride Parade",
    date: "2023-10-25",
    time: "14:00",
    location: {
      name: "Ponsonby Road",
      address: "Ponsonby Road",
      city: "Auckland",
      lat: -36.8512,
      lng: 174.7419
    },
    description: "Annual pride parade celebrating the LGBTQ+ community in Auckland.",
    category: "Pride",
    price: "Free",
    attendees: 1500,
    imageUrl: "https://picsum.photos/600/400?random=4",
    tags: ["pride", "parade", "community"],
    organizer: {
      id: 1,
      name: "Auckland Pride",
      avatar: "https://picsum.photos/200?random=10"
    }
  },
  {
    id: 2,
    title: "Queer Book Club",
    date: "2023-10-10",
    time: "18:30",
    location: {
      name: "Rainbow Community Centre",
      address: "123 Queen Street",
      city: "Wellington",
      lat: -41.2902,
      lng: 174.7762
    },
    description: "Join us for our monthly book club discussing queer literature.",
    category: "Education",
    price: "Free",
    attendees: 25,
    imageUrl: "https://picsum.photos/600/400?random=5",
    tags: ["books", "discussion", "community"],
    organizer: {
      id: 2,
      name: "Wellington LGBTQ+ Society",
      avatar: "https://picsum.photos/200?random=11"
    }
  },
  {
    id: 3,
    title: "Drag Night Extravaganza",
    date: "2023-10-15",
    time: "20:00",
    location: {
      name: "Club Rainbow",
      address: "456 Main Street",
      city: "Christchurch",
      lat: -43.5321,
      lng: 172.6362
    },
    description: "A night of fabulous drag performances, music, and dancing.",
    category: "Nightlife",
    price: "$25",
    attendees: 150,
    imageUrl: "https://picsum.photos/600/400?random=6",
    tags: ["drag", "performances", "nightlife"],
    organizer: {
      id: 3,
      name: "Christchurch Drag Collective",
      avatar: "https://picsum.photos/200?random=12"
    }
  }
];

export const mockResources = [
  {
    id: 1,
    title: "LGBTQ+ Youth Support Services",
    description: "A comprehensive guide to support services for LGBTQ+ youth in New Zealand.",
    category: "Support",
    tags: ["youth", "support", "mental health"],
    url: "https://example.com/youth-support",
    imageUrl: "https://picsum.photos/600/400?random=7",
    source: "Rainbow Youth NZ",
    featured: true,
    createdAt: "2023-08-10T00:00:00Z"
  },
  {
    id: 2,
    title: "Coming Out Guide",
    description: "Resources and advice for coming out to family, friends, and colleagues.",
    category: "Education",
    tags: ["coming out", "guide", "advice"],
    url: "https://example.com/coming-out-guide",
    imageUrl: "https://picsum.photos/600/400?random=8",
    source: "OutLine NZ",
    featured: true,
    createdAt: "2023-07-15T00:00:00Z"
  },
  {
    id: 3,
    title: "Trans Healthcare Directory",
    description: "A directory of trans-friendly healthcare providers across New Zealand.",
    category: "Healthcare",
    tags: ["transgender", "healthcare", "directory"],
    url: "https://example.com/trans-healthcare",
    imageUrl: "https://picsum.photos/600/400?random=9",
    source: "Gender Minorities Aotearoa",
    featured: false,
    createdAt: "2023-06-20T00:00:00Z"
  }
];

export const mockGroups: Group[] = [
  {
    id: 1,
    name: "Auckland LGBTQ+ Social Club",
    category: "Community",
    tags: ["social", "meetups", "friends"],
    description: "A group for LGBTQ+ people in Auckland to socialize and make new friends.",
    imageUrl: "https://picsum.photos/300/200?random=11",
    isPrivate: false,
    memberCount: 35,
    city: "Auckland"
  },
  {
    id: 2,
    name: "Wellington Queer Book Club",
    category: "Books",
    tags: ["books", "reading", "discussion"],
    description: "A book club for queer people in Wellington to read and discuss queer literature.",
    imageUrl: "https://picsum.photos/300/200?random=12",
    isPrivate: true,
    memberCount: 18,
    city: "Wellington"
  },
  {
    id: 3,
    name: "Christchurch Rainbow Hikers",
    category: "Outdoors",
    tags: ["hiking", "outdoors", "nature"],
    description: "A group for LGBTQ+ people in Christchurch to go hiking and enjoy the outdoors.",
    imageUrl: "https://picsum.photos/300/200?random=13",
    isPrivate: false,
    memberCount: 24,
    city: "Christchurch"
  },
  {
    id: 4,
    name: "Dunedin Queer Craft Collective",
    category: "Arts",
    tags: ["crafts", "art", "diy"],
    description: "A group for LGBTQ+ people in Dunedin to create and share their crafts.",
    imageUrl: "https://picsum.photos/300/200?random=14",
    isPrivate: false,
    memberCount: 12,
    city: "Dunedin"
  },
  {
    id: 5,
    name: "Hamilton Rainbow Youth Group",
    category: "Youth",
    tags: ["youth", "support", "community"],
    description: "A support group for LGBTQ+ youth in Hamilton.",
    imageUrl: "https://picsum.photos/300/200?random=15",
    isPrivate: true,
    memberCount: 8,
    city: "Hamilton"
  },
  {
    id: 6,
    name: "Tauranga LGBTQ+ Board Games",
    category: "Games",
    tags: ["games", "board games", "social"],
    description: "A group for LGBTQ+ people in Tauranga to play board games and socialize.",
    imageUrl: "https://picsum.photos/300/200?random=16",
    isPrivate: false,
    memberCount: 20,
    city: "Tauranga"
  },
  {
    id: 7,
    name: "Invercargill Queer Film Society",
    category: "Film",
    tags: ["film", "movies", "discussion"],
    description: "A film society for queer people in Invercargill to watch and discuss queer films.",
    imageUrl: "https://picsum.photos/300/200?random=17",
    isPrivate: false,
    memberCount: 15,
    city: "Invercargill"
  },
  {
    id: 8,
    name: "Napier-Hastings Rainbow Choir",
    category: "Music",
    tags: ["music", "choir", "singing"],
    description: "A choir for LGBTQ+ people in Napier-Hastings to sing and perform together.",
    imageUrl: "https://picsum.photos/300/200?random=18",
    isPrivate: false,
    memberCount: 22,
    city: "Napier"
  },
  {
    id: 9,
    name: "Palmerston North Queer Writers",
    category: "Writing",
    tags: ["writing", "poetry", "stories"],
    description: "A writing group for LGBTQ+ people in Palmerston North to share their writing.",
    imageUrl: "https://picsum.photos/300/200?random=19",
    isPrivate: true,
    memberCount: 10,
    city: "Palmerston North"
  },
  {
    id: 10,
    name: "Nelson LGBTQ+ Book Exchange",
    category: "Books",
    tags: ["books", "exchange", "reading"],
    description: "A book exchange for LGBTQ+ people in Nelson to share their books.",
    imageUrl: "https://picsum.photos/300/200?random=20",
    isPrivate: false,
    memberCount: 14,
    city: "Nelson"
  }
];

export const mockPlaces: Place[] = [
  {
    id: 1,
    name: "Rainbow Cafe",
    type: "business",
    category: "Cafes",
    tags: ["coffee", "food", "wifi"],
    featured: true,
    description: "A welcoming cafe with great coffee and pastries",
    location: {
      address: "123 Main St",
      neighbourhood: "Downtown",
      city: "Auckland",
      lat: -36.848,
      lng: 174.763
    },
    contact: {
      phone: "09 123 4567",
      email: "info@rainbowcafe.co.nz",
      website: "https://rainbowcafe.example.com"
    },
    imageUrl: "https://picsum.photos/300/200?random=1",
    verified: true,
    lgbt_status: "lgbt_owned"
  },
  {
    id: 2,
    name: "Queer Bar",
    type: "business",
    category: "Bars",
    tags: ["drinks", "nightlife", "social"],
    featured: false,
    description: "A lively bar with a diverse crowd",
    location: {
      address: "456 Queen St",
      neighbourhood: "Uptown",
      city: "Wellington",
      lat: -41.286,
      lng: 174.776
    },
    contact: {
      phone: "04 987 6543",
      email: "events@queerbar.co.nz",
      website: "https://queerbar.example.com"
    },
    imageUrl: "https://picsum.photos/300/200?random=2",
    verified: true,
    lgbt_status: "lgbt_managed"
  },
  {
    id: 3,
    name: "Rainbow Community Centre",
    type: "resource",
    category: "Community",
    tags: ["support", "events", "groups"],
    featured: true,
    description: "A safe space for the LGBTQ+ community",
    location: {
      address: "789 High St",
      neighbourhood: "Central",
      city: "Christchurch",
      lat: -43.532,
      lng: 172.630
    },
    contact: {
      phone: "03 555 1212",
      email: "info@rainbowcentre.org.nz",
      website: "https://rainbowcentre.example.org"
    },
    imageUrl: "https://picsum.photos/300/200?random=3",
    verified: true,
    lgbt_status: "ally"
  },
  {
    id: 4,
    name: "Lavender Bookstore",
    type: "business",
    category: "Shopping",
    tags: ["books", "gifts", "queer"],
    featured: false,
    description: "A bookstore specializing in LGBTQ+ literature",
    location: {
      address: "101 Victoria St",
      neighbourhood: "Downtown",
      city: "Auckland",
      lat: -36.848,
      lng: 174.763
    },
    contact: {
      phone: "09 333 4444",
      email: "sales@lavenderbooks.co.nz",
      website: "https://lavenderbooks.example.com"
    },
    imageUrl: "https://picsum.photos/300/200?random=4",
    verified: true,
    lgbt_status: "lgbt_owned"
  },
  {
    id: 5,
    name: "QueerMed Clinic",
    type: "business",
    category: "Healthcare",
    tags: ["health", "medical", "lgbtq+"],
    featured: true,
    description: "A healthcare clinic providing services for the LGBTQ+ community",
    location: {
      address: "222 Lambton Quay",
      neighbourhood: "Central",
      city: "Wellington",
      lat: -41.286,
      lng: 174.776
    },
    contact: {
      phone: "04 777 8888",
      email: "info@queermed.co.nz",
      website: "https://queermed.example.com"
    },
    imageUrl: "https://picsum.photos/300/200?random=5",
    verified: true,
    lgbt_status: "ally"
  },
  {
    id: 6,
    name: "Transcend Services",
    type: "resource",
    category: "Services",
    tags: ["legal", "support", "transgender"],
    featured: false,
    description: "A service providing legal and support services for transgender people",
    location: {
      address: "333 Riccarton Rd",
      neighbourhood: "Riccarton",
      city: "Christchurch",
      lat: -43.532,
      lng: 172.630
    },
    contact: {
      phone: "03 999 0000",
      email: "help@transcend.org.nz",
      website: "https://transcend.example.org"
    },
    imageUrl: "https://picsum.photos/300/200?random=6",
    verified: true,
    lgbt_status: null
  },
  {
    id: 7,
    name: "Gaynz.com",
    type: "resource",
    category: "Community",
    tags: ["news", "community", "events"],
    featured: false,
    description: "New Zealand's gay and lesbian community website",
    location: {
      address: "Online",
      neighbourhood: "N/A",
      city: "Auckland",
      lat: -36.848,
      lng: 174.763
    },
    contact: {
      phone: "N/A",
      email: "info@gaynz.com",
      website: "https://www.gaynz.com/"
    },
    imageUrl: "https://picsum.photos/300/200?random=7",
    verified: true,
    lgbt_status: null
  },
  {
    id: 8,
    name: "Ending HIV",
    type: "resource",
    category: "Healthcare",
    tags: ["health", "hiv", "testing"],
    featured: false,
    description: "Ending HIV is a community-led initiative to eliminate new HIV transmissions in Aotearoa",
    location: {
      address: "Online",
      neighbourhood: "N/A",
      city: "National",
      lat: -41.000,
      lng: 174.000
    },
    contact: {
      phone: "N/A",
      email: "info@endinghiv.org.nz",
      website: "https://endinghiv.org.nz/"
    },
    imageUrl: "https://picsum.photos/300/200?random=8",
    verified: true,
    lgbt_status: null
  },
  {
    id: 9,
    name: "Outline Aotearoa",
    type: "resource",
    category: "Services",
    tags: ["support", "helpline", "lgbtq+"],
    featured: false,
    description: "Outline provides a free and confidential nationwide 0800 support line and online chat service for people of all ages",
    location: {
      address: "Online",
      neighbourhood: "N/A",
      city: "National",
      lat: -41.000,
      lng: 174.000
    },
    contact: {
      phone: "0800 688 5463",
      email: "support@outline.org.nz",
      website: "https://outline.org.nz/"
    },
    imageUrl: "https://picsum.photos/300/200?random=9",
    verified: true,
    lgbt_status: null
  },
  {
    id: 10,
    name: "InsideOUT Kōaro",
    type: "resource",
    category: "Community",
    tags: ["youth", "education", "lgbtq+"],
    featured: false,
    description: "InsideOUT Kōaro works to give rainbow young people in Aotearoa New Zealand a sense of safety, belonging, and community.",
    location: {
      address: "Wellington",
      neighbourhood: "N/A",
      city: "Wellington",
      lat: -41.286,
      lng: 174.776
    },
    contact: {
      phone: "N/A",
      email: "info@insideout.org.nz",
      website: "https://insideout.org.nz/"
    },
    imageUrl: "https://picsum.photos/300/200?random=10",
    verified: true,
    lgbt_status: null
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alex Smith",
    username: "alex",
    avatar: "https://picsum.photos/200?random=1",
    bio: "LGBT+ activist and community organizer",
    city: "Auckland",
    pronouns: "they/them",
    interests: ["activism", "art", "music"],
    role: "member"
  },
  {
    id: 2,
    name: "Jamie Wong",
    username: "jamie",
    avatar: "https://picsum.photos/200?random=2",
    bio: "Proud ally and volunteer",
    city: "Wellington",
    pronouns: "she/her",
    interests: ["education", "politics", "reading"],
    role: "member"
  },
  {
    id: 3,
    name: "Jordan Taylor",
    username: "jordan",
    avatar: "https://picsum.photos/200?random=3",
    bio: "Writer and community builder",
    city: "Christchurch",
    pronouns: "he/him",
    interests: ["writing", "poetry", "hiking"],
    role: "admin"
  },
  {
    id: 4,
    name: "Sam Parker",
    username: "sam",
    avatar: "https://picsum.photos/200?random=4",
    bio: "Queer artist and musician",
    city: "Dunedin",
    pronouns: "she/they",
    interests: ["art", "music", "cooking"],
    role: "member"
  },
  {
    id: 5,
    name: "Casey Wilson",
    username: "casey",
    avatar: "https://picsum.photos/200?random=5",
    bio: "Healthcare worker and community volunteer",
    city: "Hamilton",
    pronouns: "he/him",
    interests: ["health", "sports", "dogs"],
    role: "member"
  }
];
