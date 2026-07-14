import { getCollege } from '@/db/college.js'

export async function GET(request, { params }) {
  const { id } = await params;

  const college = getCollege(id);
  return Response.json(college);
}