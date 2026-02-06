using Hangfire;

namespace SchedulerService;

public static class UseAppHangfire {
	public static void UseHangfireDashboard(this WebApplication app) {
		var env = app.Environment.EnvironmentName;

		// Dashboard only for local
		if (env == "Development") {
			app.UseHangfireDashboard("/hangfire");
		}
	}
}