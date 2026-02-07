using Common.Contracts;
using Common.Interfaces;
using Common.Models;
using MassTransit;
using MongoDB.Driver;

namespace ProcessorService.Consumers;

public class ParserStatusUpdatedConsumer(IMongoRepository<ParserUserConfig> repo) : IConsumer<ParserStatusUpdatedEvent> {
	public async Task Consume(ConsumeContext<ParserStatusUpdatedEvent> context) {
		var message = context.Message;

		var update = Builders<ParserUserConfig>.Update
			.Set(c => c.LastRunUtc, message.FinishedAtUtc)
			.Set(c => c.LastStatus, message.IsSuccess)
			.Set(c => c.LastErrorMessage, message.ErrorMessage);

		await repo.UpdateOneAsync(c => c.Id == message.ConfigId, update);
	}
}