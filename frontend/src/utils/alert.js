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
// 자주 쓰는 알럿 프리셋
export const confirmDelete = (title = '삭제하시겠습니까?') =>
  Alert.fire({
    icon: 'warning',
    title,
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  });

export const confirmAction = (title, confirmText = '확인') =>
  Alert.fire({
    icon: 'warning',
    title,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: '취소',
  });

export const successToast = (title = '완료되었습니다.') =>
  Alert.fire({
    icon: 'success',
    title,
    timer: 1500,
    showConfirmButton: false,
  });

export default Alert;
