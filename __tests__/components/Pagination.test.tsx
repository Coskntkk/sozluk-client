import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/shared/Pagination';

describe('Pagination Component', () => {
  it('does not render if totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders current and total pages correctly', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByText(/2 \/ 5/)).toBeInTheDocument();
  });

  it('disables Previous button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);

    const prevBtn = screen.getByText('Previous');
    expect(prevBtn).toBeDisabled();
  });

  it('disables Next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />);

    const nextBtn = screen.getByText('Next');
    expect(nextBtn).toBeDisabled();
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const prevBtn = screen.getByText('Previous');
    fireEvent.click(prevBtn);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
