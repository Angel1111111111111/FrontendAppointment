using System.ComponentModel.DataAnnotations;

namespace ApiCitaOdon.Models;

public class AppointmentDto
{
    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required]
    public string TreatmentType { get; set; }

    public string? Notes { get; set; }
}