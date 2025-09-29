import { NextResponse } from "next/server"
import { findLiteMatches, listSupportedCities } from "@/utils/liteMatches"

type LiteResponse = {
  city: string
  matches: ReturnType<typeof findLiteMatches>
  supportedCities: string[]
  timestamp: string
}

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")?.trim() ?? ""

  if (!city) {
    return NextResponse.json<LiteResponse>(
      {
        city: "",
        matches: [],
        supportedCities: listSupportedCities(),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }

  const matches = findLiteMatches(city)

  return NextResponse.json<LiteResponse>(
    {
      city,
      matches,
      supportedCities: listSupportedCities(),
      timestamp: new Date().toISOString(),
    },
    {
      status: matches.length > 0 ? 200 : 206, // partial content when we fall back to defaults
      headers: {
        "Cache-Control": "public, max-age=60", // small cache for low-bandwidth users
      },
    }
  )
}
