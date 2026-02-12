import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OverlayWindow from './index';
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest';

describe('OverlayWindow', () => {
  let sessionStorageMock: Storage;

  beforeEach(() => {
    // Mock sessionStorage
    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the dialog when sessionStorage overlayLoad is not set', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('does not render the dialog when sessionStorage overlayLoad is true', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue('true');

      render(<OverlayWindow />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders with correct ARIA attributes', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'government-usage-dialog-title');
    });
  });

  describe('Dialog Visibility', () => {
    it('shows the dialog initially when not dismissed', async () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('hides the dialog when dismissed', async () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue('true');

      render(<OverlayWindow />);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Continue Button Functionality', () => {
    it('renders the Continue button', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const button = screen.getByRole('button', { name: /continue/i });
      expect(button).toBeInTheDocument();
    });

    it('closes the dialog when Continue button is clicked', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const button = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(button);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('sets sessionStorage overlayLoad to true when Continue button is clicked', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const button = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(button);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith('overlayLoad', 'true');
    });

    it('does not crash if sessionStorage is undefined when closing', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);
      Object.defineProperty(window, 'sessionStorage', {
        value: undefined,
        writable: true,
      });

      render(<OverlayWindow />);

      const button = screen.getByRole('button', { name: /continue/i });
      
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });
  });

  describe('SessionStorage Integration', () => {
    it('checks sessionStorage on mount', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      expect(sessionStorageMock.getItem).toHaveBeenCalledWith('overlayLoad');
    });

    it('respects existing sessionStorage value', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue('true');

      render(<OverlayWindow />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('handles missing sessionStorage gracefully', () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        render(<OverlayWindow />);
      }).not.toThrow();
    });
  });

  describe('Dialog Structure', () => {
    it('renders the dialog title', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const title = screen.getByText('Warning');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('id', 'government-usage-dialog-title');
    });

    it('renders the backdrop', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.querySelector('.bg-\\[\\#00000047\\]');
      expect(backdrop).toBeInTheDocument();
    });

    it('backdrop has pointer-events-none class', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.querySelector('.pointer-events-none');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Unmounting', () => {
    it('can be safely unmounted', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      const { unmount } = render(<OverlayWindow />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('removes the dialog from DOM when unmounted', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      const { unmount } = render(<OverlayWindow />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains open state correctly after closing', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      render(<OverlayWindow />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const button = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(button);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not reopen after being closed', () => {
      (sessionStorageMock.getItem as Mock).mockReturnValue(null);

      const { rerender } = render(<OverlayWindow />);

      const button = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(button);

      rerender(<OverlayWindow />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
