using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ToggleCompletionRequest
{
    [Required]
    public DateOnly Date { get; set; }
}