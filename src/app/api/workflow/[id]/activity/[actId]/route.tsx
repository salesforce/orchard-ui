import { fetchJson } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: {id: string, actId: string} }) {
  const url = `${process.env.ORCHARD_HOST}/v1/workflow/${params.id}/activity/${params.actId}`
  return fetchJson(url)
}
