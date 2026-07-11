import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';



export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'colleges.json');

    const fileContent = await fs.readFile(filePath, 'utf-8');

    const data = JSON.parse(fileContent);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Failed to read local JSON file:', error);

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}