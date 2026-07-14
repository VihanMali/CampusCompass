import { getColleges } from '@/db/college.js';

export async function GET() {
    const res = getColleges();
    return Response.json(res);
}

