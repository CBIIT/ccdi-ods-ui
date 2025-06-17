import { render, screen } from '@testing-library/react';
import { HeroImage } from '../HeroImage';

describe('HeroImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test Image'
  };

  test('renders image with provided src and alt text', () => {
    render(<HeroImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.src);
  });

  test('uses default alt text when not provided', () => {
    render(<HeroImage src={defaultProps.src} />);
    
    expect(screen.getByRole('img', { name: 'Hero illustration' })).toBeInTheDocument();
  });

  test('renders image with the correct CSS classes', () => {
    render(<HeroImage {...defaultProps} />);
    
    const image = screen.getByRole('img', { name: defaultProps.alt });
    expect(image).toHaveClass('aspect-[1.28]', 'object-contain', 'w-[612px]', 'max-w-full', 'mt-8');
  });
});
