import { fetchJson } from '@/lib/utils';
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({}, { status: 200 });
}
