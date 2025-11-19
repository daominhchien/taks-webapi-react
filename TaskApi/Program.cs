using TaskApi.Data;
using TaskApi.Services;
using TaskApi.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args); // <-- sửa chỗ này

// Đăng ký services cho DI container
builder.Services.AddControllers();

// CORS: cho phép mọi origin, mọi method, mọi header (để React gọi thoải mái)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Đăng ký DbContext dùng MySQL (connection string lấy từ appsettings.json)
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// Đăng ký Repository + Service để inject vào Controller
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

// Middleware
app.UseCors("AllowAll");
// app.UseHttpsRedirection(); // muốn https thì bật thêm
// app.UseAuthorization();    // nếu sau này có auth

app.MapControllers();

app.Run();
