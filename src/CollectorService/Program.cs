using CollectorService.Extensions;
using CollectorService.Interfaces;
using CollectorService.Services;
using Common.Contracts;
using Common.Extensions;
using Common.Interfaces;
using Common.Models;
using Gateway.Services;
using Nelibur.ObjectMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Configuration.LoadFromEnvFile(builder.Environment);

builder.Services.AddOpenApi();
builder.Services.AddAppRabbit(builder.Configuration);
builder.Services.AddScoped<IIntegrationDispatcher, IntegrationDispatcher>();
builder.Services.AddHttpClient<IHttpRestClient, HttpRestClient>();
builder.Services.AddParsers();
builder.Services.AddAuthorization();
builder.Services.AddAppAuthentication(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

TinyMapper.Bind<InboundDataDto, DataCollectedEvent>();
app.MapPost("/ingest", async (InboundDataDto dto, IIntegrationDispatcher dispatcher) => {
	var @event = TinyMapper.Map<DataCollectedEvent>(dto);

	await dispatcher.DispatchAsync(@event);
	return Results.Accepted();
});

app.MapPost("/collector/run/{name}", async (
	string name,
	HttpContext httpContext,
	IEnumerable<IDataParser> parsers,
	IIntegrationDispatcher dispatcher) => {
		var userId = httpContext.User.GetUserId();
		if (userId == null)
			return Results.Unauthorized();

		var parser = parsers.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
		if (parser == null)
			return Results.NotFound($"Парсер {name} не знайдено");

		var data = await parser.ParseAsync();
		data.UserId = userId;
		data.ParserName = parser.Name;

		await dispatcher.DispatchAsync(TinyMapper.Map<DataCollectedEvent>(data));
		return Results.Ok(data);
	})
	.RequireAuthorization();

app.Run();