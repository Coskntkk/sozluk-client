import { toast } from 'react-toastify';
import { successNote, errorNote, warnNote, infoNote } from '@/utils/ToastNotify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe('ToastNotify Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call toast.success with the correct message', () => {
    successNote('Operation successful');
    expect(toast.success).toHaveBeenCalledWith(
      'Operation successful',
      expect.objectContaining({ autoClose: 3000, theme: 'dark' })
    );
  });

  it('should call toast.error with the error message', () => {
    errorNote('Something went wrong');
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong',
      expect.objectContaining({ autoClose: 3000, theme: 'dark' })
    );
  });

  it('should call toast.warning with the warning message', () => {
    warnNote('Warning message');
    expect(toast.warning).toHaveBeenCalledWith(
      'Warning message',
      expect.objectContaining({ autoClose: 3500, theme: 'dark' })
    );
  });

  it('should call toast.info with the info message', () => {
    infoNote('Informational notice');
    expect(toast.info).toHaveBeenCalledWith(
      'Informational notice',
      expect.objectContaining({ autoClose: 4000, theme: 'dark' })
    );
  });
});
