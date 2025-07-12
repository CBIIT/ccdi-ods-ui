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