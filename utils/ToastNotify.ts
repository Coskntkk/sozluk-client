import { toast } from 'react-toastify';

export const successNote = (msg: string, toastId?: string | number) =>
  toast.success(msg, {
    toastId: toastId ? String(toastId) : undefined,
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });

export const errorNote = (msg: string, toastId?: string | number) =>
  toast.error(msg, {
    toastId: toastId ? String(toastId) : undefined,
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });

export const infoNote = (msg: string, toastId?: string | number) =>
  toast.info(msg, {
    toastId: toastId ? String(toastId) : undefined,
    position: 'bottom-left',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });

export const warnNote = (msg: string, toastId?: string | number) =>
  toast.warning(msg, {
    toastId: toastId ? String(toastId) : undefined,
    position: 'bottom-left',
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });
