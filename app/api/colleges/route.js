import { getColleges } from '@/db/college.js';

export async function GET() {
  const colleges = getColleges();
  return Response.json(colleges);
}

