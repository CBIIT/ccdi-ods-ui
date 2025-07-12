import { NextResponse } from 'next/server';
import { getGithubBranch } from '@/config/config';

// Configure for static generation with revalidation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

const branch = getGithubBranch();
const LANDING_CONFIG_URL = `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json`;

export async function GET() {
  try {
    const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}&ref=${branch}`;
    const res = await fetch(fileUrl, {
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch config: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}
