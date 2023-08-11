import { fetchJson } from "@/lib/utils"

export async function GET() {
  const url = process.env.ORCHARD_HOST + '/v1/stats/counts'
  return fetchJson(url)
}
