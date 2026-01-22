using Common.Config;
using Common.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load config
builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true);
builder.Configuration.LoadFromEnvFile(builder.Environment);

// Register services
builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddAppRabbit(builder.Configuration);

var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer("Bearer", options => {
		options.TokenValidationParameters = new TokenValidationParameters {
			ValidateIssuer = true,
			ValidIssuer = jwtOptions.Issuer,

			ValidateAudience = true,
			ValidAudience = jwtOptions.Audience,

			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),

			ValidateLifetime = true
		};
	});

var app = builder.Build();

//app.UseHttpsRedirection();

app.Use(async (context, next) => {
	var path = context.Request.Path.Value!;
	if (path.Length > 1 && path.EndsWith("/"))
		context.Request.Path = path.TrimEnd('/');
	await next();
});

await app.UseOcelot();


app.Run();