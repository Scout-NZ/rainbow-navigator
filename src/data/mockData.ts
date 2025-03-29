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

// Update mockPlaces to ensure they have featured flag
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

// Add mockUsers export if it doesn't exist
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
