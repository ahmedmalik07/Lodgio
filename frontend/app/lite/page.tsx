'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { findLiteMatches, listSupportedCities, LiteRoommateProfile } from '@/utils/liteMatches'

type LiteApiResponse = {
  city: string
  matches: LiteRoommateProfile[]
  supportedCities: string[]
  timestamp: string
}

const API_ENDPOINT = '/api/lite-matches'

const fetchLiteMatches = async (city: string, signal?: AbortSignal): Promise<LiteApiResponse> => {
  const url = new URL(API_ENDPOINT, window.location.origin)
  if (city.trim()) {
    url.searchParams.set('city', city.trim())
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Unable to load matches')
  }

  return response.json()
}

export default function LiteExperience() {
  const [cityInput, setCityInput] = useState('Lahore')
  const [matches, setMatches] = useState<LiteRoommateProfile[]>([])
  const [supportedCities, setSupportedCities] = useState<string[]>(listSupportedCities())
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'offline'>('idle')
  const [message, setMessage] = useState<string>('')

  const placeholderMatches = useMemo(() => findLiteMatches(cityInput), [cityInput])

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    const bootstrap = async () => {
      setStatus('loading')
      try {
        const data = await fetchLiteMatches(cityInput, controller.signal)
        if (ignore) return

        setMatches(data.matches)
        setSupportedCities(data.supportedCities.length ? data.supportedCities : listSupportedCities())
        setStatus('loaded')
        setMessage(data.matches.length ? 'Showing best matches for your city.' : 'Showing closest matches we could find.')
      } catch (error) {
        if (ignore) return
        console.warn('Falling back to offline data', error)
        setMatches(placeholderMatches)
        setStatus('offline')
        setMessage('Offline fallback results. Connect to fetch fresh matches.')
      }
    }

    bootstrap()

    return () => {
      ignore = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const controller = new AbortController()
    setStatus('loading')
    setMessage('Searching...')

    try {
      const data = await fetchLiteMatches(cityInput, controller.signal)
      setMatches(data.matches)
      setSupportedCities(data.supportedCities.length ? data.supportedCities : listSupportedCities())
      setStatus('loaded')
      setMessage(data.matches.length ? 'Updated results below.' : 'No exact matches—showing closest alternatives.')
    } catch (error) {
      console.warn('Falling back to offline data', error)
      const fallback = findLiteMatches(cityInput)
      setMatches(fallback)
      setStatus('offline')
      setMessage('Offline fallback results. Connect to fetch fresh matches.')
    }
  }

  const showHint = status === 'offline' ? 'You are viewing cached recommendations.' : 'Optimized for low bandwidth—only essential data is loaded.'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Lodgio Lite · Fast Roommate Finder</h1>
          <p className="text-sm text-slate-600">
            Enter a city to see compatible roommates. This lightweight mode works even on spotty internet.
          </p>
        </header>

        <form className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
          <label className="text-sm font-medium" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            list="lite-cities"
            autoComplete="off"
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g. Lahore"
          />
          <datalist id="lite-cities">
            {supportedCities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <button
            type="submit"
            className="mt-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Searching…' : 'Find Matches'}
          </button>
        </form>

        <aside className="rounded-lg border border-dashed border-slate-300 bg-slate-100 px-4 py-3 text-xs text-slate-600">
          {message || 'Results will appear here once you search.'}
          <div className="mt-1 text-[11px] text-slate-500">{showHint}</div>
        </aside>

        <section className="grid gap-3">
          {matches.length === 0 && (
            <div className="rounded border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
              No matches yet. Try a different city like Karachi, Lahore, or Islamabad.
            </div>
          )}

          {matches.map((match) => (
            <article key={match.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{match.name}</h2>
                  <p className="text-sm text-slate-600">
                    {match.city} · {match.area}
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                  {match.compatibility}% match
                </span>
              </header>
              <dl className="mt-3 space-y-1 text-sm text-slate-700">
                <div className="flex justify-between">
                  <dt className="font-medium text-slate-600">Rent range</dt>
                  <dd>{match.rentRange}</dd>
                </div>
              </dl>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {match.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <footer className="mt-8 text-center text-[11px] text-slate-500">
          Built for quick checks · Works best in modern browsers · Data refreshed hourly.
        </footer>
      </section>
    </main>
  )
}
