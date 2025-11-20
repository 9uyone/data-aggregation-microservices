using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Common.Config;

public static class ServiceUrlExtensions {
	public static IServiceCollection AddServiceUrls(this IServiceCollection services, IConfiguration config) {
		services.Configure<ServiceUrls>(config.GetSection("ServiceUrls"));
		return services;
	}
}
