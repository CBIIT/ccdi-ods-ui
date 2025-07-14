/**
 * Configuration utility functions for the application
 */

/**
 * Determines which GitHub branch to use based on the current environment
 *
 * @returns {string} The branch name to use for content fetching
 * - 'dev' for development environments (dev, qa, stage, localhost)
 * - 'main' for production environment
 *
 * This allows for different content versions between environments
 * while maintaining a clean separation between development and production content.
 */
export function getGithubBranch() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (
      host.includes('dev') ||
      host.includes('qa') ||
      host.includes('stage') ||
      host.includes('localhost')
    ) {
      return 'dev'; // your dev branch name
    }
  }
  return 'main'; // default to prod branch
}