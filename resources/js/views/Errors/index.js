// Export tất cả error components
export { default as NotFound } from './404Error.vue'
export { default as ServerError } from './500Error.vue'
export { default as ErrorPage } from './ErrorPage.vue'

// Các error codes phổ biến
export const ERROR_CODES = {
  NOT_FOUND: '404',
  SERVER_ERROR: '500',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  BAD_REQUEST: '400'
}

// Các error messages mặc định
export const ERROR_MESSAGES = {
  [ERROR_CODES.NOT_FOUND]: {
    title: 'Không tìm thấy trang',
    message: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'
  },
  [ERROR_CODES.SERVER_ERROR]: {
    title: 'Lỗi máy chủ',
    message: 'Xin lỗi, đã xảy ra lỗi nội bộ. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.'
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    title: 'Không được phép truy cập',
    message: 'Bạn cần đăng nhập để truy cập trang này.'
  },
  [ERROR_CODES.FORBIDDEN]: {
    title: 'Truy cập bị từ chối',
    message: 'Bạn không có quyền truy cập trang này.'
  },
  [ERROR_CODES.BAD_REQUEST]: {
    title: 'Yêu cầu không hợp lệ',
    message: 'Yêu cầu của bạn không hợp lệ hoặc thiếu thông tin cần thiết.'
  }
}
