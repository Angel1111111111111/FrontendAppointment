using System.ComponentModel.DataAnnotations;

namespace ApiCitaOdon.Models.DTOs
{
    public class UpdateStatusDto
    {
        [Required]
        public string Status { get; set; }
    }
}
