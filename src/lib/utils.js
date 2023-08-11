import { NextResponse } from 'next/server'

export function hourSpan(activatedAt, terminatedAt) {
  let end = new Date()
  if (terminatedAt) {
    end = new Date(terminatedAt + 'Z')
  }

  let start = new Date(activatedAt + 'Z')
  return Math.round((end - start) / 1000 / 60 / 60 * 10) / 10
}

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export function renderDate(datestr) {
  return new Date(datestr + 'Z').toUTCString()
}

export async function fetchJson(url) {
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
