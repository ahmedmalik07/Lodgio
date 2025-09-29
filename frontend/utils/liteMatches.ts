export type LiteRoommateProfile = {
  id: string
  name: string
  city: string
  area: string
  rentRange: string
  compatibility: number
  highlights: string[]
}

const liteProfiles: LiteRoommateProfile[] = [
  {
    id: "LHR-101",
    name: "Ayesha Khan",
    city: "Lahore",
    area: "Gulberg",
    rentRange: "18k-24k",
    compatibility: 92,
    highlights: [
      "FAST CS student, early sleeper",
      "Prefers quiet roommates",
      "Enjoys shared cooking on weekends",
    ],
  },
  {
    id: "LHR-204",
    name: "Hamza Iqbal",
    city: "Lahore",
    area: "Johar Town",
    rentRange: "15k-20k",
    compatibility: 88,
    highlights: [
      "IBA Lahore MBA student",
      "Flexible schedule, tidy",
      "Looking for respectful roommate",
    ],
  },
  {
    id: "ISB-088",
    name: "Fatima Raza",
    city: "Islamabad",
    area: "G-11",
    rentRange: "20k-28k",
    compatibility: 90,
    highlights: [
      "NUST architecture student",
      "Morning jogger, organized",
      "Prefers roommate who values privacy",
    ],
  },
  {
    id: "ISB-142",
    name: "Bilal Ahmed",
    city: "Islamabad",
    area: "F-10",
    rentRange: "25k-32k",
    compatibility: 86,
    highlights: [
      "Software engineer (remote)",
      "Quiet, keeps shared spaces clean",
      "Enjoys board games on weekends",
    ],
  },
  {
    id: "KHI-061",
    name: "Sara Siddiqui",
    city: "Karachi",
    area: "DHA Phase 6",
    rentRange: "22k-30k",
    compatibility: 89,
    highlights: [
      "SZABIST media sciences student",
      "Night owl but considerate",
      "Wants roommate comfortable with guests",
    ],
  },
  {
    id: "KHI-133",
    name: "Usman Farooq",
    city: "Karachi",
    area: "Gulshan-e-Iqbal",
    rentRange: "16k-22k",
    compatibility: 84,
    highlights: [
      "Karachi University commerce",
      "Prefers shared chores schedule",
      "Open to short-term stays",
    ],
  },
  {
    id: "LHR-312",
    name: "Mariam Latif",
    city: "Lahore",
    area: "DHA Phase 3",
    rentRange: "20k-27k",
    compatibility: 83,
    highlights: [
      "Working professional, hybrid",
      "Keeps healthy cooking routine",
      "Looking for calm environment",
    ],
  },
  {
    id: "ISB-219",
    name: "Zohaib Malik",
    city: "Islamabad",
    area: "Bahria Enclave",
    rentRange: "18k-24k",
    compatibility: 82,
    highlights: [
      "Freelance designer",
      "Enjoys shared Netflix nights",
      "Has reliable car for commuting",
    ],
  },
]

export const findLiteMatches = (city: string, limit = 4): LiteRoommateProfile[] => {
  const trimmedCity = city.trim().toLowerCase()
  if (!trimmedCity) {
    return []
  }

  const filtered = liteProfiles.filter((profile) =>
    profile.city.toLowerCase() === trimmedCity
  )

  if (filtered.length > 0) {
    return filtered.slice(0, limit)
  }

  // fallback: show top matches from any city, to keep the experience responsive
  return liteProfiles.slice(0, limit)
}

export const listSupportedCities = (): string[] =>
  Array.from(new Set(liteProfiles.map((profile) => profile.city))).sort()
