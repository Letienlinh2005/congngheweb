using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    // Interface - Định nghĩa các methods
    public interface ITaiKhoanService
    {
        Task<ResponseDTO<List<TaiKhoanDTO>>> GetAllAsync();
        Task<ResponseDTO<TaiKhoanDTO>> GetByIdAsync(string maTaiKhoan);
        Task<ResponseDTO<TaiKhoanDTO>> CreateAsync(CreateTaiKhoanRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maTaiKhoan);
        Task<ResponseDTO<TaiKhoanDTO>> DangNhapAsync(string username, string password);

        Task<ResponseDTO<TaiKhoanDTO>> TaoTaiKhoanBanDoc(TaoTaiKhoanBanDoc request);

    }

    // Implementation - Class thực thi
    public class TaiKhoanService : ITaiKhoanService
    {
        private readonly ITaiKhoanRepository _taiKhoanRepository;

        public TaiKhoanService(ITaiKhoanRepository taiKhoanRepository)
        {
            _taiKhoanRepository = taiKhoanRepository;
        }
        
        public async Task<ResponseDTO<List<TaiKhoanDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _taiKhoanRepository.GetAllAsync();
                return new ResponseDTO<List<TaiKhoanDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<TaiKhoanDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<TaiKhoanDTO>> GetByIdAsync(string maTaiKhoan)
        {
            try
            {
                var taiKhoan = await _taiKhoanRepository.GetByIdAsync(maTaiKhoan);
                if (taiKhoan == null)
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy tài khoản",
                        Data = null
                    };
                }

                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin thành công",
                    Data = taiKhoan
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<TaiKhoanDTO>> CreateAsync(CreateTaiKhoanRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.TenDangNhap))
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Tên đăng nhập không được để trống",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.MatKhau))
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Mật khẩu không được để trống",
                        Data = null
                    };
                }

                if (request.MatKhau.Length < 6)
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Mật khẩu phải có ít nhất 6 ký tự",
                        Data = null
                    };
                }

                var newId = request.MaTaiKhoan ?? "TK" + Guid.NewGuid().ToString("N")[..7].ToUpper();

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau, 10);

                var rows = await _taiKhoanRepository.CreateAsync(request, newId, hashedPassword);

                if (rows > 0)
                {
                    var taiKhoanDTO = new TaiKhoanDTO
                    {
                        MaTaiKhoan = newId,
                        TenDangNhap = request.TenDangNhap,
                        MatKhau = hashedPassword,
                        VaiTro = request.VaiTro,
                        MaBanDoc = request.MaBanDoc
                    };

                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = true,
                        Message = "Thêm tài khoản thành công",
                        Data = taiKhoanDTO
                    };
                }

                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = "Không thêm được tài khoản",
                    Data = null
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.TenDangNhap))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Tên đăng nhập không được để trống",
                        Data = false
                    };
                }

                if (string.IsNullOrWhiteSpace(request.MatKhau))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Mật khẩu không được để trống",
                        Data = false
                    };
                }

                if (request.MatKhau.Length < 6)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Mật khẩu phải có ít nhất 6 ký tự",
                        Data = false
                    };
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau, 10);

                var rows = await _taiKhoanRepository.UpdateAsync(maTaiKhoan, request, hashedPassword);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy tài khoản",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = false
                };
            }
        }

        public async Task<ResponseDTO<bool>> DeleteAsync(string maTaiKhoan)
        {
            try
            {
                var rows = await _taiKhoanRepository.DeleteAsync(maTaiKhoan);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xoá thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy tài khoản",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<TaiKhoanDTO>> DangNhapAsync(string tenDangNhap, string matKhauNhap)
        {
            var tk = await _taiKhoanRepository.GetByTenDangNhapAsync(tenDangNhap);
            if (tk == null)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = "Tài khoản không tồn tại",
                    Data = null
                };
            }

            var ok = BCrypt.Net.BCrypt.Verify(matKhauNhap, tk.MatKhau);
            if (!ok)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = "Sai mật khẩu",
                    Data = null
                };
            }

            var dto = new TaiKhoanDTO
            {
                MaTaiKhoan = tk.MaTaiKhoan,
                TenDangNhap = tk.TenDangNhap,
                VaiTro = tk.VaiTro,
                MaBanDoc = tk.MaBanDoc
            };

            return new ResponseDTO<TaiKhoanDTO>
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Data = dto
            };
        }
        public async Task<ResponseDTO<TaiKhoanDTO>> TaoTaiKhoanBanDoc(TaoTaiKhoanBanDoc request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.HoTen))
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Thiếu họ tên",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Thiếu email",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.MatKhau) || request.MatKhau.Length < 6)
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Mật khẩu phải có ít nhất 6 ký tự",
                        Data = null
                    };
                }

                var hoTen = request.HoTen.Trim();
                var email = request.Email.Trim();
                var dienThoai = request.DienThoai?.Trim() ?? "";

                // hash mật khẩu
                var hashed = BCrypt.Net.BCrypt.HashPassword(request.MatKhau, 10);

                // gọi repository
                var tk = await _taiKhoanRepository.RegisterReaderAsync(hoTen, email, dienThoai, hashed);

                if (tk == null)
                {
                    return new ResponseDTO<TaiKhoanDTO>
                    {
                        Success = false,
                        Message = "Không tạo được tài khoản bạn đọc",
                        Data = null
                    };
                }

                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = true,
                    Message = "Tạo tài khoản bạn đọc thành công",
                    Data = tk
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = "Lỗi database: " + ex.Message,
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TaiKhoanDTO>
                {
                    Success = false,
                    Message = "Lỗi: " + ex.Message,
                    Data = null
                };
            }
        }
    }
}