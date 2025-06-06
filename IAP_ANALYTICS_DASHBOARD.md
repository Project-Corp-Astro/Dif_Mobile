# IAP Analytics Dashboard Configuration

## Overview
This document provides specifications for configuring analytics dashboards to monitor the IAP system after migration from `expo-in-app-purchases` to `react-native-iap`. These dashboards will help track the success of the migration and identify any issues that need to be addressed.

## Implementation Status

✅ **All analytics events verified**: All IAP analytics events have been successfully implemented and verified using the automated verification script.

**Verification Reports:**
- Positive test cases: `/corp-astro-mobile/iap_analytics_verification_report.md`
- Negative test cases: `/corp-astro-mobile/iap_analytics_negative_verification_report.md`

**Next Steps:**
- Configure the dashboards as specified below
- Set up alerting thresholds
- Deploy monitoring for production rollout

## Dashboard Components

### 1. IAP Funnel Overview

**Purpose:** Track the complete IAP user journey from product fetch to successful purchase

**Key Metrics:**
- Product fetch success rate
- Purchase initiation rate
- Purchase completion rate
- Receipt verification success rate
- Overall funnel conversion rate

**Visualization:**
- Funnel chart showing drop-off at each stage
- Time series graph showing conversion rates over time
- Platform comparison (iOS vs Android)

### 2. Purchase Performance Dashboard

**Purpose:** Monitor the health of the purchase system

**Key Metrics:**
- Purchase success rate by product type
- Average purchase completion time
- Error rate by error type
- Cancellation rate
- Revenue impact

**Visualization:**
- Success/failure pie charts
- Error breakdown by type
- Time series showing purchase volume and success rates
- Heatmap of purchase activity by time of day/week

### 3. Receipt Verification Dashboard

**Purpose:** Monitor backend integration performance

**Key Metrics:**
- Receipt verification success rate
- Average verification time
- Error rate by error type
- Platform-specific verification issues

**Visualization:**
- Success/failure gauge
- Time series of verification performance
- Error breakdown by type
- Response time distribution

### 4. Subscription Status Dashboard

**Purpose:** Track subscription lifecycle events

**Key Metrics:**
- Active subscriptions
- New subscriptions
- Renewals
- Cancellations
- Upgrades/downgrades
- Trial conversions

**Visualization:**
- Subscription status breakdown
- Subscription growth over time
- Retention curves
- Trial conversion rate

### 5. Error Monitoring Dashboard

**Purpose:** Quickly identify and diagnose issues

**Key Metrics:**
- Error count by type
- Error count by platform
- Error trends
- User impact (% of users affected)

**Visualization:**
- Error heatmap
- Time series of error rates
- Top error types
- Platform comparison

## Alert Configuration

### Critical Alerts (Immediate Action Required)
- Purchase success rate drops below 90% in 1-hour window
- Receipt verification failure rate exceeds 5% in 1-hour window
- Error rate increases by more than 200% from baseline
- Missing analytics events in expected funnels

### Warning Alerts (Monitor Closely)
- Purchase success rate between 90-95% in 3-hour window
- Receipt verification failure rate between 3-5% in 3-hour window
- Error rate increases by 100-200% from baseline
- Subscription conversion rate drops by more than 10%

## Implementation Plan

1. **Setup Phase (Before Deployment)**
   - Configure analytics provider to capture all IAP events
   - Create dashboard templates based on specifications above
   - Set up test data validation

2. **Validation Phase (During Internal Testing)**
   - Verify all events are being captured correctly
   - Calibrate baseline metrics
   - Test alert thresholds

3. **Deployment Phase**
   - Enable real-time monitoring
   - Configure alerts for production environment
   - Schedule regular reporting

4. **Optimization Phase (Post-Deployment)**
   - Refine dashboards based on actual data
   - Adjust alert thresholds as needed
   - Add additional metrics as required

## Dashboard Access

- Product team: View access to all dashboards
- Engineering team: Full access to all dashboards
- QA team: View access to all dashboards
- Executive team: View access to summary dashboard

## Reporting Schedule

- Daily reports during first week of deployment
- Weekly reports for first month
- Monthly reports thereafter
- On-demand reports for any critical incidents
