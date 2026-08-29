using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/habits")]
[Authorize]
public class HabitsController : ControllerBase
{
    private readonly AppDbContext _db;

    public HabitsController(AppDbContext db)
    {
        _db = db;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create(CreateHabitRequest request)
    {
        var name = request.Name.Trim();

        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Habit name is required." });

        var alreadyExists = await _db.Habits
            .AnyAsync(h => h.UserId == CurrentUserId && h.Name == name);

        if (alreadyExists)
            return Conflict(new { message = "A habit with this name already exists." });

        var habit = new Habit
        {
            Name = name,
            UserId = CurrentUserId
        };

        _db.Habits.Add(habit);
        await _db.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return Ok(await BuildHabitCardAsync(habit, today, StartOfWeek(today)));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateOnly? weekStart)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var start = weekStart ?? StartOfWeek(today);

        var habits = await _db.Habits
            .Where(h => h.UserId == CurrentUserId)
            .OrderBy(h => h.CreatedAt)
            .ToListAsync();

        var results = new List<HabitCardResponse>();
        foreach (var habit in habits)
        {
            results.Add(await BuildHabitCardAsync(habit, today, start));
        }

        return Ok(results);
    }

    [HttpGet("{habitId}/week")]
    public async Task<IActionResult> GetWeek(int habitId, [FromQuery] DateOnly startDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var currentWeekStart = StartOfWeek(today);

        if (startDate.DayOfWeek != DayOfWeek.Monday)
            return BadRequest(new { message = "startDate must be a Monday." });

        if (startDate > currentWeekStart)
            return BadRequest(new { message = "Cannot request a future week." });

        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == CurrentUserId);

        if (habit is null)
            return NotFound(new { message = "Habit not found." });

        var habitWeekStart = StartOfWeek(DateOnly.FromDateTime(habit.CreatedAt));
        if (startDate < habitWeekStart)
            return BadRequest(new { message = "Cannot request a week before the habit was created." });

        return Ok(await BuildHabitCardAsync(habit, today, startDate));
    }

    private async Task<HabitCardResponse> BuildHabitCardAsync(Habit habit, DateOnly today, DateOnly weekStart)
    {
        var weekEnd = weekStart.AddDays(6);

        var completedInWeek = (await _db.HabitCompletions
            .Where(hc => hc.HabitId == habit.Id && hc.Date >= weekStart && hc.Date <= weekEnd)
            .Select(hc => hc.Date)
            .ToListAsync())
            .ToHashSet();

        var days = new List<HabitDayStatusResponse>();
        for (var d = weekStart; d <= weekEnd; d = d.AddDays(1))
        {
            days.Add(new HabitDayStatusResponse
            {
                Date = d,
                Completed = completedInWeek.Contains(d),
                IsFuture = d > today
            });
        }

        return new HabitCardResponse
        {
            Id = habit.Id,
            Name = habit.Name,
            CreatedAt = DateOnly.FromDateTime(habit.CreatedAt),
            Streak = await CalculateStreakAsync(habit.Id, today),
            Days = days
        };
    }

    private async Task<int> CalculateStreakAsync(int habitId, DateOnly today)
    {
        var completedSet = (await _db.HabitCompletions
            .Where(hc => hc.HabitId == habitId)
            .Select(hc => hc.Date)
            .ToListAsync())
            .ToHashSet();

        var cursor = today;
        if (!completedSet.Contains(cursor))
            cursor = cursor.AddDays(-1);

        var streak = 0;
        while (completedSet.Contains(cursor))
        {
            streak++;
            cursor = cursor.AddDays(-1);
        }

        return streak;
    }

    private static DateOnly StartOfWeek(DateOnly date)
    {
        var diff = ((int)date.DayOfWeek + 6) % 7; // Monday = 0 ... Sunday = 6
        return date.AddDays(-diff);
    }

    [HttpPost("{habitId}/toggle")]
    public async Task<IActionResult> ToggleCompletion(int habitId, ToggleCompletionRequest request)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.Date > today)
            return BadRequest(new { message = "Cannot mark a future date as completed." });

        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == CurrentUserId);

        if (habit is null)
            return NotFound(new { message = "Habit not found." });

        if (request.Date < DateOnly.FromDateTime(habit.CreatedAt))
            return BadRequest(new { message = "Cannot update a date before the habit was created." });

        var existing = await _db.HabitCompletions
            .FirstOrDefaultAsync(hc => hc.HabitId == habitId && hc.Date == request.Date);

        if (existing is not null)
        {
            _db.HabitCompletions.Remove(existing);
        }
        else
        {
            _db.HabitCompletions.Add(new HabitCompletion
            {
                HabitId = habitId,
                Date = request.Date
            });
        }

        await _db.SaveChangesAsync();

        return Ok(await BuildHabitCardAsync(habit, today, StartOfWeek(request.Date)));
    }

    [HttpDelete("{habitId}")]
    public async Task<IActionResult> Delete(int habitId)
    {
        var habit = await _db.Habits
            .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == CurrentUserId);

        if (habit is null)
            return NotFound(new { message = "Habit not found." });

        _db.Habits.Remove(habit);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetDailySummary()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var totalHabits = await _db.Habits
            .CountAsync(h => h.UserId == CurrentUserId);

        var completedCount = await _db.HabitCompletions
            .CountAsync(hc => hc.Date == today && hc.Habit.UserId == CurrentUserId);

        return Ok(new DailySummaryResponse
        {
            TotalHabits = totalHabits,
            CompletedCount = completedCount,
            AllCompleted = totalHabits > 0 && completedCount == totalHabits
        });
    }
}
