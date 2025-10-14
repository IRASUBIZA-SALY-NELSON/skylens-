// API Configuration
export const API_BASE_URL = "https://stockscout-yqt4.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  REGISTER_MD: `${API_BASE_URL}/api/auth/register/md`,
  REGISTER_RETAILER: `${API_BASE_URL}/api/auth/register/retailer`,
  REGISTER_ACCOUNTANT_AT_STORE: `${API_BASE_URL}/api/auth/register/accountantAtStore`,
  REGISTER_STORE_MANAGER: `${API_BASE_URL}/api/auth/register/store_manager`,
  STORE_ORDERS_TO_APPROVE_ACCOUNTANT_AT_STORE: `${API_BASE_URL}/api/orders/store_ordersToApprove/accountantAtStore`,
  STORE_ORDERS_TO_APPROVE: `${API_BASE_URL}/api/orders/store_ordersToApprove`,
  STORE_ORDERS_TO_APPROVE_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/store_ordersToApprove?page=${page}&size=${size}`,
  INVOICES_ALL: `${API_BASE_URL}/api/invoices/allInvoices`,
  INVOICES_BY_DISTRIBUTOR: (distributorId, page = 0, size = 10) => `${API_BASE_URL}/api/invoices/allInvoices/${distributorId}?page=${page}&size=${size}`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/api/auth/resend-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,

  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  USERS_RETAILER: `${API_BASE_URL}/api/users/accountant/retailer`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  USER_ME: `${API_BASE_URL}/api/users/me`,

  // Tenant endpoints
  TENANTS: `${API_BASE_URL}/api/tenants`,
  TENANT_ADMIN: `${API_BASE_URL}/api/tenants/admin`,
  TENANT_BY_ID: (id) => `${API_BASE_URL}/api/tenants/${id}`,

  // Product endpoints
  // Use PRODUCTS for create/update (POST/PUT)
  PRODUCTS: `${API_BASE_URL}/api/products`,
  // Use PRODUCTS_FACTORY for listing products for distributor/warehouse/sales-manager/accountant
  PRODUCTS_FACTORY: `${API_BASE_URL}/api/products/factory`,
  // Single product with factory context (includes prices as seen in curl)
  PRODUCT_FACTORY_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}/factory`,
  // Retailer: products available to a store (by authenticated retailer)
  PRODUCTS_STORE: `${API_BASE_URL}/api/products/store`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCT_PRICES: (id) => `${API_BASE_URL}/api/products/${id}/prices`,

  // Price List endpoints
  PRICE_LISTS: `${API_BASE_URL}/api/pricelists`,
  PRICE_LIST_BY_ID: (id) => `${API_BASE_URL}/api/pricelists/${id}`,
  PRICE_LIST_ITEMS: `${API_BASE_URL}/api/pricelistitems`,
  PRICE_LIST_ITEM_BY_ID: (id) => `${API_BASE_URL}/api/pricelistitems/${id}`,

  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDERS_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders?page=${page}&size=${size}`,
  ORDERS_DISTRIBUTOR_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/distributor?page=${page}&size=${size}`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
  ORDER_SUBMIT: (id) => `${API_BASE_URL}/api/orders/submit/${id}`,
  ORDER_APPROVE: (id) => `${API_BASE_URL}/api/orders/approve/${id}`,
  ORDER_REJECT: (id) => `${API_BASE_URL}/api/orders/reject/${id}`,
  ORDER_FULFILL: (id) => `${API_BASE_URL}/api/orders/fulfill/${id}`,
  ORDER_STORE_FULFILL: (id) => `${API_BASE_URL}/api/orders /store/fulfill/${id}`,
  ORDER_SEND_REMINDER: (id) => `${API_BASE_URL}/api/orders/send-reminder/${id}`,
  STORE_ORDERS_TO_FULFILL_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/store_ordersToFulfill?page=${page}&size=${size}`,
  STORE_ORDER_APPROVE: (id) => `${API_BASE_URL}/api/orders/store_orders/approve/${id}`,
  STORE_ORDER_REJECT: (id) => `${API_BASE_URL}/api/orders/store_orders/reject/${id}`,
  ORDER_LINES: `${API_BASE_URL}/api/orderlines`,
  ORDER_LINE_BY_ID: (id) => `${API_BASE_URL}/api/orderlines/${id}`,

  // Inventory endpoints
  INVENTORIES: `${API_BASE_URL}/api/inventories`,
  INVENTORY_BY_ID: (id) => `${API_BASE_URL}/api/inventories/${id}`,
  INVENTORY_BY_PRODUCT: (id) => `${API_BASE_URL}/api/inventories/product/${id}`,
  INVENTORY_UPDATE: (id) => `${API_BASE_URL}/api/inventories/updateInventory/${id}`,

  // Invoice endpoints
  INVOICES: `${API_BASE_URL}/api/invoices`,
  INVOICE_BY_ID: (id) => `${API_BASE_URL}/api/invoices/${id}`,

  // Payment endpoints
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  PAYMENT_BY_ID: (id) => `${API_BASE_URL}/api/payments/${id}`,
  PAYMENTS_PROCESS: `${API_BASE_URL}/api/payments/process`,

  // Store endpoints
  STORES: `${API_BASE_URL}/api/stores`,
  STORE_BY_ID: (id) => `${API_BASE_URL}/api/stores/${id}`,

  // Warehouse endpoints
  WAREHOUSES: `${API_BASE_URL}/api/warehouses`,
  WAREHOUSE_BY_ID: (id) => `${API_BASE_URL}/api/warehouses/${id}`,

  // Distributor endpoints
  DISTRIBUTORS: `${API_BASE_URL}/distributors`,
  DISTRIBUTOR_BY_ID: (id) => `${API_BASE_URL}/distributors/${id}`,
  DISTRIBUTOR_WAREHOUSE: (id) => `${API_BASE_URL}/distributors/warehouse/${id}`,
  DISTRIBUTOR_STORE: (id) => `${API_BASE_URL}/distributors/store/${id}`,

  // Retailer endpoints
  RETAILERS: `${API_BASE_URL}/api/retailers`,
  RETAILER_BY_ID: (id) => `${API_BASE_URL}/api/retailers/${id}`,
  RETAILER_ORDERS: (id) => `${API_BASE_URL}/api/retailers/${id}/orders`,
  RETAILER_USERS: `${API_BASE_URL}/api/users/retailer`,
  ORDERS_RETAILER_STORE_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/retailer/store_orders?page=${page}&size=${size}`,
  ORDERS_RETAILER_STORE: `${API_BASE_URL}/api/orders/store_orders?page=0&size=10`,
  STORE_ORDERS: `${API_BASE_URL}/api/orders/store_orders`,
  STORE_ORDERS_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/store_orders?page=${page}&size=${size}`,
  STORE_ORDERS_TO_APPROVE: `${API_BASE_URL}/api/orders/store_ordersToApprove`,
  STORE_ORDERS_TO_APPROVE_PAGED: (page = 0, size = 10) => `${API_BASE_URL}/api/orders/store_ordersToApprove?page=${page}&size=${size}`,

  // Distributor Accountant endpoints
  DISTRIBUTOR_ACCOUNTANTS: `${API_BASE_URL}/api/distributors/accountants`,

  // Notification endpoints
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  NOTIFICATION_BY_ID: (id) => `${API_BASE_URL}/api/notifications/${id}`,
  NOTIFICATIONS_BY_USER: (userId) => `${API_BASE_URL}/api/notifications/${userId}`,

  // Activity endpoints
  ACTIVITIES: `${API_BASE_URL}/activities`,
  ACTIVITY_BY_ID: (id) => `${API_BASE_URL}/activities/${id}`,

  // Audit logs
  AUDIT_LOGS: `${API_BASE_URL}/auditlogs`,
  AUDIT_LOG_BY_ID: (id) => `${API_BASE_URL}/auditlogs/${id}`,

  // Transfer endpoints
  TRANSFERS: `${API_BASE_URL}/api/transfers`,
  TRANSFER_BY_ID: (id) => `${API_BASE_URL}/api/transfers/${id}`,
  TRANSFERS_PROCESS: `${API_BASE_URL}/api/transfers/process`,

  // Stock Transaction endpoints
  STOCK_TRANSACTIONS: `${API_BASE_URL}/api/stocktransactions`,
  STOCK_TRANSACTION_BY_ID: (id) => `${API_BASE_URL}/api/stocktransactions/${id}`,

  // Adjustment endpoints
  ADJUSTMENTS: `${API_BASE_URL}/api/adjustments`,
  ADJUSTMENT_BY_ID: (id) => `${API_BASE_URL}/api/adjustments/${id}`,

  // Daily Close endpoints
  DAILY_CLOSES: `${API_BASE_URL}/dailycloses`,
  DAILY_CLOSE_BY_ID: (id) => `${API_BASE_URL}/dailycloses/${id}`,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

// Default headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// API Helper function
export const apiCall = async (urlOrOptions = {}, additionalOptions = {}) => {
  // Handle different calling patterns:
  // 1. apiCall({url: 'endpoint', method: 'POST', body: data})
  // 2. apiCall('endpoint', {method: 'POST', body: data})
  // 3. apiCall('endpoint') - legacy string format

  let endpoint, options;

  if (typeof urlOrOptions === 'string') {
    // Pattern 2 & 3: First parameter is URL string
    endpoint = urlOrOptions;
    options = additionalOptions;
  } else {
    // Pattern 1: Single object with url property
    endpoint = urlOrOptions.url;
    options = urlOrOptions;
  }

  // Build headers: always accept JSON; only set Content-Type if a body is provided
  const headersObj = {
    ...(options.headers || {}),
  };
  if (!headersObj['Accept']) {
    headersObj['Accept'] = 'application/json';
  }
  const config = {
    method: options.method || HTTP_METHODS.GET,
    headers: headersObj,
  };

  // Add body if provided
  if (options.body) {
    config.body = options.body;
    const isFormData = (typeof FormData !== 'undefined') && (options.body instanceof FormData);
    if (!config.headers['Content-Type'] && !isFormData) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  // Add any other options (excluding url, method, headers, body to avoid conflicts)
  const { url, method, headers, body, ...otherOptions } = options;
  Object.assign(config, otherOptions);

  // Add auth token if available - check both possible keys
  // Prefer accessToken (new) over token (legacy) to avoid using a stale token
  const accessToken = localStorage.getItem("accessToken");
  const legacyToken = localStorage.getItem("token");
  const token = accessToken || legacyToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Always log API requests/responses for debugging
  const shouldLog = true;
  if (shouldLog) {
    console.log('========== API CALL DEBUG START ==========');
    console.log('Endpoint URL:', endpoint);
    console.log('Request Method:', config.method);
    console.log('Request Headers:', JSON.stringify(config.headers, null, 2));
    console.log('Request Body:', config.body);
    console.log('Request Body Type:', typeof config.body);
    console.log('Request Body Length:', config.body ? config.body.length : 'N/A');
    console.log('Auth Token Present:', !!token);
    console.log('Auth Token Source:', accessToken ? 'accessToken' : (legacyToken ? 'token' : 'none'));
    console.log('Auth Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'None');
    console.log('Full Config Object:', JSON.stringify(config, null, 2));
    console.log('Timestamp:', new Date().toISOString());
  }

  shouldLog && console.log('Making fetch request...');
  try {
    const startTime = Date.now();
    const response = await fetch(endpoint, config);
    const endTime = Date.now();

    shouldLog && console.log('========== RESPONSE RECEIVED ==========');
    shouldLog && console.log('Response Status:', response.status);
    shouldLog && console.log('Response Status Text:', response.statusText);
    shouldLog && console.log('Response OK:', response.ok);
    shouldLog && console.log('Response Time (ms):', endTime - startTime);
    shouldLog && console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    shouldLog && console.log('Response URL:', response.url);
    shouldLog && console.log('Response Type:', response.type);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let errorDetails = null;

      shouldLog && console.log('========== ERROR RESPONSE PROCESSING ==========');
      shouldLog && console.error("Response not OK. Status:", response.status);
      shouldLog && console.error("Status Text:", response.statusText);

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
        shouldLog && console.error("Server Error Details (JSON):", errorData);
        shouldLog && console.error("Server Error Details (stringified):", JSON.stringify(errorData, null, 2));
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          shouldLog && console.error("Server Error Text:", errorText);

          // Check if it's an HTML error page
          if (errorText.includes('<!DOCTYPE') || errorText.includes('<html>')) {
            errorMessage = "Server returned HTML error page instead of JSON. This usually indicates a server configuration issue or the endpoint doesn't exist.";
          } else {
            errorMessage = errorText || response.statusText || errorMessage;
          }
        } catch (textError) {
          shouldLog && console.error("Could not parse error response:", textError);
          errorMessage = response.statusText || errorMessage;
        }
      }

      // Log additional debugging info
      shouldLog && console.error("Response Status:", response.status);
      shouldLog && console.error("Response Headers:", Object.fromEntries(response.headers.entries()));
      shouldLog && console.error("Request URL:", endpoint);
      shouldLog && console.error("Request Method:", config.method);
      shouldLog && console.error("Request Headers:", config.headers);

      const enhancedError = new Error(errorMessage);
      enhancedError.status = response.status;
      enhancedError.details = errorDetails;
      throw enhancedError;
    }

    // Check if response is actually JSON before parsing
    const contentType = response.headers.get('content-type');
    shouldLog && console.log('Response Content-Type:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      shouldLog && console.log('========== NON-JSON RESPONSE ==========');
      const responseText = await response.text();
      shouldLog && console.log('Response Text (first 500 chars):', responseText.substring(0, 500));

      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
        throw new Error("Server returned HTML instead of JSON. This usually indicates the API endpoint doesn't exist or there's a server configuration issue.");
      }
      // Try to parse as JSON anyway in case content-type header is missing
      try {
        const parsedData = JSON.parse(responseText);
        shouldLog && console.log('Successfully parsed as JSON despite missing content-type');
        shouldLog && console.log('========== API CALL SUCCESS ==========');
        return parsedData;
      } catch (e) {
        throw new Error(`Expected JSON response but got: ${responseText.substring(0, 200)}...`);
      }
    }

    const responseData = await response.json();
    shouldLog && console.log('========== SUCCESSFUL RESPONSE DATA ==========');
    shouldLog && console.log('Response Data Type:', typeof responseData);
    shouldLog && console.log('Response Data (stringified):', JSON.stringify(responseData, null, 2));
    shouldLog && console.log('========== API CALL SUCCESS ==========');

    return responseData;
  } catch (error) {
    shouldLog && console.error('========== API CALL ERROR ==========');
    shouldLog && console.error("API Error Type:", error.constructor.name);
    shouldLog && console.error("API Error Message:", error.message);
    shouldLog && console.error("API Error Stack:", error.stack);
    shouldLog && console.error("Network Error Details:", error);
    shouldLog && console.error('========== API CALL ERROR END ==========');
    throw error;
  }
};

export default API_ENDPOINTS;
