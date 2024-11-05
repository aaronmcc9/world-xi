using System.Linq.Expressions;
using api.Dal.Contracts;
using Microsoft.EntityFrameworkCore;

namespace api.Dal
{
    internal class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
    {

        internal DataContext context;
        internal DbSet<TEntity> dbSet;

        public Repository(DataContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public virtual void Create(TEntity entity)
        {
            dbSet.Add(entity);
        }

        public virtual Task CreateAsync(TEntity entity)
        {
            throw new NotImplementedException();
        }

        public virtual void Delete(object id)
        {
            TEntity entity = dbSet.Find(id);
            Delete(entity);
        }

        public virtual void Delete(TEntity entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
            }
            dbSet.Remove(entity);
        }

        public virtual Task DeleteAsync(TEntity entity)
        {
            throw new NotImplementedException();
        }

        public virtual IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter = null,
                Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
                query = query.Where(filter);

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                query = query.Include(includeProperty);

            return orderBy != null ? orderBy(query) : query;
        }

        public virtual void Update(TEntity entity)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }

        public virtual Task UpdateAsync(TEntity entity)
        {
            throw new NotImplementedException();
        }
    }
}