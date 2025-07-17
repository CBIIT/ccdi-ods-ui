/**
 * Configuration API endpoint for fetching landing page configuration from GitHub.
 * This endpoint retrieves the home.json configuration file from the CCDI ODS content repository.
 * 
 * @module api/config
 */

import { NextResponse } from 'next/server';
import { getGithubBranch } from '@/config/config';

// Configure Next.js settings for static generation with revalidation
/**
 * @constant {string} dynamic - Determines how the page is rendered. 'force-static' forces static generation.
 */
export const dynamic = 'force-static';
/**
 * @constant {number} revalidate - The revalidation time in seconds for the page.
 */
export const revalidate = 3600; // Revalidate every hour

/**
 * GET function to handle the API request.
 * Fetches the home.json configuration file from the specified GitHub branch.
 * 
 * @returns {Promise<NextResponse>} A promise that resolves to the Next.js response.
 */

// Get the current GitHub branch for content fetching
const branch = getGithubBranch();
// GitHub API URL for the landing page configuration file
const LANDING_CONFIG_URL = `https://raw.githubusercontent.com/CBIIT/ccdi-ods-content/${branch}/config/home.json`;

/**
 * GET handler for the configuration endpoint.
 * Fetches the landing page configuration from GitHub repository.
 * 
 * @returns {Promise<NextResponse>} JSON response containing either the configuration data or an error message
 * @throws {Error} When the GitHub API request fails
 */
export async function GET() {
  try {
    // Construct URL with timestamp to prevent caching and specify branch
    const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`;
    
    // Fetch configuration from GitHub with authentication
    const res = await fetch(fileUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Handle unsuccessful responses
    if (!res.ok) {
      console.error('Failed to fetch config:', res.status, res.statusText);
      return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: res.status });
    }

    // Parse and return the configuration data
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log and return error response if anything fails
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}
