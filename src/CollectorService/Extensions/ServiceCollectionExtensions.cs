using CollectorService.Interfaces;
using Common.Interfaces;
using System.Reflection;

namespace CollectorService.Extensions
{
    public static class ServiceCollectionExtensions
    {
		public static IServiceCollection AddParsers(this IServiceCollection services) {
			// Реєструємо всі парсери автоматично
			var parserTypes = Assembly.GetExecutingAssembly().GetTypes()
				.Where(t => typeof(IDataParser).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

			foreach (var type in parserTypes) {
				services.AddTransient(typeof(IDataParser), type);
			}

			return services;
		}

		public static IServiceCollection AddParsers(this IServiceCollection services, string pluginFolder)
        {
			if (!Directory.Exists(pluginFolder)) Directory.CreateDirectory(pluginFolder);

            // Завантажуємо всі dll з папки
            var assemblies = Directory.GetFiles(pluginFolder, "*.dll")
                .Select(Assembly.LoadFrom)
                .ToList();

            // Додаємо до списку саму збірку Колектора (внутрішні парсери)
            assemblies.Add(Assembly.GetExecutingAssembly());

            // Шукаємо типи у ВІСІХ завантажених збірках
            var parserTypes = assemblies.SelectMany(a => a.GetTypes())
                .Where(t => typeof(IDataParser).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

            foreach (var type in parserTypes)
            {
                services.AddTransient(typeof(IDataParser), type);
            }

            return services;
		}
    }
}