using MongoDB.Driver;
using System.Linq.Expressions;

namespace Common.Interfaces;

public interface IMongoRepository<T> where T : class {
	Task<T> CreateAsync(T entity);

	Task<List<T>> GetAllAsync();
	Task<T> GetByIdAsync(Guid id);
	Task<List<T>> FindAsync(Expression<Func<T, bool>> filter, int? page = 1, int? pageSize = 10, bool? oldFirst = false);

	Task ReplaceOneAsync(Expression<Func<T, bool>> filter, T entity);
	Task UpdateOneAsync(Expression<Func<T, bool>> filter, UpdateDefinition<T> update);

	Task DeleteAsync(Expression<Func<T, bool>> filter);
}