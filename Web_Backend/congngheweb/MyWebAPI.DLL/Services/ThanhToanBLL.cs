// ThanhToanService.cs
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyWebAPI.BLL.Services
{ 
    
    public interface IThanhToanService
    {
        Task<ResponseDTO<List<ThanhToanDTO>>> GetAllAsync();
        Task<ResponseDTO<ThanhToanDTO>> GetByIdAsync(string maThanhToan);
        Task<ResponseDTO<bool>> ThanhToanPhatAsync(ThanhToanPhatDTO request);
    }
    public class ThanhToanService : IThanhToanService
    {
        private readonly IThanhToanRepository _thanhToanRepository;

        public ThanhToanService(IThanhToanRepository thanhToanRepository)
        {
            _thanhToanRepository = thanhToanRepository;
        }

        public async Task<ResponseDTO<List<ThanhToanDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _thanhToanRepository.GetAllAsync();
                return new ResponseDTO<List<ThanhToanDTO>> 
                {
                    Success = true, 
                    Message = "Lấy danh sách thành công", 
                    Data = list 
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<ThanhToanDTO>> 
                { 
                    Success = false, 
                    Message = $"Lỗi: {ex.Message}", 
                    Data = null };
            }
        }

        public async Task<ResponseDTO<ThanhToanDTO>> GetByIdAsync(string maThanhToan)
        {
            try
            {
                var item = await _thanhToanRepository.GetByIdAsync(maThanhToan);
                if (item == null)
                {
                    return new ResponseDTO<ThanhToanDTO> 
                    { 
                        Success = false, 
                        Message = "Không tìm thấy bản ghi", 
                        Data = null 
                    };
                }
                else
                {
                    return new ResponseDTO<ThanhToanDTO> 
                    { 
                        Success = true, 
                        Message = "Lấy thành công", 
                        Data = item 
                    };
                }
            }
            catch (Exception ex)
            {
                return new ResponseDTO<ThanhToanDTO> 
                { 
                    Success = false, 
                    Message = $"Lỗi: {ex.Message}", 
                    Data = null 
                };
            }
        }

        public async Task<ResponseDTO<bool>> ThanhToanPhatAsync(ThanhToanPhatDTO request)
        {
            try
            {
                // Nếu client không truyền MaThanhToan thì tự sinh
                if (string.IsNullOrWhiteSpace(request.MaThanhToan))
                {
                    request.MaThanhToan = "TT" + DateTime.Now.ToString("yyyyMMddHHmmssfff");
                }

                var ok = await _thanhToanRepository.ThanhToanPhatAsync(request);
                return new ResponseDTO<bool>
                {
                    Success = ok,
                    Message = ok ? "Thanh toán thành công" : "Thanh toán thất bại",
                    Data = ok
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

    }
}
