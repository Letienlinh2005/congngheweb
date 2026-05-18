using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    public interface IBanSaoService
    {
        Task<ResponseDTO<List<BanSaoDTO>>> GetAllAsync();
        Task<ResponseDTO<BanSaoDTO>> GetByIdAsync(string maBanSao);
        Task<ResponseDTO<BanSaoDTO>> CreateAsync(CreateBanSaoRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maBanSao, UpdateBanSaoRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maBanSao);
        Task<ResponseDTO<List<BanSaoDTO>>> GetByMaSachAsync(string maSach);
    }

    public class BanSaoService : IBanSaoService
    {
        private readonly IBanSaoRepository _repo;
        public BanSaoService(IBanSaoRepository repo)
        {
            _repo = repo;
        }
        public async Task<ResponseDTO<List<BanSaoDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _repo.GetAllAsync();
                return new ResponseDTO<List<BanSaoDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách bản sao thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<BanSaoDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<BanSaoDTO>> GetByIdAsync(string maBanSao)
        {
            try
            {
                var item = await _repo.GetByIdAsync(maBanSao);
                if (item == null)
                {
                    return new ResponseDTO<BanSaoDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy bản sao",
                        Data = null
                    };
                }
                return new ResponseDTO<BanSaoDTO>
                {
                    Success = true,
                    Message = "Lấy bản sao thành công",
                    Data = item
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<BanSaoDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<BanSaoDTO>> CreateAsync(CreateBanSaoRequest request)
        {
            try
            {
                var maBanSao = $"BS{DateTime.Now.Ticks % 1000000:D6}";
                var result = await _repo.CreateAsync(request, maBanSao);
                if (result > 0)
                {
                    var createdItem = await _repo.GetByIdAsync(maBanSao);
                    return new ResponseDTO<BanSaoDTO>
                    {
                        Success = true,
                        Message = "Tạo bản sao thành công",
                        Data = createdItem
                    };
                }
                return new ResponseDTO<BanSaoDTO>
                {
                    Success = false,
                    Message = "Tạo bản sao thất bại",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<BanSaoDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<bool>> UpdateAsync(string maBanSao, UpdateBanSaoRequest request)
        {
            try
            {
                var existingItem = await _repo.GetByIdAsync(maBanSao);
                if (existingItem == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy bản sao",
                        Data = false
                    };
                }
                var result = await _repo.UpdateAsync(maBanSao, request);
                if (result > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật bản sao thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Cập nhật bản sao thất bại",
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
        public async Task<ResponseDTO<bool>> DeleteAsync(string maBanSao)
        {
            try
            {
                var existingItem = await _repo.GetByIdAsync(maBanSao);
                if (existingItem == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy bản sao",
                        Data = false
                    };
                }
                var result = await _repo.DeleteAsync(maBanSao);
                if (result > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xóa bản sao thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Xóa bản sao thất bại",
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
        public async Task<ResponseDTO<List<BanSaoDTO>>> GetByMaSachAsync(string maSach)
        {
            try
            {
                var data = await _repo.GetByMaSachAsync(maSach);

                return new ResponseDTO<List<BanSaoDTO>>
                {
                    Success = true,
                    Message = "Lấy bản sao theo sách thành công",
                    Data = data
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<BanSaoDTO>>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        
    }
}
