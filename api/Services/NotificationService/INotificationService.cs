using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Common;
using api.Dto.User.Notification;

namespace api.Services.NotificationService
{
    public interface INotificationService
    {
        Task<ServiceResponse<PagedResponseDto<NotificationDto>>> FetchUserNotifications(int? skip = null, int? take = null);
        Task<ServiceResponse<string>> SendNotification(int? senderId, int recipientId, string message, Models.NotificationType notificationType, bool actionRequired);
        Task<ServiceResponse<NotificationDto>> UpdateNotification(int notificationId, string? message, bool? isRead, bool? actionRequired);
    }   
}