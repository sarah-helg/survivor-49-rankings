export interface Contestant {
  id: number
  name: string
  age: number
  occupation: string
  hometown: string
  bio: string
  image: string
  eliminated?: boolean
  eliminationOrder?: number
}

export const contestants: Contestant[] = [
  {
    id: 1,
    name: "Andy Rueda",
    age: 31,
    occupation: "AI Research Assistant",
    hometown: "Brooklyn, NY",
    bio: "A tech-savvy strategist who brings analytical thinking to every challenge.",
    image: "/andy-rueda-survivor-contestant.jpg",
  },
  {
    id: 2,
    name: "Caroline Vidmar",
    age: 27,
    occupation: "Strategy Consultant",
    hometown: "Chicago, IL",
    bio: "A competitive spirit with a background in strategic planning and problem-solving.",
    image: "/caroline-vidmar-survivor-contestant.jpg",
  },
  {
    id: 3,
    name: "Gabe Ortis",
    age: 26,
    occupation: "Radio Host",
    hometown: "Baltimore, MD",
    bio: "A charismatic communicator who knows how to connect with people from all walks of life.",
    image: "/gabe-ortis-survivor-contestant.jpg",
  },
  {
    id: 4,
    name: "Genevieve Mushaluk",
    age: 33,
    occupation: "Corporate Lawyer",
    hometown: "Winnipeg, Manitoba",
    bio: "A sharp legal mind with the negotiation skills to navigate complex alliances.",
    image: "/genevieve-mushaluk-survivor-contestant.jpg",
  },
  {
    id: 5,
    name: "Kyle Ostwald",
    age: 31,
    occupation: "Construction Worker",
    hometown: "Cheboygan, MI",
    bio: "A hardworking competitor who brings physical strength and blue-collar determination.",
    image: "/kyle-ostwald-survivor-contestant.jpg",
  },
  {
    id: 6,
    name: "Rachel LaMont",
    age: 34,
    occupation: "Graphic Designer",
    hometown: "Southfield, MI",
    bio: "A creative problem-solver with an eye for detail and strategic thinking.",
    image: "/rachel-lamont-survivor-contestant.jpg",
  },
  {
    id: 7,
    name: "Sam Phalen",
    age: 24,
    occupation: "Sports Reporter",
    hometown: "Schaumburg, IL",
    bio: "A young competitor with media savvy and the ability to read people and situations.",
    image: "/sam-phalen-survivor-contestant.jpg",
  },
  {
    id: 8,
    name: "Sierra Wright",
    age: 27,
    occupation: "Nurse",
    hometown: "Phoenixville, PA",
    bio: "A caring healthcare professional with the mental toughness to handle high-pressure situations.",
    image: "/sierra-wright-survivor-contestant.jpg",
  },
  {
    id: 9,
    name: "Sol Yi",
    age: 43,
    occupation: "Medical Device Sales",
    hometown: "Del City, OK",
    bio: "An experienced sales professional who understands the art of persuasion and relationship building.",
    image: "/sol-yi-survivor-contestant.jpg",
  },
  {
    id: 10,
    name: "Sue Smey",
    age: 59,
    occupation: "Flight School Owner",
    hometown: "Kirkwood, NY",
    bio: "A seasoned entrepreneur with leadership experience and the wisdom that comes with age.",
    image: "/sue-smey-survivor-contestant.jpg",
  },
  {
    id: 11,
    name: "Teeny Chirichillo",
    age: 24,
    occupation: "Freelance Writer",
    hometown: "Manahawkin, NJ",
    bio: "A creative storyteller with strong observational skills and youthful energy.",
    image: "/teeny-chirichillo-survivor-contestant.jpg",
  },
  {
    id: 12,
    name: "Tiyana Hallums",
    age: 27,
    occupation: "Flight Attendant",
    hometown: "Aiea, HI",
    bio: "A people person with excellent customer service skills and cultural adaptability.",
    image: "/tiyana-hallums-survivor-contestant.jpg",
  },
  {
    id: 13,
    name: "TK Foster",
    age: 31,
    occupation: "Athlete Marketing Manager",
    hometown: "Upper Marlboro, MD",
    bio: "A sports industry professional who understands competition and athlete psychology.",
    image: "/tk-foster-survivor-contestant.jpg",
  },
  {
    id: 14,
    name: "Anika Dhar",
    age: 26,
    occupation: "Marketing Manager",
    hometown: "Los Angeles, CA",
    bio: "A strategic marketer with strong analytical skills and creative problem-solving abilities.",
    image: "/anika-dhar-survivor-contestant.jpg",
  },
  {
    id: 15,
    name: "Jerome Bettis Jr.",
    age: 27,
    occupation: "Former Football Player",
    hometown: "Pittsburgh, PA",
    bio: "The son of NFL Hall of Famer Jerome Bettis, bringing athletic prowess and competitive drive.",
    image: "/jerome-bettis-jr-survivor-contestant.jpg",
  },
  {
    id: 16,
    name: "Jon Lovett",
    age: 42,
    occupation: "Podcast Host",
    hometown: "Woodbury, NY",
    bio: "A political commentator and media personality with sharp wit and communication skills.",
    image: "/jon-lovett-survivor-contestant.jpg",
  },
  {
    id: 17,
    name: "Kishan Patel",
    age: 28,
    occupation: "ER Doctor",
    hometown: "San Francisco, CA",
    bio: "A medical professional with the ability to make quick decisions under extreme pressure.",
    image: "/kishan-patel-survivor-contestant.jpg",
  },
  {
    id: 18,
    name: "Rome Cooney",
    age: 30,
    occupation: "E-Sports Commentator",
    hometown: "Phoenix, AZ",
    bio: "A gaming industry professional with strategic thinking and competitive analysis skills.",
    image: "/rome-cooney-survivor-contestant.jpg",
  },
]

export interface UserRanking {
  userId: string
  userName: string
  rankings: number[] // Array of contestant IDs in order from 18th place (first out) to 1st place (winner)
  submittedAt: Date
  points?: number
}

export interface GameState {
  eliminations: number[] // Array of contestant IDs in elimination order
  userRankings: UserRanking[]
  currentWeek: number
}
