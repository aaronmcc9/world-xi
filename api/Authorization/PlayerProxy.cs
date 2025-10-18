// using System.Linq.Expressions;
// using api.Authorization.Common;
// using api.Dal.Contracts;
// using api.Dal.Contracts.Common;
// using api.Models;

// namespace api.Authorization
// {
//     public class PlayerProxy : Proxy<Player>, IPlayerRepository
//     {
//         private IUnitOfWork _unitOfWork;
//         public PlayerProxy(IUnitOfWork unitOfWork)
//         : base(unitOfWork)
//         {
//             this._unitOfWork = unitOfWork;
//         }

//         public override void Create(Player player)
//         {
//             this._unitOfWork.Repository<Player>().Create(player);
//         }

//         public override async Task CreateAsync(Player player)
//         {
//             await this._unitOfWork.Repository<Player>().CreateAsync(player);
//         }

//         public override void Delete(object id)
//         {
//             this._unitOfWork.Repository<Player>().Delete(id);
//         }

//         public override void Delete(Player player)
//         {
//             this._unitOfWork.Repository<Player>().Delete(player);
//         }

//         public override async Task DeleteAsync(Player player)
//         {
//             await this._unitOfWork.Repository<Player>().DeleteAsync(player);
//         }

//         public override IQueryable<Player> Query(Expression<Func<Player, bool>> filter = null,
//                 Func<IQueryable<Player>, IOrderedQueryable<Player>> orderBy = null,
//                 string includeProperties = "")
//         {
//             return this._unitOfWork.Repository<Player>().Query();
//         }

//         public override void Update(Player player)
//         {
//             this._unitOfWork.Repository<Player>().Update(player);
//         }

//         public override async Task UpdateAsync(Player player)
//         {
//             await this._unitOfWork.Repository<Player>().UpdateAsync(player);
//         }
//     }
// }