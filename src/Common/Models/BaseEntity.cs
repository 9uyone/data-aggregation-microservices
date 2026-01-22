using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Models;

public abstract record BaseEntity {
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public string Id { get; init; } = ObjectId.GenerateNewId().ToString();

	public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}