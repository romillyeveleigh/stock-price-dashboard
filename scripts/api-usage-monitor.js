#!/usr/bin/env node

/**
 * API Usage Monitoring Script
 * Logs API usage patterns for security monitoring
 */

// Simple API usage logger for development/monitoring
export const logApiUsage = (endpoint, response) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint,
    status: response.status,
    remaining: response.headers.get('X-RateLimit-Remaining'),
    userAgent: navigator?.userAgent || 'Unknown',
  };

  console.log('API Usage:', logEntry);

  // In production, you would send this to a monitoring service
  // Example: send to analytics, logging service, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToMonitoringService(logEntry);
  }
};

// Security event reporter
export const reportSecurityEvent = (error, context = {}) => {
  if (
    error.message.includes('403') ||
    error.message.includes('401') ||
    error.message.includes('429')
  ) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      type: 'API_SECURITY_EVENT',
      error: error.message,
      context,
      userAgent: navigator?.userAgent || 'Unknown',
    };

    console.error('Security Event:', securityEvent);

    // In production, alert security team
    if (process.env.NODE_ENV === 'production') {
      // alertSecurityTeam(securityEvent);
    }
  }
};

// Usage pattern analyzer
export const analyzeUsagePatterns = usageLogs => {
  const patterns = {
    totalRequests: usageLogs.length,
    uniqueEndpoints: new Set(usageLogs.map(log => log.endpoint)).size,
    errorRate:
      usageLogs.filter(log => log.status >= 400).length / usageLogs.length,
    rateLimitHits: usageLogs.filter(log => log.status === 429).length,
  };

  console.log('Usage Patterns:', patterns);

  // Alert on suspicious patterns
  if (patterns.errorRate > 0.1) {
    console.warn('⚠️ High error rate detected:', patterns.errorRate);
  }

  if (patterns.rateLimitHits > 0) {
    console.warn('⚠️ Rate limit hits detected:', patterns.rateLimitHits);
  }

  return patterns;
};
