using System.Security.Claims;
using api.Dal;
using api.Dal.Contracts.Common;
using api.Dto;
using api.Dto.User;
using api.Dto.User.Friend.FriendRequest;
using api.Dto.User.Notification;
using api.Models;
using api.Services.NotificationService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.FriendRequestService
{
    public class FriendRequestService : IFriendRequestService
    {
        private IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private IHttpContextAccessor _httpContextAccessor;

        public FriendRequestService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor,
          INotificationService notificationService)
        {
            this._unitOfWork = unitOfWork;
            this._mapper = mapper;
            this._httpContextAccessor = httpContextAccessor;
            this._notificationService = notificationService;
        }

        public async Task<ServiceResponse<string>> CreateFriendRequest(FriendRequestDto newFriendRequest)
        {
            var response = new ServiceResponse<string>();
            try
            {

                var friendRequest = this._mapper.Map<FriendRequest>(newFriendRequest);
                friendRequest.UserSentId = this.GetUserId();

                if (friendRequest.UserSentId == 0)
                {
                    response.Success = false;
                    response.Message = "An error occurred identifying users. Please try again.";
                    return response;
                }

                await this._unitOfWork.Repository<FriendRequest>().CreateAsync(friendRequest);

                var senderUsername = this._unitOfWork.Repository<User>().Query()
                  .FirstOrDefault(u => u.Id == friendRequest.UserSentId)
                  ?.Username;

                var notificationMessage = $"You received a friend request from {senderUsername}";

                await this._notificationService.SendNotification(friendRequest.UserSentId, friendRequest.UserReceivedId,
                  notificationMessage, Models.NotificationType.FriendRequest, true);

                response.Message = "Friend request sent!";
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "An error occurred creating friend request. " + e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<NotificationDto>> UpdateFriendRequest(UpdateFriendRequestDto updateFriendRequest, int notificationId)
        {
            var response = new ServiceResponse<NotificationDto>();
            try
            {

                if (updateFriendRequest.Status == Dto.User.Friend.FriendRequestStatus.Pending)
                {
                    response.Success = false;
                    response.Message = "Invalid Operation: Request must be accepted or rejected.";
                    return response;
                }

                var dbFriendRequest = this._unitOfWork.Repository<FriendRequest>().Query()
                  .FirstOrDefault(fr => fr.UserReceivedId == updateFriendRequest.UserReceivedId
                    && fr.UserSentId == updateFriendRequest.UserSentId);


                if (dbFriendRequest == null)
                {
                    response.Success = false;
                    response.Message = "Friend Request not found.";
                    return response;
                }

                dbFriendRequest.Status = (FriendRequestStatus)updateFriendRequest.Status;

                var userReceived = await this._unitOfWork.Repository<User>().Query()
                    .FirstOrDefaultAsync(u => u.Id == updateFriendRequest.UserReceivedId);

                var userSent = await this._unitOfWork.Repository<User>().Query()
                    .FirstOrDefaultAsync(u => u.Id == updateFriendRequest.UserSentId);

                if (userReceived == null || userSent == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                    return response;
                }
                // var friendRequest = this._mapper.Map<FriendRequest>(updateFriendRequest);

                if (dbFriendRequest.Status == FriendRequestStatus.Accepted)
                {
                    Friendship friendship = new Friendship
                    {
                        Users = new List<User>
                        {
                            userReceived,
                            userSent
                         }
                    };

                    await this._unitOfWork.Repository<Friendship>().CreateAsync(friendship);
                    response.Message = $"You and {userSent.Username} are now friends!";

                    //only notify friend request sender if friend request is accepted
                    await this._notificationService.SendNotification(null, userSent.Id, $"You and {userReceived.Username} are now friends!",
                     Models.NotificationType.System, false);
                }
                else if (dbFriendRequest.Status == FriendRequestStatus.Rejected)
                    response.Message = $"Friend request denied for {userSent.Username}.";

                await this._unitOfWork.Repository<FriendRequest>().UpdateAsync(dbFriendRequest);

                var notificationResponse = await this._notificationService.UpdateNotification(notificationId, response.Message, true, false);
                response.Data = notificationResponse.Data;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "There was an error responding to the request. " + e.Message;
            }

            return response;
        }

        private int GetUserId()
        {
            var userId = this._httpContextAccessor?.HttpContext?.User?
              .FindFirstValue(ClaimTypes.NameIdentifier);

            return userId != null ? int.Parse(userId) : 0;
        }
    }
}