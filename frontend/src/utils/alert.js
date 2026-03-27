import Swal from 'sweetalert2';

const Alert = Swal.mixin({
    background: '#f8fafc',
    confirmButtonColor: '#9c88ff',
    cancelButtonColor: '#aaa',
    width: '350px',
    padding: '40px 20px',
    customClass: {
        popup: 'swal-custom-popup',
        icon: 'swal-custom-icon',
        title: 'swal-custom-title',
        text: 'swal-custom-text',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
    },
});

export default Alert;
