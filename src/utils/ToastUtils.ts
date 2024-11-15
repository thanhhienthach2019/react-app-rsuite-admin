import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho thông báo

// Hàm để hiển thị toast
const showToast = (type: 'success' | 'error' | 'info' | 'warn', message: string) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

// Export các hàm để sử dụng trong dự án
export const ToastUtils = {
  success: (message: string) => showToast('success', message),
  error: (message: string) => showToast('error', message),
  info: (message: string) => showToast('info', message),
  warn: (message: string) => showToast('warn', message),
};