using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using System.Text.RegularExpressions;

namespace MyWebAPI.BLL.Services
{
    // Interface - Định nghĩa các methods
    public interface IBanDocService
    {
        Task<ResponseDTO<List<BanDocDTO>>> GetAllAsync();
        Task<ResponseDTO<BanDocDTO>> GetByIdAsync(string maBanDoc);
        Task<ResponseDTO<RegisterBanDocResponse>> RegisterAsync(RegisterBanDocRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maBanDoc, UpdateBanDocRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maBanDoc);
        Task<ResponseDTO<bool>> UpdateThongTinBanDocAsync(UpdateThongTinBanDocDto req);
    }

    // Implementation - Class thực thi
    public class BanDocService : IBanDocService
    {
        private readonly IBanDocRepository _banDocRepository;

        public BanDocService(IBanDocRepository banDocRepository)
        {
            _banDocRepository = banDocRepository;
        }

        public async Task<ResponseDTO<List<BanDocDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _banDocRepository.GetAllAsync();
                return new ResponseDTO<List<BanDocDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<BanDocDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<BanDocDTO>> GetByIdAsync(string maBanDoc)
        {
            try
            {
                var banDoc = await _banDocRepository.GetByIdAsync(maBanDoc);
                if (banDoc == null)
                {
                    return new ResponseDTO<BanDocDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy bạn đọc",
                        Data = null
                    };
                }

                return new ResponseDTO<BanDocDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin thành công",
                    Data = banDoc
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<BanDocDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<RegisterBanDocResponse>> RegisterAsync(RegisterBanDocRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.HoTen))
                    return Fail("Họ tên không được để trống");

                if (string.IsNullOrWhiteSpace(request.Email))
                    return Fail("Email không được để trống");

                if (!IsValidEmail(request.Email))
                    return Fail("Email không đúng định dạng");

                if (string.IsNullOrWhiteSpace(request.DienThoai))
                    return Fail("Điện thoại không được để trống");

                if (!IsValidPhone(request.DienThoai))
                    return Fail("Số điện thoại không hợp lệ (phải có 10-11 chữ số)");

                if (string.IsNullOrWhiteSpace(request.MatKhau))
                    return Fail("Mật khẩu không được để trống");

                // Gọi repository — SP tự tạo mã, số thẻ, tài khoản
                var result = await _banDocRepository.RegisterAsync(request);

                return new ResponseDTO<RegisterBanDocResponse>
                {
                    Success = true,
                    Message = "Thêm bạn đọc thành công",
                    Data = result
                };
            }
            catch (SqlException ex)
            {
                // Bắt lỗi nghiệp vụ từ RAISERROR trong SP
                var msg = ex.Message switch
                {
                    var m when m.Contains("Tên đăng nhập đã tồn tại") => "Tên đăng nhập đã tồn tại",
                    var m when m.Contains("Email này đã được dùng") => "Email này đã được dùng cho một bạn đọc khác",
                    _ => $"Lỗi database: {ex.Message}"
                };
                return Fail(msg);
            }
            catch (Exception ex)
            {
                return Fail($"Lỗi: {ex.Message}");
            }
        }

        // Helper tránh lặp code
        private static ResponseDTO<RegisterBanDocResponse> Fail(string message) =>
            new() { Success = false, Message = message, Data = null };

        public async Task<ResponseDTO<bool>> UpdateAsync(string maBanDoc, UpdateBanDocRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.HoTen))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Họ tên không được để trống",
                        Data = false
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Email không được để trống",
                        Data = false
                    };
                }

                if (!IsValidEmail(request.Email))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Email không đúng định dạng",
                        Data = false
                    };
                }

                if (!IsValidPhone(request.DienThoai))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Số điện thoại không hợp lệ",
                        Data = false
                    };
                }

                var rows = await _banDocRepository.UpdateAsync(maBanDoc, request);

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
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
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

        public async Task<ResponseDTO<bool>> DeleteAsync(string maBanDoc)
        {
            try
            {
                var rows = await _banDocRepository.DeleteAsync(maBanDoc);

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
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
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

        // Helper methods for validation
        private bool IsValidEmail(string email)
        {
            try
            {
                var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
                return emailRegex.IsMatch(email);
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhone(string phone)
        {
            phone = phone.Replace(" ", "").Replace("-", "");

            return Regex.IsMatch(phone, @"^\d{10,11}$");
        }
        public async Task<ResponseDTO<bool>> UpdateThongTinBanDocAsync(UpdateThongTinBanDocDto req)
        {
            try
            {
                var rows = await _banDocRepository.UpdateThongTinBanDocAsync(
                    req.MaBanDoc, req.HoTen, req.Email, req.DienThoai);

                if (rows != 0)   
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thông tin cá nhân thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy bạn đọc",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Lỗi: " + ex.Message,
                    Data = false
                };
            }
        }
    }
}