using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DTO
{
    public class KeSachDTO
    {
        public string? maKe { get; set; }
        public string? viTri { get; set; }
    }
    public class CreateKeSachRequest
    {
        
        public string viTri { get; set; }
    }
    public class UpdateKeSachRequest
    {
        public string viTri { get; set; }
    }
}
