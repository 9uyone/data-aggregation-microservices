using CollectorService.Attributes;
using CollectorService.Extensions;
using CollectorService.Interfaces;
using CollectorService.Services;
using Common.Contracts;
using Common.Extensions;
using Common.Interfaces;
using Common.Models;
using Gateway.Services;
using Microsoft.AspNetCore.Mvc;
using Nelibur.ObjectMapper;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.LoadFromEnvFile(builder.Environment);

builder.Services.AddOpenApi();
builder.Services.AddAppRabbit(builder.Configuration);
builder.Services.AddScoped<IIntegrationDispatcher, IntegrationDispatcher>();
builder.Services.AddHttpClient<IHttpRestClient, HttpRestClient>();
builder.Services.AddAuthorization();
builder.Services.AddAppAuthentication(builder.Configuration);

builder.Services.AddSingleton<IParserRegistry, ParserRegistry>();
builder.Services.AddInternalParsers();
//builder.Services.AddExternalPlugins(Path.Combine(builder.Environment.ContentRootPath, "plugins"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

var collectorGroup = app.MapGroup("/collector")
	.RequireAuthorization();

TinyMapper.Bind<InboundDataDto, DataCollectedEvent>();
collectorGroup.MapPost("/ingest", async (InboundDataDto dto, IIntegrationDispatcher dispatcher) => {
	var @event = TinyMapper.Map<DataCollectedEvent>(dto);

	await dispatcher.DispatchAsync(@event);
	return Results.Accepted();
});

collectorGroup.MapPost("/run/{name}", async (
	string name,
	[FromBody] IDictionary<string, string>? options,
	IParserRegistry registry,
	IServiceProvider sp,
	HttpContext httpContext,
	IIntegrationDispatcher dispatcher) => {
		var userId = httpContext.User.GetUserId();
		if (userId == null)
			return Results.Unauthorized();

		var parserType = registry.GetParserType(name);
		if (parserType == null)
			return Results.NotFound($"Parser '{name}' not found");

		var parser = sp.GetRequiredService(parserType) as IDataParser;
		var info = parserType.GetCustomAttribute<ParserInfoAttribute>();
		var data = await parser.ParseAsync(options);

		var ev = TinyMapper.Map<DataCollectedEvent>(data);
		ev.UserId = userId;
		ev.ParserName = info.Name;
		ev.Type = info.DataType;

		await dispatcher.DispatchAsync(ev);
		return Results.Ok(data);
	})
	.RequireAuthorization();

collectorGroup.MapGet("/parsers", (IParserRegistry registry) => {
	return Results.Ok(registry.GetAvailableParsers());
});

collectorGroup.MapGet("/parser/{name}", async (string name, IParserRegistry registry) => {
	var details = await registry.GetParserDetailsAsync(name);
	return details != null ? Results.Ok(details) : Results.NotFound();
});

app.Run();