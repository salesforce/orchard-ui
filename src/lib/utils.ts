import { NextResponse } from 'next/server'

export function hourSpan(activatedAt: string, terminatedAt: string) {
  let end = new Date()
  if (terminatedAt) {
    end = new Date(terminatedAt + 'Z')
  }

  let start = new Date(activatedAt + 'Z')
  return Math.round((end.valueOf() - start.valueOf()) / 1000 / 60 / 60 * 10) / 10
}

export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => (
  fetch(input, init).then((res) => res.json())
)

export const cacheFetcher = (input: RequestInfo | URL) => (
  fetch(input, {cache: 'force-cache'}).then((res) => res.json())
)

export function renderDate(datestr: string) {
  return new Date(datestr + 'Z').toUTCString()
}

export async function fetchJson(url: RequestInfo | URL) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ORCHARD_API_KEY,
    },
    cache: 'no-store',
  })

  const data = await res.json()

  return NextResponse.json(data)
}
