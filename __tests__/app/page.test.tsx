import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock fetch
global.fetch = jest.fn();

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render home page with hero section', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        channelUrl: 'https://www.youtube.com/@TestChannel',
        featuredVideoId: '',
      }),
    });

    render(<HomePage />);

    expect(screen.getAllByText('Honest Customer Experience India')[0]).toBeInTheDocument();
    expect(screen.getByText('Share Your Genuine Customer Experience')).toBeInTheDocument();
  });

  it('should display YouTube video when featuredVideoId exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        channelUrl: 'https://www.youtube.com/@TestChannel',
        featuredVideoId: 'test-video-id',
      }),
    });

    render(<HomePage />);

    await waitFor(() => {
      const iframe = screen.getByTitle('Featured Video');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('test-video-id'));
    });
  });

  it('should render navigation links', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        channelUrl: 'https://www.youtube.com/@TestChannel',
        featuredVideoId: '',
      }),
    });

    render(<HomePage />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getAllByText(/Submit Your Case/)[0]).toBeInTheDocument();
  });

  it('should render feature cards', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        channelUrl: 'https://www.youtube.com/@TestChannel',
        featuredVideoId: '',
      }),
    });

    render(<HomePage />);

    expect(screen.getAllByText(/Submit Your Case/)).toHaveLength(2); // Header and card
    expect(screen.getByText('We Verify')).toBeInTheDocument();
    expect(screen.getByText('Podcast Coverage')).toBeInTheDocument();
  });

  it('should render benefits section', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        channelUrl: 'https://www.youtube.com/@TestChannel',
        featuredVideoId: '',
      }),
    });

    render(<HomePage />);

    expect(screen.getByText('Why Share Your Experience?')).toBeInTheDocument();
    expect(screen.getByText(/Help others avoid similar bad experiences/i)).toBeInTheDocument();
  });
});
