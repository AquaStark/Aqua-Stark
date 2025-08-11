import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card', () => {
  it('should render children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render with default styling', () => {
    render(<Card data-testid="card">Default card</Card>);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'bg-blue-800/50',
      'backdrop-blur-sm',
      'rounded-lg',
      'p-6',
      'border',
      'border-blue-600/50'
    );
  });

  it('should render title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should not render title element when title is not provided', () => {
    const { container } = render(
      <Card>
        <p>Card content without title</p>
      </Card>
    );
    
    // Check that there's no title div
    const titleDiv = container.querySelector('.text-lg.font-medium.mb-4');
    expect(titleDiv).not.toBeInTheDocument();
  });

  it('should apply title styling when title is present', () => {
    render(<Card title="Styled Title">Content</Card>);
    
    const titleElement = screen.getByText('Styled Title');
    expect(titleElement).toHaveClass(
      'text-lg',
      'font-medium',
      'mb-4',
      'border-b',
      'border-blue-600/30',
      'pb-2'
    );
  });

  it('should accept and apply custom className', () => {
    render(
      <Card className="custom-class bg-red-500" data-testid="custom-card">
        Custom styled card
      </Card>
    );
    
    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-class', 'bg-red-500');
    // Should still have default classes
    expect(card).toHaveClass('rounded-lg', 'p-6', 'border');
  });

  it('should forward HTML div attributes', () => {
    render(
      <Card
        id="test-card"
        role="region"
        aria-label="Test card region"
        data-value="test-value"
      >
        Attributes test
      </Card>
    );
    
    const card = screen.getByLabelText('Test card region');
    expect(card).toHaveAttribute('id', 'test-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('data-value', 'test-value');
  });

  it('should handle complex content structure', () => {
    render(
      <Card title="Complex Card">
        <div>
          <h2>Subtitle</h2>
          <p>Paragraph content</p>
          <button>Action button</button>
        </div>
      </Card>
    );
    
    expect(screen.getByText('Complex Card')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action button' })).toBeInTheDocument();
  });

  it('should handle empty title string', () => {
    const { container } = render(
      <Card title="">
        <p>Empty title test</p>
      </Card>
    );
    
    // Empty title should not render the title div
    const titleDiv = container.querySelector('.text-lg.font-medium.mb-4');
    expect(titleDiv).not.toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const specialTitle = 'Card with "quotes" & symbols <>';
    render(<Card title={specialTitle}>Content</Card>);
    
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('should be accessible as a div element', () => {
    render(
      <Card title="Accessibility Test">
        Accessible content
      </Card>
    );
    
    const card = screen.getByText('Accessibility Test').closest('div');
    expect(card).toBeInTheDocument();
    expect(card?.tagName).toBe('DIV');
  });

  it('should maintain title and content separation', () => {
    render(
      <Card title="Section Title">
        <p>This is the content area</p>
      </Card>
    );
    
    const titleElement = screen.getByText('Section Title');
    const contentElement = screen.getByText('This is the content area');
    
    // Title should have border-bottom, content should not
    expect(titleElement).toHaveClass('border-b');
    expect(contentElement).not.toHaveClass('border-b');
  });
});