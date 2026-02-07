using CollectorService.Services;
using Common.Contracts;
using MassTransit;

namespace ProcessorService.Consumers;

public class RunParserConsumer(IParserRunner runner, ILogger<RunParserCommand> logger) : IConsumer<RunParserCommand> {
	public async Task Consume(ConsumeContext<RunParserCommand> context) {
		var msg = context.Message;
		try {
			logger.LogInformation($"[Collector]; Parser {msg.ParserName} has been started; Config ID {msg.ConfigId}");

			await runner.ExecuteAsync(new RunParserCommand {
				ParserName = msg.ParserName,
				UserId = msg.UserId!,
				Options = msg.Options,
				CorrelationId = msg.CorrelationId
			});

			await context.Publish(new ParserStatusUpdatedEvent {
				ConfigId = msg.ConfigId,
				IsSuccess = true,
				FinishedAtUtc = DateTime.UtcNow
			});

			logger.LogInformation($"[Collector]; Parser {msg.ParserName} has been finished; Config ID {msg.ConfigId}");
		}
		catch (Exception ex) {
			await context.Publish(new ParserStatusUpdatedEvent {
				ConfigId = msg.ConfigId,
				IsSuccess = false,
				ErrorMessage = ex.Message,
				FinishedAtUtc = DateTime.UtcNow
			});
		}
	}
}