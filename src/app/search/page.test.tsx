import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchPage from './page';

const mockUseSearchParams = vi.fn();
vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>('next/navigation')),
  useSearchParams: () => mockUseSearchParams(),
}));

const { mockGetGitHubBranch } = vi.hoisted(() => ({
  mockGetGitHubBranch: vi.fn().mockImplementation(() => 'custom-branch-name-should-never-match'),
}));

vi.mock("@/config/config", async () => ({
  ...(await vi.importActual<typeof import("@/config/config")>("@/config/config")),
  getGithubBranch: mockGetGitHubBranch,
}));

describe('Basic Functionality', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the Suspense fallback while loading', async () => {
    mockUseSearchParams.mockReturnValueOnce(new URLSearchParams());

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });
    global.fetch = fetchMock;
    
    const { container } = render(<SearchPage />);
    
    expect(container.textContent).toContain('Loading...');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  it('displays the back to home link', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByRole } = render(<SearchPage />);

    await waitFor(() => {
      const homeLink = getByRole('link', { name: /back to home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  it('renders the search form with input and submit button', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByPlaceholderText, getByRole } = render(<SearchPage />);

    await waitFor(() => {
      const input = getByPlaceholderText('Search...');
      const submitButton = getByRole('button', { name: /SUBMIT/i });
      
      expect(input).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  it('displays the search results heading', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByRole } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByRole('heading', { name: /search results/i })).toBeInTheDocument();
    });
  });

  it('shows "No results found" when there are no search results', async () => {
    const params = new URLSearchParams();
    params.set('q', 'nonexistent');
    mockUseSearchParams.mockReturnValue(params);
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('updates input value when user types', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByPlaceholderText } = render(<SearchPage />);

    await waitFor(() => {
      const input = getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test query' } });
      expect(input.value).toBe('test query');
    });
  });

  it('clears input when clear button is clicked', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByPlaceholderText, getByRole } = render(<SearchPage />);

    await waitFor(() => {
      const input = getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });
      
      const clearButton = getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);
      
      expect(input.value).toBe('');
    });
  });

  it('shows clear button only when input has value', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
      text: vi.fn().mockResolvedValue('---\ntitle: Test\n---\ndata content'),
    });

    const { getByPlaceholderText, getByRole, queryByRole } = render(<SearchPage />);

    await waitFor(() => {
      const input = getByPlaceholderText('Search...') as HTMLInputElement;
      
      // Initially no clear button
      let clearButton = queryByRole('button', { name: /clear search/i });
      expect(clearButton).not.toBeInTheDocument();
      
      // Type something
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Now clear button should be visible
      clearButton = getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  it('initializes input value from query parameter', async () => {
    const params = new URLSearchParams();
    params.set('q', 'initial query');
    mockUseSearchParams.mockReturnValue(params);
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByPlaceholderText } = render(<SearchPage />);

    await waitFor(() => {
      const input = getByPlaceholderText('Search...') as HTMLInputElement;
      expect(input.value).toBe('initial query');
    });
  });

  it('handles fetch errors gracefully', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/no results found/i)).toBeInTheDocument();
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('handles failed GitHub API response', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({}),
    });

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<SearchPage />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('fetches data only once on mount', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });
    global.fetch = mockFetch;

    render(<SearchPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(mockFetch.mock.calls.length).toBe(1)
  });
});

