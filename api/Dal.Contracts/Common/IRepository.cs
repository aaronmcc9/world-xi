
using System.Linq.Expressions;

namespace api.Dal.Contracts
{
    public interface IRepository{

    }

    // An interface to a repository 
    public interface IRepository<TEntity> : IRepository
    {
        IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter = null,
                Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                string includeProperties = "");

        void Create(TEntity entity);

        Task CreateAsync(TEntity entity);

        void Delete(TEntity entity);

        Task DeleteAsync(TEntity entity);

        void Update(TEntity entity);

        Task UpdateAsync(TEntity entity);
    }

}