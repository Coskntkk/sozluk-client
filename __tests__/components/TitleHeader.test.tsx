import React from 'react';
import { render, screen } from '@testing-library/react';
import TitleHeader from '@/components/shared/TitleHeader';

describe('TitleHeader Component', () => {
  it('renders the topic title as h1 heading', () => {
    render(<TitleHeader title="Software Engineering" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Software Engineering');
  });

  it('renders single entry count text correctly', () => {
    render(<TitleHeader title="Single Entry Topic" count={1} />);

    expect(screen.getByText('1 entry')).toBeInTheDocument();
  });

  it('renders multiple entries count text correctly', () => {
    render(<TitleHeader title="Multi Entry Topic" count={42} />);

    expect(screen.getByText('42 entries')).toBeInTheDocument();
  });

  it('does not render counter badge when count prop is omitted', () => {
    render(<TitleHeader title="No Count Topic" />);

    expect(screen.queryByText(/entries|entry/)).not.toBeInTheDocument();
  });
});
