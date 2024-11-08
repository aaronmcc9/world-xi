using System.Linq.Expressions;
using api.Dal.Contracts;
using Microsoft.EntityFrameworkCore;

namespace api.Dal
{
    public class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
    {

        internal DataContext context;
        internal DbSet<TEntity> dbSet;
        internal UnitOfWork unitOfWork;

        public Repository(UnitOfWork unitOfWork, DataContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
            this.unitOfWork = unitOfWork;
        }

        public virtual void Create(TEntity entity)
        {
            dbSet.Add(entity);
            unitOfWork.Save();
        }

        public virtual async Task CreateAsync(TEntity entity)
        {
            dbSet.Add(entity);
            await unitOfWork.SaveAsync();
        }

        public virtual void Delete(object id)
        {
            TEntity entity = dbSet.Find(id);
            Delete(entity);
            unitOfWork.Save();
        }

        public virtual void Delete(TEntity entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
                dbSet.Attach(entity);

            dbSet.Remove(entity);
            unitOfWork.Save();
        }

        public virtual async Task DeleteAsync(TEntity entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
                dbSet.Attach(entity);

            dbSet.Remove(entity);
            await unitOfWork.SaveAsync();
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

            unitOfWork.Save();
        }

        public virtual async Task UpdateAsync(TEntity entity)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;

            await unitOfWork.SaveAsync();
        }
    }
}