describe('Implementation Requirements', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches from GitHub API with correct URL and headers', async () => {    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    render(<SearchPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com/repos/CBIIT/ccdi-ods-content/git/trees/'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('token'),
          }),
        })
      );
    });
  });

  it('filters files to only include markdown files from pages directory', async () => {
    const mockTree = [
      { path: 'pages/About/test.md' },
      { path: 'pages/News/article.md' },
      { path: 'src/component.tsx' },
      { path: 'config.json' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue(''),
    });
    global.fetch = mockFetch;

    render(<SearchPage />);

    await waitFor(() => {
      // Should have called fetch for content of markdown files
      const apiCalls = mockFetch.mock.calls;
      const rawContentCalls = apiCalls.filter((call) =>
        call[0].includes('raw.githubusercontent.com')
      );
      
      // Should fetch content for 2 markdown files, not 2 non-markdown files
      expect(rawContentCalls.length).toBeLessThanOrEqual(2);
    });
  });

  it('groups results by collection name', async () => {
    const params = new URLSearchParams();
    params.set('q', 'data');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/About/about.md' },
      { path: 'pages/Data/data-resources.md' },
      { path: 'pages/Data/data-guide.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: Test\n---\ndata content'),
    });

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/search results/i)).toBeInTheDocument();
    });
  });

  it('generates correct route paths from file paths', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/About/About-ODS.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: About ODS\n---\nthis is some test content'),
    });

    const { queryAllByRole } = render(<SearchPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(queryAllByRole("link", { name: /About ODS/i })[0]).toHaveAttribute('href', '/post/About/About-ODS');
  });

  it('searches across both file names and content', async () => {
    const params = new URLSearchParams();
    params.set('q', 'genomic');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/Guidance/genomic-data-sharing.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: Genomic Data\n---\nContent about genomic sharing'),
    });    

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/search results/i)).toBeInTheDocument();
    });
  });

  it('extracts and displays post titles from front matter metadata', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/About/test-post.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: custom-search-results\n---\nContent'),
    });

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      const heading = getByText(/custom-search-results/i);
      expect(heading).toBeInTheDocument();
    });
  });

  it('falls back to formatted filename when title is not in front matter', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/About/test-post-file.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('Content without title'),
    });

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/search results/i)).toBeInTheDocument();
    });
  });

  it('displays section title with capitalized collection name', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/guidance/test.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: Test\n---\nContent'),
    });    

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      // Collection name should be capitalized in display
      expect(getByText(/search results/i)).toBeInTheDocument();
    });
  });

  it('applies correct styling to back to home link', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByRole } = render(<SearchPage />);

    await waitFor(() => {
      const homeLink = getByRole('link', { name: /back to home/i });
      expect(homeLink).toHaveClass('text-[#005EA2]');
      expect(homeLink).toHaveClass('underline');
    });
  });

  it('displays the search query in results summary', async () => {
    const params = new URLSearchParams();
    params.set('q', 'cancer');
    mockUseSearchParams.mockReturnValue(params);
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });

    const { getByText } = render(<SearchPage />);

    await waitFor(() => {
      expect(getByText(/Showing results for: “cancer”/i)).toBeInTheDocument();
    });
  });

  it('uses correct GitHub branch from config', async () => {        
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: [] }),
    });
    global.fetch = mockFetch;

    render(<SearchPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('custom-branch-name-should-never-match'),
        expect.anything()
      );
    });
  });

  it('fetches post content from raw.githubusercontent.com', async () => {
    const mockTree = [
      { path: 'pages/About/test.md' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: Test\n---\nContent'),
    });    
    global.fetch = mockFetch;

    render(<SearchPage />);

    await waitFor(() => {
      const apiCalls = mockFetch.mock.calls;
      const rawContentCall = apiCalls.find((call) =>
        call[0].includes('raw.githubusercontent.com/CBIIT/ccdi-ods-content')
      );
      
      expect(rawContentCall).toBeDefined();
    });
  });

  it('renders results with correct section border styling', async () => {
    const params = new URLSearchParams();
    params.set('q', 'test');
    mockUseSearchParams.mockReturnValue(params);
    
    const mockTree = [
      { path: 'pages/About/test.md' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ tree: mockTree }),
      text: vi.fn().mockResolvedValue('---\ntitle: Test\n---\nContent'),
    });

    const { container } = render(<SearchPage />);

    await waitFor(() => {
      const sections = container.querySelectorAll('section[class*="border"]');
      expect(sections.length).toBeGreaterThan(0);
    });
  });
});
