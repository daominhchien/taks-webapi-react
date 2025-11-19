using TaskApi.Data;
using TaskApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TaskApi.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TaskDbContext _context;

        public TaskRepository(TaskDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _context.Tasks.OrderByDescending(t => t.CreatedDate).ToListAsync();
        }

        public async Task<TaskItem> GetByIdAsync(int id)
        {
            return await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            task.CreatedDate = DateTime.UtcNow;
            task.Status = "Đang làm";
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateAsync(TaskItem task)
        {
            var existingTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == task.Id);
            if (existingTask == null)
                return false;

            existingTask.Name = task.Name;
            existingTask.DueDate = task.DueDate;
            existingTask.Status = task.Status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TaskItem>> GetByStatusAsync(string status)
        {
            return await _context.Tasks
                .Where(t => t.Status == status)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }
    }
}