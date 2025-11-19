using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<TaskItem> CreateTaskAsync(CreateTaskDto dto)
        {
            var task = new TaskItem
            {
                Name = dto.Name,
                DueDate = dto.DueDate
            };
            return await _repository.CreateAsync(task);
        }

        public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null)
                return false;

            task.Name = dto.Name;
            task.DueDate = dto.DueDate;
            task.Status = dto.Status;
            return await _repository.UpdateAsync(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string status)
        {
            return await _repository.GetByStatusAsync(status);
        }
    }
}