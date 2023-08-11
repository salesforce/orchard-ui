import { fetchJson } from "@/lib/utils"

export async function GET(request: Request, { params }: {params: {id: string, rscId: string}}) {
  const url = `${process.env.ORCHARD_HOST}/v1/workflow/${params.id}/resource/${params.rscId}`
  return fetchJson(url)
}
