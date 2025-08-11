import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricDisplay } from './metric-display';
import { FaFish, FaHeart } from 'react-icons/fa';

describe('MetricDisplay', () => {
  const defaultProps = {
    icon: <FaFish data-testid='fish-icon' />,
    label: 'Fish Count',
    value: 42,
  };

  it('should render basic metric display', () => {
    render(<MetricDisplay {...defaultProps} />);

    expect(screen.getByText('Fish Count')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('fish-icon')).toBeInTheDocument();
  });

  it('should display string values correctly', () => {
    render(<MetricDisplay icon={<FaHeart />} label='Status' value='Healthy' />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('should show positive change with green arrow up', () => {
    render(<MetricDisplay {...defaultProps} change={15} />);

    const changeElement = screen.getByText('15%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement.closest('div')).toHaveClass('text-green-400');

    // Check for arrow up icon (by checking SVG properties)
    const svgElement = changeElement.parentElement?.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should show negative change with red arrow down', () => {
    render(<MetricDisplay {...defaultProps} change={-25} />);

    const changeElement = screen.getByText('25%'); // Absolute value
    expect(changeElement).toBeInTheDocument();
    expect(changeElement.closest('div')).toHaveClass('text-red-400');
  });

  it('should show zero change as positive (green)', () => {
    render(<MetricDisplay {...defaultProps} change={0} />);

    const changeElement = screen.getByText('0%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement.closest('div')).toHaveClass('text-green-400');
  });

  it('should not show change indicator when change is undefined', () => {
    render(<MetricDisplay {...defaultProps} />);

    // Should not find any percentage text
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <MetricDisplay
        {...defaultProps}
        className='custom-metric-class'
        data-testid='metric'
      />
    );

    const metric = screen.getByTestId('metric');
    expect(metric).toHaveClass('custom-metric-class');
    expect(metric).toHaveClass('flex', 'items-center'); // Default classes
  });

  it('should forward HTML attributes', () => {
    render(
      <MetricDisplay
        {...defaultProps}
        id='metric-id'
        role='region'
        aria-label='Fish metric'
        data-value='test'
      />
    );

    const metric = screen.getByLabelText('Fish metric');
    expect(metric).toHaveAttribute('id', 'metric-id');
    expect(metric).toHaveAttribute('role', 'region');
    expect(metric).toHaveAttribute('data-value', 'test');
  });

  it('should render with proper structure and styling', () => {
    render(<MetricDisplay {...defaultProps} data-testid='metric' />);

    const metric = screen.getByTestId('metric');
    expect(metric).toHaveClass(
      'flex',
      'items-center',
      'space-x-4',
      'bg-blue-800/30',
      'p-4',
      'rounded-lg'
    );
  });

  it('should style icon container correctly', () => {
    const { container } = render(<MetricDisplay {...defaultProps} />);

    const iconContainer = container.querySelector('.w-12.h-12');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass(
      'bg-blue-700/50',
      'rounded-full',
      'flex',
      'items-center',
      'justify-center'
    );
  });

  it('should style label correctly', () => {
    render(<MetricDisplay {...defaultProps} />);

    const label = screen.getByText('Fish Count');
    expect(label).toHaveClass('text-sm', 'text-blue-200', 'mb-1');
  });

  it('should style value correctly', () => {
    render(<MetricDisplay {...defaultProps} />);

    const value = screen.getByText('42');
    expect(value).toHaveClass('text-xl', 'font-semibold', 'text-white');
  });

  it('should handle complex icons', () => {
    const ComplexIcon = () => (
      <div data-testid='complex-icon'>
        <FaFish />
        <span>Custom</span>
      </div>
    );

    render(
      <MetricDisplay
        icon={<ComplexIcon />}
        label='Complex Metric'
        value={100}
      />
    );

    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('should handle large numbers in change', () => {
    render(<MetricDisplay {...defaultProps} change={1250} />);

    expect(screen.getByText('1250%')).toBeInTheDocument();
  });

  it('should handle decimal change values', () => {
    render(<MetricDisplay {...defaultProps} change={-15.7} />);

    expect(screen.getByText('15.7%')).toBeInTheDocument();
  });

  it('should maintain consistent layout with and without change', () => {
    const { rerender } = render(<MetricDisplay {...defaultProps} />);

    const metricWithoutChange = screen.getByText('42').closest('div');
    expect(metricWithoutChange).toHaveClass(
      'flex',
      'items-center',
      'space-x-2'
    );

    rerender(<MetricDisplay {...defaultProps} change={10} />);

    const metricWithChange = screen.getByText('42').closest('div');
    expect(metricWithChange).toHaveClass('flex', 'items-center', 'space-x-2');
  });
});
