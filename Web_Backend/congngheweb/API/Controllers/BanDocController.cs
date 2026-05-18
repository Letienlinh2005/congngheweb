using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;

namespace MyWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanDocController : ControllerBase
    {
        private readonly IBanDocService _banDocService;

        public BanDocController(IBanDocService banDocService)
        {
            _banDocService = banDocService;
        }

        // GET api/bandoc
        //[Authorize(Roles = "Quản trị,Thủ thư")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _banDocService.GetAllAsync();

            if (response.Success)
                return Ok(response);

            return StatusCode(500, response);
        }

        // GET api/bandoc/{id}
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _banDocService.GetByIdAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // POST api/bandoc
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterBanDocRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _banDocService.RegisterAsync(request);

            if (response.Success)
                return Ok(response);

            bool isConflict = response.Message.Contains("đã tồn tại")
                           || response.Message.Contains("đã được dùng");

            return isConflict ? Conflict(response) : BadRequest(response);
        }

        // PUT api/bandoc/{id}
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateBanDocRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _banDocService.UpdateAsync(id, request);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // DELETE api/bandoc/{id}
        //[Authorize(Roles = "Quản trị,Thủ thư")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _banDocService.DeleteAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // PUT api/bandoc/update-info/{id}
        // BanDocController.cs
        
        [HttpPut("update-info/{id}")]
        public async Task<IActionResult> UpdateInfo(string id, [FromBody] UpdateThongTinBanDocDto req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Dữ liệu không hợp lệ",
                    Data = false
                });
            }

            // Đảm bảo luôn có MaBanDoc (lấy từ route, không tin body)
            req.MaBanDoc = id;

            var result = await _banDocService.UpdateThongTinBanDocAsync(req);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}