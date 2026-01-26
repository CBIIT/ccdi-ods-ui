import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './index';

describe('Breadcrumb', () => {
  it('renders the home link', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('displays the first path segment', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('displays the last path segment', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('renders arrow separators between breadcrumb items', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    const arrows = screen.getAllByAltText('arrow');
    expect(arrows).toHaveLength(2);
  });

  it('applies correct styling to the home link', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-[#005EA2]');
    expect(homeLink).toHaveClass('underline');
  });

  it('applies correct styling to path text without href', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation' }, { label: 'Getting Started' }]} />);
    
    const page = screen.getByText('Getting Started');
    expect(page).toHaveClass('text-[#1B1B1B]');
    expect(page).toHaveClass('text-[16px]');
  });

  it('applies correct styling to path text with href', () => {
    render(<Breadcrumbs paths={[{ label: 'Documentation', href: '/docs' }, { label: 'Getting Started' }]} />);
    
    const collection = screen.getByRole('link', { name: 'Documentation' });
    expect(collection).toHaveClass('text-[#005EA2]');
    expect(collection).toHaveClass('underline');
  });

  it('renders with different path values', () => {
    render(<Breadcrumbs paths={[{ label: 'API Reference' }, { label: 'Authentication' }]} />);
    
    expect(screen.getByText('API Reference')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
  });

  it('maintains proper breadcrumb order: Home > Path1 > Path2', () => {
    const { container } = render(<Breadcrumbs paths={[{ label: 'Guides' }, { label: 'Installation' }]} />);
    
    // Get all text nodes in order
    const allText = Array.from(container.querySelectorAll('a, span'))
      .map(el => el.textContent?.trim())
      .filter(text => text && text !== '');
    
    // Verify the order: Home should come first, then Guides, then Installation
    const homeIndex = allText.findIndex(text => text === 'Home');
    const firstPathIndex = allText.findIndex(text => text === 'Guides');
    const secondPathIndex = allText.findIndex(text => text === 'Installation');
    
    expect(homeIndex).toBeGreaterThan(-1);
    expect(firstPathIndex).toBeGreaterThan(-1);
    expect(secondPathIndex).toBeGreaterThan(-1);
    expect(homeIndex).toBeLessThan(firstPathIndex);
    expect(firstPathIndex).toBeLessThan(secondPathIndex);
  });

  it('renders empty paths without errors', () => {
    render(<Breadcrumbs paths={[]} />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });

  it('renders multiple path segments', () => {
    render(<Breadcrumbs paths={[{ label: 'Parent' }, { label: 'Child' }, { label: 'Grandchild' }]} />);
    
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Grandchild')).toBeInTheDocument();
    
    // Should have 3 arrows (one after Home, one after Parent, one after Child)
    const arrows = screen.getAllByAltText('arrow');
    expect(arrows).toHaveLength(3);
  });

  it('renders links for segments with href', () => {
    render(<Breadcrumbs paths={[{ label: 'Docs', href: '/docs' }, { label: 'Guides', href: '/docs/guides' }]} />);
    
    const docsLink = screen.getByRole('link', { name: 'Docs' });
    const guidesLink = screen.getByRole('link', { name: 'Guides' });
    
    expect(docsLink).toHaveAttribute('href', '/docs');
    expect(guidesLink).toHaveAttribute('href', '/docs/guides');
  });

  it('renders data-testid for each breadcrumb segment', () => {
    render(<Breadcrumbs paths={[{ label: 'First' }, { label: 'Second' }]} />);
    
    expect(screen.getByTestId('breadcrumb-segment-0')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-segment-1')).toBeInTheDocument();
  });
});
