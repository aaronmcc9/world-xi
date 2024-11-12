using System.Linq.Expressions;
using api.Dal.Contracts;
using api.Dal.Contracts.Common;

namespace api.Authorization.Common
{
    public abstract class ProxyBase<TEntity> : IRepository<TEntity>
    where TEntity : class
    {
        internal IUnitOfWork unitOfWork;

        public ProxyBase(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public virtual void Create(TEntity entity)
        {
            throw new NotSupportedException();
        }

        public virtual async Task CreateAsync(TEntity entity)
        {
            throw new NotSupportedException();
        }

        public virtual void Delete(object id)
        {
            throw new NotSupportedException();
        }

        public virtual void Delete(TEntity entity)
        {
            throw new NotSupportedException();
        }

        public virtual async Task DeleteAsync(TEntity entity)
        {
            throw new NotSupportedException();
        }

        public virtual IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter = null,
                Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                string includeProperties = "")
        {
            throw new NotSupportedException();
        }

        public virtual void Update(TEntity entity)
        {
            throw new NotSupportedException();
        }

        public virtual async Task UpdateAsync(TEntity entity)
        {
            throw new NotSupportedException();
        }
    }
}