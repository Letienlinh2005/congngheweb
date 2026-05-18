using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using Microsoft.AspNetCore.Http;

namespace MyWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly ISachService _sachService;
        private readonly IWebHostEnvironment _env;

        public SachController(ISachService sachService, IWebHostEnvironment env)
        {
            _sachService = sachService;
            _env = env;
        }

        // GET api/sach
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _sachService.GetAllAsync();

            if (response.Success)
                return Ok(response);

            return StatusCode(500, response);
        }

        // GET api/sach/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _sachService.GetByIdAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // POST api/sach
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSachRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _sachService.CreateAsync(request);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        // PUT api/sach/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateSachRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _sachService.UpdateAsync(id, request);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // DELETE api/sach/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _sachService.DeleteAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }
        // POST api/sach/upload
        //[HttpPost("upload")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> UploadImage([FromForm] UploadSachImageRequest request)
        //{
        //    if (request.File == null || request.File.Length == 0)
        //        return BadRequest("Chưa chọn file");

        //    if (string.IsNullOrWhiteSpace(request.MaSach))
        //        return BadRequest("Thiếu mã sách");

        //    var root = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        //    var folder = Path.Combine(root, "images", "sach");
        //    if (!Directory.Exists(folder))
        //        Directory.CreateDirectory(folder);

        //    var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
        //    var filePath = Path.Combine(folder, fileName);

        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await request.File.CopyToAsync(stream);
        //    }

        //    var fileUrl = $"/images/sach/{fileName}";

        //    var result = await _sachService.UpdateLienKetAnhAsync(request.MaSach, fileUrl);
        //    if (result == null || !result.Success)
        //    {
        //        return StatusCode(500, result ?? new ResponseDTO<bool>
        //        {
        //            Success = false,
        //            Message = "Cập nhật DB thất bại",
        //            Data = false
        //        });
        //    }

        //    return Ok(new
        //    {
        //        success = true,
        //        url = fileUrl
        //    });
        //}
        //[HttpPost("create-with-image")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> CreateWithImage([FromForm] CreateSachWithImageRequest request)
        //{
        //    string? fileUrl = null;

        //    if (request.File != null && request.File.Length > 0)
        //    {
        //        var root = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        //        var folder = Path.Combine(root, "images", "sach");

        //        if (!Directory.Exists(folder))
        //            Directory.CreateDirectory(folder);

        //        var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
        //        var filePath = Path.Combine(folder, fileName);

        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await request.File.CopyToAsync(stream);
        //        }

        //        fileUrl = $"/images/sach/{fileName}";
        //    }

        //    var dto = new CreateSachRequest
        //    {
        //        TieuDe = request.TieuDe,
        //        TacGia = request.TacGia,
        //        NamXuatBan = request.NamXuatBan,
        //        MaTheLoai = request.MaTheLoai,  // ← QUAN TRỌNG
        //        NgonNgu = request.NgonNgu,
        //        TomTat = request.TomTat,
        //        LienKetAnh = fileUrl  // ← Đường dẫn ảnh
        //    };

        //    var result = await _sachService.CreateAsync(dto);

        //    if (!result.Success)
        //        return BadRequest(result);

        //    return Ok(result);
        //}
    }
}