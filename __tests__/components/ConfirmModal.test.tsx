import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/shared/ConfirmModal';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete Entry',
    message: 'Are you sure you want to permanently delete this entry?',
    confirmText: 'Delete Now',
    variant: 'danger' as const,
    loading: false,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and message when open', () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByText('Delete Entry')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to permanently delete this entry?')
    ).toBeInTheDocument();
    expect(screen.getByText('Delete Now')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Delete Entry')).not.toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText('Delete Now');
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});
