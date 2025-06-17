import { render, screen } from '@testing-library/react';
import { HeroHeader } from '../HeroHeader';

describe('HeroHeader Component', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle'
  };

  test('renders title and subtitle correctly', () => {
    render(<HeroHeader {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  test('renders with long text content', () => {
    const longProps = {
      title: 'A very long title that might wrap to multiple lines in the interface',
      subtitle: 'A detailed subtitle that contains more information and might also wrap to multiple lines'
    };
    
    render(<HeroHeader {...longProps} />);
    
    expect(screen.getByRole('heading', { name: longProps.title })).toBeInTheDocument();
    expect(screen.getByText(longProps.subtitle)).toBeInTheDocument();
  });
});
