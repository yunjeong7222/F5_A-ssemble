import Swal from 'sweetalert2';

const Alert = Swal.mixin({
  confirmButtonColor: '#9c88ff',
  cancelButtonColor: '#aaa',
  borderRadius: '12px',
  customClass: {
    popup: 'swal-custom-popup',
  },
});

export default Alert;