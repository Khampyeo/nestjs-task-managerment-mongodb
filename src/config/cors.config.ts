export const corsConfig = {
  origin: `${process.env.ORIGIN_URL || 'http://localhost:3001'}`, // Địa chỉ trang web của bạn
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Cho phép gửi cookie và dữ liệu xác thực
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
};
