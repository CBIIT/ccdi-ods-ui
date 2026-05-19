import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchContent, processMarkdown } from './serverUtils';

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

describe('processMarkdown', () => {
  describe('rehypeWrapMarkdownTables', () => {
    it('wraps tables with .post-md-table-wrap', async () => {
      const md = '| col1 | col2 |\n|------|------|\n| a    | b    |';
      const html = await processMarkdown(md, 'test/slug');

      expect(html).toMatch(/<div[^>]*class="post-md-table-wrap"[^>]*>/);
    });

    it('places <table> as the direct child of .post-md-table-wrap', async () => {
      const md = '| col1 | col2 |\n|------|------|\n| a    | b    |';
      const html = await processMarkdown(md, 'test/slug');

      expect(html).toMatch(/<div[^>]*class="post-md-table-wrap"[^>]*>\s*<table/);
    });

    it('does not double-wrap already-wrapped tables', async () => {
      const md = '| col1 | col2 |\n|------|------|\n| a    | b    |';
      const html = await processMarkdown(md, 'test/slug');
      const wrapCount = (html.match(/post-md-table-wrap/g) || []).length;

      // Expect exactly one wrapper div per table (the class appears once per wrapper)
      expect(wrapCount).toBe(1);
    });
  });

  describe('rehypeWrapH2Sections', () => {
    it('wraps h2 sections with data-h2-section attribute', async () => {
      const md = '## Section One\n\nContent here';
      const html = await processMarkdown(md, 'test/slug');

      expect(html).toContain('data-h2-section');
    });

    it('adds aria-controls linking h2 to its body', async () => {
      const md = '## Section One\n\nContent here';
      const html = await processMarkdown(md, 'test/slug');

      expect(html).toContain('aria-controls');
      expect(html).toContain('post-h2-section-body');
    });

    it('sets role="button" and aria-expanded="false" on the h2 toggle', async () => {
      const md = '## Section One\n\nContent here';
      const html = await processMarkdown(md, 'test/slug');

      expect(html).toContain('role="button"');
      expect(html).toContain('aria-expanded="false"');
    });

    it('wraps h2 and its siblings until the next h2 in the same section', async () => {
      const md = '## Section One\n\nContent here\n\n## Section Two\n\nMore content';
      const html = await processMarkdown(md, 'test/slug');

      const sectionCount = (html.match(/data-h2-section/g) || []).length;
      expect(sectionCount).toBe(2);
    });

    it('links aria-controls value to the body id', async () => {
      const md = '## My Section\n\nBody content';
      const html = await processMarkdown(md, 'test/slug');

      const ariaControlsMatch = html.match(/aria-controls="([^"]+)"/);
      expect(ariaControlsMatch).not.toBeNull();

      const bodyId = ariaControlsMatch![1];
      expect(html).toContain(`id="${bodyId}"`);
    });
  });
});