import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchContent } from './serverUtils';

vi.mock('@/config/config', () => ({
  getGithubBranch: () => 'main',
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchContent', () => {
  it('returns null when the response status is 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => '',
    } as Response);

    const result = await fetchContent('foo/bar');
    expect(result).toBeNull();
  });

  it('throws an error when the response is not OK', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal server error',
    } as Response);

    await expect(fetchContent('baz/qux')).rejects.toThrow(
      'Failed to fetch content (500)'
    );
  });
});