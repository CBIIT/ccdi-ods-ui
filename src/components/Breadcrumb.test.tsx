import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders the home link', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('displays the collection name', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('displays the page name', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('renders arrow separators between breadcrumb items', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    const arrows = screen.getAllByAltText('arrow');
    expect(arrows).toHaveLength(2);
  });

  it('applies correct styling to the home link', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-[#005EA2]');
    expect(homeLink).toHaveClass('underline');
  });

  it('applies correct styling to collection text', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    const collection = screen.getByText('Documentation');
    expect(collection).toHaveClass('text-[#1B1B1B]');
    expect(collection).toHaveClass('text-[16px]');
  });

  it('applies correct styling to page text', () => {
    render(<Breadcrumb collection="Documentation" page="Getting Started" />);
    
    const page = screen.getByText('Getting Started');
    expect(page).toHaveClass('text-[#1B1B1B]');
    expect(page).toHaveClass('text-[16px]');
  });

  it('renders with different collection and page values', () => {
    render(<Breadcrumb collection="API Reference" page="Authentication" />);
    
    expect(screen.getByText('API Reference')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toBeInTheDocument();
  });

  it('maintains proper breadcrumb order: Home > Collection > Page', () => {
    const { container } = render(<Breadcrumb collection="Guides" page="Installation" />);
    
    // Get all text nodes in order
    const allText = Array.from(container.querySelectorAll('a, span'))
      .map(el => el.textContent?.trim())
      .filter(text => text && text !== '');
    
    // Verify the order: Home should come first, then Guides, then Installation
    const homeIndex = allText.findIndex(text => text === 'Home');
    const collectionIndex = allText.findIndex(text => text === 'Guides');
    const pageIndex = allText.findIndex(text => text === 'Installation');
    
    expect(homeIndex).toBeGreaterThan(-1);
    expect(collectionIndex).toBeGreaterThan(-1);
    expect(pageIndex).toBeGreaterThan(-1);
    expect(homeIndex).toBeLessThan(collectionIndex);
    expect(collectionIndex).toBeLessThan(pageIndex);
  });
});
