import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import App from '../../../../App';
import { BundleProvider } from '../../providers/BundleProvider';
import { STORAGE_KEY } from '../../state/persistence';

function renderApp() {
  return render(
    <BundleProvider>
      <App />
    </BundleProvider>
  );
}

describe('BundleBuilder integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('opens step 1 by default and keeps the review panel visible', () => {
    renderApp();

    expect(screen.getByRole('button', { name: /Choose your cameras/i, expanded: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Choose your plan/i, expanded: false })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /Your security system/i })).toBeInTheDocument();
  });

  it('expands a collapsed step when its header is clicked', () => {
    renderApp();

    const planHeader = screen.getByRole('button', { name: /Choose your plan/i, expanded: false });
    fireEvent.click(planHeader);

    expect(screen.getByRole('button', { name: /Choose your plan/i, expanded: true })).toBeInTheDocument();
  });

  it('updates the review panel when a product quantity changes', () => {
    renderApp();

    const cameraCard = screen.getByRole('article', { name: /Wyze Cam v4/i });
    const increaseButton = within(cameraCard).getByRole('button', { name: /Increase quantity/i });

    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    const reviewPanel = screen.getByRole('complementary', { name: /Your security system/i });
    const reviewLine = within(reviewPanel).getByText(/Wyze Cam v4/i).closest('.review-line') as HTMLElement;
    expect(within(reviewLine).getByText('3')).toBeInTheDocument();
  });

  it('preserves previously selected variant quantities when switching variants', () => {
    renderApp();

    const cameraCard = screen.getByRole('article', { name: /Wyze Cam v4/i });
    const blackChip = within(cameraCard).getByRole('button', { name: /Black/i, pressed: false });

    fireEvent.click(blackChip);

    const increaseButton = within(cameraCard).getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    const whiteChip = within(cameraCard).getByRole('button', { name: /White/i, pressed: false });
    fireEvent.click(whiteChip);

    // White was seeded with quantity 1; Black should now have 2.
    const reviewPanel = screen.getByRole('complementary', { name: /Your security system/i });
    const cameraLines = within(reviewPanel).getAllByText(/Wyze Cam v4/i);
    expect(cameraLines).toHaveLength(2);

    const quantities = cameraLines.map((line) => {
      const lineEl = line.closest('.review-line') as HTMLElement;
      const value = lineEl.querySelector('.stepper-value')?.textContent;
      return value;
    });
    expect(quantities).toContain('1');
    expect(quantities).toContain('2');

    fireEvent.click(blackChip);
    expect(within(cameraCard).getByText('2')).toBeInTheDocument();
  });

  it('keeps card and review panel steppers in sync', () => {
    renderApp();

    const cameraCard = screen.getByRole('article', { name: /Wyze Cam v4/i });
    const cardIncrease = within(cameraCard).getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(cardIncrease);

    const reviewPanel = screen.getByRole('complementary', { name: /Your security system/i });
    const reviewLine = within(reviewPanel).getByText(/Wyze Cam v4/i).closest('.review-line')!;
    const reviewDecrease = within(reviewLine as HTMLElement).getByRole('button', { name: /Decrease quantity/i });

    fireEvent.click(reviewDecrease);

    expect(within(cameraCard).getByText('1')).toBeInTheDocument();
    expect(within(reviewLine as HTMLElement).getByText('1')).toBeInTheDocument();
  });

  it('persists product selections when "Save my system for later" is clicked', () => {
    renderApp();

    const cameraCard = screen.getByRole('article', { name: /Wyze Cam v4/i });
    const increaseButton = within(cameraCard).getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    const saveButton = screen.getByRole('button', { name: /Save my system for later/i });
    fireEvent.click(saveButton);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const saved = JSON.parse(raw!);
    expect(saved.expandedStepId).toBeUndefined();

    const camera = saved.products.find((p: { id: string }) => p.id === 'wyze-cam-v4');
    expect(camera.variants.find((v: { id: string; quantity: number }) => v.id === 'white')?.quantity).toBe(3);
  });
});
