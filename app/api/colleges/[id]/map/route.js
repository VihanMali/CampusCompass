import { getCollegeMapData } from '@/db/college.js';

export async function GET(request, { params }) {
  const { id } = await params;

  const collegeMapData = getCollegeMapData(id);
  return Response.json(collegeMapData);
}