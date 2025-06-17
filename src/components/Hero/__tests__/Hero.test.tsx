import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

describe('Hero Component', () => {
  const mockConfig = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    mission: {
      title: 'Test Mission Title',
      description: 'Test Mission Description'
    },
    image: {
      src: '/test-image.jpg',
      alt: 'Test Image Alt'
    }
  };

  test('renders with provided config', () => {
    render(<Hero config={mockConfig} />);
    
    expect(screen.getByRole('heading', { name: mockConfig.title })).toBeInTheDocument();
    expect(screen.getByText(mockConfig.subtitle)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: mockConfig.mission.title })).toBeInTheDocument();
    expect(screen.getByText(mockConfig.mission.description)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockConfig.image.alt })).toBeInTheDocument();
  });

  test('renders with default values when no config is provided', () => {
    render(<Hero />);
    
    expect(screen.getByRole('heading', { name: "Discover the NCI Data Sharing Lifecycle" })).toBeInTheDocument();
    expect(screen.getByText("NCI's Data Sharing Approach Starts and Ends with the Patient in Mind")).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "NCI Office of Data Sharing (ODS) Mission:" })).toBeInTheDocument();
    expect(screen.getByText(/To direct a comprehensive data sharing vision/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: "NCI Data Sharing Lifecycle diagram" })).toBeInTheDocument();
  });
});
