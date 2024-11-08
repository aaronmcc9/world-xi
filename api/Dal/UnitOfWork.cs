using api.Dal.Contracts.Common;

namespace api.Dal
{
    public class UnitOfWork : IUnitOfWork
    {

        public UnitOfWork(DataContext dataContext)
        {
            this.context = dataContext;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                    context.Dispose();
            }

            this.disposed = true;
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        public Repository<TEntity> Repository<TEntity>() where TEntity : class
        {
            return new Repository<TEntity>(this, this.context);
        }

        #region members
        private bool disposed = false;
        private DataContext context;

        #endregion
    }
}