using System.ComponentModel.DataAnnotations;

namespace ApiCitaOdon.Models;

public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}