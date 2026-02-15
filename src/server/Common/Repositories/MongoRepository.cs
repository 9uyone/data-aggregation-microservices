using Common.Interfaces;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace Common.Repositories;

public class MongoRepository<T>(IMongoDatabase database, string collectionName) : IMongoRepository<T> where T : class {
	private readonly IMongoCollection<T> _collection = database.GetCollection<T>(collectionName);

	public async Task<T> CreateAsync(T entity) => 
		await _collection.InsertOneAsync(entity)
			.ContinueWith(_ => entity);

	public async Task<List<T>> GetAllAsync() => await _collection.Find(_ => true).ToListAsync();

	public Task<T> GetByIdAsync(Guid id) =>
		_collection.Find(Builders<T>.Filter.Eq("_id", id)).FirstOrDefaultAsync();

	public async Task<List<T>> FindAsync(Expression<Func<T, bool>> filter, int? page, int? pageSize, bool? oldFirst) =>
		await _collection.Find(filter)
			.Sort(oldFirst == true ? Builders<T>.Sort.Ascending("Timestamp") : Builders<T>.Sort.Descending("Timestamp"))
			.Skip(((page ?? 1) - 1) * (pageSize ?? 10))
			.Limit(pageSize ?? 10)
			.ToListAsync();

	public async Task ReplaceOneAsync(Expression<Func<T, bool>> filter, T entity) =>
		await _collection.ReplaceOneAsync(filter, entity);

	public async Task UpdateOneAsync(Expression<Func<T, bool>> filter, UpdateDefinition<T> update) =>
		await _collection.UpdateOneAsync(filter, update);

	public async Task DeleteAsync(Expression<Func<T, bool>> filter) =>
		await _collection.DeleteOneAsync(filter);
}