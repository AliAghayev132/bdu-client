import Swal from 'sweetalert2';

export const confirmDialog = ({
  title = 'Əminsiniz?',
  text = 'Bu əməliyyat geri qaytarıla bilməz.',
  confirmButtonText = 'Bəli, sil',
  cancelButtonText = 'Ləğv et',
  icon = 'warning',
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#2C4B62',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'rounded-lg px-6 py-2.5 font-medium',
      cancelButton: 'rounded-lg px-6 py-2.5 font-medium',
    },
  }).then((result) => result.isConfirmed);
};

export const successAlert = (title = 'Uğurlu!', text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#2C4B62',
    confirmButtonText: 'Tamam',
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'rounded-lg px-6 py-2.5 font-medium',
    },
  });
};
