using System.Security.Claims;
using api.Dal.Contracts.Common;
using api.Dto;
using api.Dto.Common;
using api.Dto.User.Notification;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public NotificationService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor,
            IMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._httpContextAccessor = httpContextAccessor;
            this._mapper = mapper;
        }

        public async Task<ServiceResponse<PagedResponseDto<NotificationDto>>> FetchUserNotifications(int? skip = null, int? take = null)
        {
            var response = new ServiceResponse<PagedResponseDto<NotificationDto>>();

            try
            {
                var userId = this.GetUserId();

                var notificationsQuery = this._unitOfWork.Repository<Notification>()
                    .Query()
                    .OrderByDescending(n => n.Sent)
                    .Where(n => n.RecipientId == userId);

                var total = await notificationsQuery.CountAsync();

                if (take.HasValue)
                    notificationsQuery = notificationsQuery.Take(take.Value);

                if (skip.HasValue)
                    notificationsQuery = notificationsQuery.Skip(skip.Value!);

                response.Data = new PagedResponseDto<NotificationDto>
                {
                    Total = total,
                    Items = await notificationsQuery
                    .Select(n => _mapper.Map<NotificationDto>(n))
                    .ToListAsync()
                };
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "An error occurred fetching notifications:" + e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<string>> SendNotification(int? senderId, int recipientId, string message,
            Models.NotificationType notificationType, bool ActionRequired)
        {

            var response = new ServiceResponse<string>();
            try
            {
                var notification = new Notification
                {
                    RecipientId = recipientId,
                    SenderId = senderId,
                    NotificationType = notificationType,
                    Message = message,
                    Sent = DateTime.UtcNow,
                    ActionRequired = ActionRequired
                };

                await this._unitOfWork.Repository<Notification>().CreateAsync(notification);
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<NotificationDto>> UpdateNotification(int notificationId, string? message, bool? isRead, bool? actionRequired)
        {
            var response = new ServiceResponse<NotificationDto>();

            try
            {
                var notification = await this._unitOfWork.Repository<Notification>()
                    .Query()
                    .FirstOrDefaultAsync(n => n.Id == notificationId);

                if (notification == null)
                {
                    response.Success = false;
                    response.Message = "Error: Notification not found.";
                    return response;
                }

                if (!string.IsNullOrEmpty(message))
                    notification.Message = message;

                if (isRead.HasValue)
                    notification.Read = isRead.Value;

                if (actionRequired.HasValue)
                    notification.ActionRequired = actionRequired.Value;

                await this._unitOfWork.Repository<Notification>().UpdateAsync(notification);
                response.Data = this._mapper.Map<NotificationDto>(notification);
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "An error occurred updating the notification: " + e.Message;
            }

            return response;
        }

        private int GetUserId()
        {
            return int.Parse(this._httpContextAccessor?.HttpContext?.User?
              .FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}