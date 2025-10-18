
using api.Dal.Contracts;
using api.Dal.Contracts.Common;

namespace api.Services.Common
{
    public class ServiceBase
    {
        public IUnitOfWork _unitOfWork { get; private set; }

        private bool isProtected { get; set; } = true;

        public ServiceBase(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        #region Helpers

        // protected IRepository<TEntity> Repository<TEntity>() where TEntity : class
        // {
        //     return _unitOfWork.Repository<TEntity>(this.isProtected);
        // }

        #endregion
    }
}