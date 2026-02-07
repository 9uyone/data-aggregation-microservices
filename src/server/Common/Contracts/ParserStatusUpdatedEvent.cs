namespace Common.Contracts;

public record ParserStatusUpdatedEvent : ICorrelatedMessage {
	public string ConfigId { get; init; }
	public Guid? CorrelationId { get; set; }
	public bool IsSuccess { get; init; }
	public string? ErrorMessage { get; init; }
	public DateTime FinishedAtUtc { get; init; }
}