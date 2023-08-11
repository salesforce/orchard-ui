import { fetchJson } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const statuses = searchParams.get('statuses')

  const url = process.env.ORCHARD_HOST + '/v1/workflow?' + new URLSearchParams({
    like: '%',
    statuses: statuses,
  });
  return fetchJson(url)
}
