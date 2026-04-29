export interface BotProfile {
  id: string;
  name: string;
  rating: number;
  description: string;
  avatarColor: string;
}

export const botProfiles: BotProfile[] = [
  {
    id: "nelson",
    name: "Nelson",
    rating: 400,
    description: "Beginner level. Often moves pieces at random.",
    avatarColor: "#4ade80",
  },
  {
    id: "beth",
    name: "Beth",
    rating: 800,
    description: "Casual player. Understands basic captures.",
    avatarColor: "#60a5fa",
  },
  {
    id: "martin",
    name: "Martin",
    rating: 1200,
    description: "Intermediate strategist. Focuses on center control.",
    avatarColor: "#f472b6",
  },
  {
    id: "sophia",
    name: "Sophia",
    rating: 1800,
    description: "Expert level. Uses advanced opening theories.",
    avatarColor: "#fbbf24",
  },
  {
    id: "kasparov_bot",
    name: "Garry Bot",
    rating: 2800,
    description: "Grandmaster mimicry. Highly aggressive.",
    avatarColor: "#ef4444",
  },
  {
    id: "magnus_bot",
    name: "Magnus Clone",
    rating: 3200,
    description: "The pinnacle of silicon strategy. Nearly unbeatable.",
    avatarColor: "#a855f7",
  },
];

export const getRandomBot = () => {
  return botProfiles[Math.floor(Math.random() * botProfiles.length)];
};
