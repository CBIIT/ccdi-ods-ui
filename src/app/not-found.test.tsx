import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from './not-found';
import type { ReactNode } from 'react';


describe('NotFound', () => {
  it('renders the 404 page component', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
  });

  it('displays the 404 error icon with correct alt text', () => {
    render(<NotFound />);
    
    const icon = screen.getByAltText('404 Error Icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', expect.stringContaining('404_Icon.svg'));
  });

  it('displays the title text "Page not found."', () => {
    render(<NotFound />);
    
    const title = screen.getByText('Page not found.');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-[\'Poppins\']');
    expect(title).toHaveClass('text-[#FFFFFF]');
    expect(title).toHaveClass('text-[30px]');
  });

  it('displays the subtitle text "Looks like you got a little turned around."', () => {
    render(<NotFound />);
    
    const subtitle = screen.getByText('Looks like you got a little turned around.');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('font-[\'Poppins\']');
    expect(subtitle).toHaveClass('text-white');
    expect(subtitle).toHaveClass('text-[16px]');
  });

  it('renders the RETURN HOME link with correct href', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('applies correct styling to the RETURN HOME button', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toHaveClass('bg-[#4D889E]');
    expect(homeLink).toHaveClass('rounded-[5px]');
    expect(homeLink).toHaveClass('uppercase');
    expect(homeLink).toHaveClass('text-white');
    expect(homeLink).toHaveClass('h-[57px]');
    expect(homeLink).toHaveClass('w-[176px]');
  });

  it('applies correct background color to the container', () => {
    const { container } = render(<NotFound />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('bg-[#37526B]');
  });

  it('has correct layout structure with max-width container', () => {
    const { container } = render(<NotFound />);
    
    const innerContainer = container.querySelector('.max-w-\\[1440px\\]');
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer).toHaveClass('mx-auto');
    expect(innerContainer).toHaveClass('text-center');
  });

  it('applies correct spacing to the icon container', () => {
    const { container } = render(<NotFound />);
    
    const iconContainer = container.querySelector('.mb-\\[38px\\]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('applies correct padding to the top container', () => {
    const { container } = render(<NotFound />);
    
    const topContainer = container.querySelector('.pt-\\[90px\\]');
    expect(topContainer).toBeInTheDocument();
  });

  it('applies correct padding to the bottom container', () => {
    const { container } = render(<NotFound />);
    
    const bottomContainer = container.querySelector('.pb-\\[90px\\]');
    expect(bottomContainer).toBeInTheDocument();
  });

  it('renders the icon with correct dimensions', () => {
    render(<NotFound />);
    
    const icon = screen.getByAltText('404 Error Icon');
    expect(icon).toHaveClass('mx-auto');
  });

  it('has priority loading for the icon image', () => {
    render(<NotFound />);
    
    const icon = screen.getByAltText('404 Error Icon');
    expect(icon).toHaveAttribute('data-priority', 'true');
  });

  it('applies correct font styling to subtitle on mobile', () => {
    render(<NotFound />);
    
    const subtitle = screen.getByText('Looks like you got a little turned around.');
    expect(subtitle).toHaveClass('leading-[16px]');
    expect(subtitle).toHaveClass('md:leading-[25px]');
    expect(subtitle).toHaveClass('w-[200px]');
    expect(subtitle).toHaveClass('md:w-auto');
  });

  it('applies correct text styling to the button', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toHaveClass('font-[\'Poppins\']');
    expect(homeLink).toHaveClass('text-[16px]');
    expect(homeLink).toHaveClass('font-semibold');
    expect(homeLink).toHaveClass('leading-[32px]');
  });
});

