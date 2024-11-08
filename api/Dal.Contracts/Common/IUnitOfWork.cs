
namespace api.Dal.Contracts.Common
{
    public interface IUnitOfWork : IDisposable
    {
        public Repository<TEntity> Repository<TEntity>() where TEntity : class;
    }
}