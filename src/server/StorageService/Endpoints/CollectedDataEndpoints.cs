using Common.Contracts;
using Common.Extensions;
using Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace StorageService.Endpoints;

public static partial class StorageEndpoints {
	public static void MapCollectedDataEndpoints(this IEndpointRouteBuilder app) {
		var group = app.MapGroup("/storage/collected")
			.WithTags("Collected data");

		group.MapGet("/results", async (
			HttpContext httpContext,
			[FromQuery]Guid? correlationId,
			[FromQuery] Guid? configId,
			[FromQuery] int? page,
			[FromQuery] int? pageSize,
			[FromQuery] bool? oldFirst,
			IMongoRepository<DataCollectedEvent> repo) => {
				var results = await repo.FindAsync(filter: x => 
					(x.UserId == httpContext.User.GetUserId()) &&
					(configId == null || x.ConfigId == configId) &&
					(correlationId == null || x.CorrelationId == correlationId),
					page, pageSize, oldFirst);

				return Results.Ok(results);
			}).RequireAuthorization();

		group.MapGet("/result/{id}", async (
			HttpContext httpContext,
			[FromQuery] Guid? id,
			IMongoRepository<DataCollectedEvent> repo) => {
				var result = await repo.FindAsync(filter: x =>
					x.UserId == httpContext.User.GetUserId());

				if (result == null || result.Count == 0)
					return Results.NotFound();
				return Results.Ok(result[0]);
			}).RequireAuthorization();
	}
}