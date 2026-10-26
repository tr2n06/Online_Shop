import { BadRequestError } from '../utils/error.helper.js';

export const validate = (schema) => {
    return (req, res, next) => {
        // Kiểm tra dữ liệu request body gửi lên bằng Zod
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            // Lấy ra các lỗi chi tiết từ Zod
            const errors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            
            // Chuyển lỗi 400 sang cho Error Handler xử lý
            return next(new BadRequestError("Invalid input data", errors));
        }
        
        // Gán lại req.body bằng dữ liệu đã được làm sạch và ép kiểu bởi Zod
        req.body = result.data;
        
        // Dữ liệu hợp lệ -> tiếp tục chạy vào Controller
        next();
    };
};