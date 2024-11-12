using System.Linq.Expressions;
using api.Dal;
using api.Dal.Contracts;
using Microsoft.EntityFrameworkCore;

namespace api.Authorization
{
    public class Proxy<TEntity> : IRepository<TEntity>
    where TEntity : class
    {

        internal DataContext context;
        internal DbSet<TEntity> dbSet;
        internal UnitOfWork unitOfWork;

        public Proxy(UnitOfWork unitOfWork, DataContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
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