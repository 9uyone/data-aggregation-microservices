using MongoDB.Bson.Serialization.Attributes;

namespace Common.Contracts;

public interface ICorrelatedMessage {
	Guid? CorrelationId { get; set; }
}