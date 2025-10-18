// using System.Linq.Expressions;
// using api.Authorization.Common;
// using api.Dal;
// using api.Dal.Contracts;
// using api.Models;

// namespace api.Authorization
// {
//     public class UserProxy : Proxy<User>, 
//     IRepository<User>
//     {
//         public UserProxy(UnitOfWork unitOfWork) : base(unitOfWork)
//         {
//         }

//         public override void Create(User User)
//         {
//             Repository<User>().Create(User);
//         }

//         public override async Task CreateAsync(User User)
//         {
//             await Repository<User>().CreateAsync(User);
//         }

//         public override void Delete(User User)
//         {
//             Repository<User>().Delete(User);
//         }

//         public override async Task DeleteAsync(User User)
//         {
//             await Repository<User>().DeleteAsync(User);
//         }

//         public override IQueryable<User> Query(Expression<Func<User, bool>> filter = null,
//                 Func<IQueryable<User>, IOrderedQueryable<User>> orderBy = null,
//                 string includeProperties = "")
//         {
//             return Repository<User>().Query();
//         }

//         public override void Update(User User)
//         {
//             Repository<User>().Update(User);
//         }

//         public override async Task UpdateAsync(User User)
//         {
//             await Repository<User>().UpdateAsync(User);
//         }
//     }
// }