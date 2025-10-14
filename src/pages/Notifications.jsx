import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, X, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiCall, HTTP_METHODS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const NotificationItem = ({ notification, onMarkAsRead, onDismiss }) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#7152F3]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#7152F3]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#7152F3]" />;
      default:
        return <Clock className="w-5 h-5 text-[#7152F3]" />;
    }
  };

  const getNotificationDetails = (type) => {
    switch (type) {
      case 'success':
        return {
          description: 'This is a success notification. Your action was completed successfully.',
          action: 'View order details',
          actionLink: `/orders/${notification.id}`
        };
      case 'warning':
        return {
          description: 'This is a warning notification. Action may be required.',
          action: 'Update payment method',
          actionLink: '/settings/payment'
        };
      case 'error':
        return {
          description: 'This is an error notification. Something went wrong with your request.',
          action: 'Try again',
          actionLink: '#'
        };
      default:
        return {
          description: 'This is an informational notification.',
          action: 'View details',
          actionLink: '#'
        };
    }
  };

  const details = getNotificationDetails(notification.type);

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-[#F5F3FF]' : 'bg-white'}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              className={`text-base font-medium ${!notification.read ? 'text-[#7152F3]' : 'text-gray-600'} cursor-pointer`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {notification.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{notification.time}</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-[#7152F3] transition-colors p-1"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p
            className="text-base text-gray-500 mt-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {notification.message}
          </p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-gray-600 mb-3">{details.description}</p>
              <div className="flex items-center justify-between">
                <a
                  href={details.actionLink}
                  className="text-[#7152F3] hover:text-[#5E3BD9] text-sm font-medium flex items-center"
                >
                  {details.action}
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notification.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {!notification.read && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapNotification = (n) => {
    const id = n.id || n.notificationId;
    const title = n.title || n.subject || 'Notification';
    const message = n.message || n.content || n.body || '';
    const created = n.createdAt || n.timestamp || n.time;
    const time = created ? new Date(created).toLocaleString() : '—';
    const isRead = Boolean(n.read || n.isRead || (typeof n.status === 'string' && n.status.toUpperCase() === 'READ'));
    const rawType = (n.type || n.severity || n.category || 'info').toString().toLowerCase();
    const type = ['success', 'warning', 'error', 'info'].includes(rawType) ? rawType : 'info';
    const relatedId = n.orderId || n.relatedId || n.referenceId;
    return { id, title, message, time, read: isRead, type, relatedId };
  };

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const me = await apiCall(API_ENDPOINTS.USER_ME, { method: HTTP_METHODS.GET });
      const userId = me?.id || me?.userId;
      const email = me?.email || me?.username;
      const tenantId = me?.tenantId || me?.tenantID || me?.tenant_id;
      if (!userId) {
        setNotifications([]);
        setError('Unable to determine user id');
        return;
      }
      // Primary: per-user endpoint
      try {
        const res = await apiCall(API_ENDPOINTS.NOTIFICATIONS_BY_USER(userId), { method: HTTP_METHODS.GET });
        const list = Array.isArray(res?.content) ? res.content : (Array.isArray(res) ? res : []);
        setNotifications(list.map(mapNotification));
        return;
      } catch (err) {
        // If 404, treat as empty (no notifications yet). Otherwise try fallbacks.
        const msg = (err && (err.message || err.toString())) || '';
        const is404 = /404/.test(msg) || /Not Found/i.test(msg);
        if (is404) {
          setNotifications([]);
          return;
        }
        // Fallback 1: tenant scoped (if backend supports)
        try {
          const url = tenantId ? `${API_ENDPOINTS.NOTIFICATIONS}?tenantId=${encodeURIComponent(tenantId)}` : API_ENDPOINTS.NOTIFICATIONS;
          const res2 = await apiCall(url, { method: HTTP_METHODS.GET });
          const raw2 = Array.isArray(res2?.content) ? res2.content : (Array.isArray(res2) ? res2 : []);
          // Heuristic filter to current user context
          const filtered2 = raw2.filter(n => {
            const rid = n.recipient_id || n.recipientId || n.userId;
            const raddr = n.recipient_address || n.recipientAddress || n.email;
            const tId = n.tenantId || n.tenant_id || n.tenantID;
            return (rid && String(rid) === String(userId)) || (email && raddr && String(raddr).toLowerCase() === String(email).toLowerCase()) || (tenantId && String(tId) === String(tenantId));
          });
          setNotifications(filtered2.map(mapNotification));
          return;
        } catch (_) {
          // Fallback 2: global fetch, then filter by user/tenant if possible
          try {
            const res3 = await apiCall(API_ENDPOINTS.NOTIFICATIONS, { method: HTTP_METHODS.GET });
            const raw3 = Array.isArray(res3?.content) ? res3.content : (Array.isArray(res3) ? res3 : []);
            const filtered3 = raw3.filter(n => {
              const rid = n.recipient_id || n.recipientId || n.userId;
              const raddr = n.recipient_address || n.recipientAddress || n.email;
              const tId = n.tenantId || n.tenant_id || n.tenantID;
              return (rid && String(rid) === String(userId)) || (email && raddr && String(raddr).toLowerCase() === String(email).toLowerCase()) || (tenantId && String(tId) === String(tenantId));
            });
            setNotifications(filtered3.map(mapNotification));
            return;
          } catch (___) {
            setNotifications([]);
            setError('Failed to load notifications');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Filter notifications based on search query
  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return notifications;

    const query = searchQuery.toLowerCase();
    return notifications.filter(notification =>
      notification.title.toLowerCase().includes(query) ||
      notification.message.toLowerCase().includes(query)
    );
  }, [notifications, searchQuery]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const clearAllNotifications = async () => {
    if (!Array.isArray(notifications) || notifications.length === 0) return;
    setLoading(true);
    setError('');
    try {
      await Promise.all(
        notifications
          .filter(n => n?.id)
          .map(n => apiCall(API_ENDPOINTS.NOTIFICATION_BY_ID(n.id), { method: HTTP_METHODS.DELETE }))
      );
      setNotifications([]);
    } catch (_) {
      setError('Failed to clear notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    ));
  };

  const dismissNotification = async (id) => {
    try {
      if (id) await apiCall(API_ENDPOINTS.NOTIFICATION_BY_ID(id), { method: HTTP_METHODS.DELETE });
    } catch (_) {
      // ignore errors per requirement (no console noise)
    } finally {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  };
    const { user } = useAuth();
  
    if (!user) {
      return <div>Loading...</div>;
    }
  const LayoutComponent = Layout;

  return (
    <LayoutComponent>
    <div className="p-6 max-w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-base text-gray-500">Manage your notifications</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              className="block w-full h-[56px] pl-10 pr-3 py-2 border border-gray-300 rounded-[10px] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-[20px] py-2 h-[56px] text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-[10px] hover:bg-[#F5F3FF] transition-colors whitespace-nowrap"
              disabled={notifications.length === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-[20px] py-2 h-[56px] text-base font-medium text-white bg-[#7152F3] rounded-[10px] hover:bg-[#5E3BD9] transition-colors whitespace-nowrap"
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={loadNotifications}
              className="px-[20px] py-2 h-[56px] text-base font-medium text-[#7152F3] bg-white border border-gray-200 rounded-[10px] hover:bg-[#F5F3FF] transition-colors whitespace-nowrap"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center  ">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Loading notifications…</h3>
            <p className="text-base text-gray-500 mt-2">Please wait</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center  ">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Failed to load notifications</h3>
            <p className="text-base text-gray-500 mt-2">{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center  ">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">
              {searchQuery ? 'No matching notifications' : 'No notifications'}
            </h3>
            <p className="text-base text-gray-500 mt-2">
              {searchQuery
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'You don\'t have any notifications yet.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <li key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDismiss={dismissNotification}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </LayoutComponent>
  );
};

export default Notifications;
