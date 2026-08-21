namespace backend.DTOs;

public class DailySummaryResponse
{
    public bool AllCompleted { get; set; }
    public int TotalHabits { get; set; }
    public int CompletedCount { get; set; }
}