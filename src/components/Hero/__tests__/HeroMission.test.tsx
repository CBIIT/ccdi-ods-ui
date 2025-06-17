import { render, screen } from '@testing-library/react';
import { HeroMission } from '../HeroMission';

describe('HeroMission Component', () => {
  const defaultProps = {
    title: 'Test Mission Title',
    description: 'Test Mission Description'
  };

  test('renders title and description correctly', () => {
    render(<HeroMission {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  test('renders with ReactNode description', () => {
    const propsWithReactNode = {
      title: 'Test Title',
      description: <span data-testid="custom-description">Custom Description</span>
    };
    
    render(<HeroMission {...propsWithReactNode} />);
    
    expect(screen.getByRole('heading', { name: propsWithReactNode.title })).toBeInTheDocument();
    expect(screen.getByTestId('custom-description')).toBeInTheDocument();
  });

  test('renders with long content', () => {
    const longProps = {
      title: 'A very long mission title that might need to wrap',
      description: 'A detailed mission description that contains multiple sentences and might wrap to multiple lines in the interface. This tests how the component handles longer content.'
    };
    
    render(<HeroMission {...longProps} />);
    
    expect(screen.getByRole('heading', { name: longProps.title })).toBeInTheDocument();
    expect(screen.getByText(longProps.description)).toBeInTheDocument();
  });
});
