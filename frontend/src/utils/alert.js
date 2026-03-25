import Swal from 'sweetalert2';

const Alert = Swal.mixin({
    background: '#f8fafc no-repeat center',
    confirmButtonColor: '#9c88ff',
    cancelButtonColor: '#aaa',
    width: '320px',
    padding: '20px',
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
