using Common.Interfaces;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Common.Repositories;

public class MongoRepository<T>(IMongoDatabase database, string collectionName) : IMongoRepository<T> where T : class {
	private readonly IMongoCollection<T> _collection = database.GetCollection<T>(collectionName);

	public async Task CreateAsync(T entity) => await _collection.InsertOneAsync(entity);
	public async Task<List<T>> GetAllAsync() => await _collection.Find(_ => true).ToListAsync();

	public async Task<List<T>> GetBySourceAsync(string source, int? page = 1, int? pageSize = 20) {
		var filter = Builders<T>.Filter.Regex("Source", new BsonRegularExpression($"^{source}$", "i"));
		return await _collection.Find(filter)
			.Skip((page - 1) * pageSize)
			.Limit(pageSize)
			.ToListAsync();
	}
}