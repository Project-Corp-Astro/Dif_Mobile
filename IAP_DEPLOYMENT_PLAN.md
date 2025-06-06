# IAP Migration Deployment Plan

This document outlines the step-by-step plan for deploying the IAP migration from `expo-in-app-purchases` to `react-native-iap` to production.

## Pre-Deployment Checklist

- [ ] Complete all items in the `IAP_SANDBOX_TESTING_CHECKLIST.md`
- [ ] Complete all items in the `IAP_PRE_CLEANUP_VERIFICATION.md`
- [ ] Verify all analytics events are firing correctly using the `IAP_ANALYTICS_INTEGRATION.md` document
- [ ] Confirm analytics dashboard is properly configured to receive and display IAP events
- [ ] Verify backend receipt verification is working correctly with sandbox purchases
- [ ] Run a final code review of the `useIAP.ts` and `useIAPAnalytics.ts` implementations

## Deployment Strategy: Phased Rollout

### Phase 1: Internal Testing (1-2 days)

1. **Build and Deploy**
   - Create a production build with the new IAP implementation
   - Deploy to internal testing channel (TestFlight/Google Play Internal Testing)

2. **Internal Validation**
   - Have team members install and test the build
   - Complete real purchases using sandbox accounts
   - Verify receipt verification and subscription status updates

3. **Monitoring**
   - Monitor error reports and analytics
   - Address any issues before proceeding

### Phase 2: Limited Public Rollout (3-5 days)

1. **Deploy to 10% of Users**
   - Release to 10% of production users
   - Enable feature flag if available

2. **Monitoring Key Metrics**
   - Purchase success rate (target: >95%)
   - Receipt verification success rate (target: >98%)
   - Error rates (target: <2%)
   - Subscription conversion rate (should match or exceed previous implementation)

3. **Evaluation**
   - After 48 hours, evaluate metrics
   - If meeting targets, proceed to next phase
   - If issues detected, roll back and fix

### Phase 3: Full Rollout (1-2 days)

1. **Gradual Expansion**
   - Increase rollout to 50% of users
   - Monitor for 24 hours
   - If stable, expand to 100%

2. **Continued Monitoring**
   - Monitor all metrics for at least 7 days post-full deployment
   - Compare with baseline metrics from previous implementation

### Phase 4: Post-Deployment Cleanup (After 14 days of stability)

1. **Execute Cleanup Script**
   - Run `./scripts/cleanup_iap_migration.sh`
   - Verify deprecated files are removed
   - Build and test app again

2. **Documentation Update**
   - Update all relevant documentation to remove references to old implementation
   - Ensure developer documentation is current

## Rollback Plan

If critical issues are detected at any phase:

### Immediate Rollback Criteria

- Purchase success rate drops below 90%
- Receipt verification failures exceed 5%
- Critical user-facing errors reported

### Rollback Procedure

1. **Revert Code Changes**
   - Restore from backup if cleanup has been performed
   - Otherwise, revert to the previous implementation via source control

2. **Emergency Build**
   - Create emergency build with reverted changes
   - Deploy through expedited review if possible

3. **Communication**
   - Notify users of the issue if user-facing
   - Provide timeline for fix

## Monitoring Plan

### Real-time Monitoring

- Set up real-time dashboards for:
  - Purchase success/failure rates
  - Receipt verification success/failure rates
  - Error rates by type and platform
  - Analytics event funnel completion rates

### Analytics Event Monitoring

- Monitor the following analytics event funnels:
  - Product fetch funnel: start → success/failure
  - Purchase funnel: start → processing → success/failure/cancellation
  - Restore funnel: start → success/failure
  - Receipt verification funnel: start → success/failure
  - Subscription status changes

- Track key conversion metrics:
  - Product fetch success rate (target: >98%)
  - Purchase completion rate (target: >90% of started purchases)
  - Receipt verification success rate (target: >95%)
  - Restore success rate (target: >95%)

### Alerts

- Configure alerts for:
  - Purchase success rate < 90% in 1-hour window
  - Receipt verification failures > 5% in 1-hour window
  - Spike in error rates (>200% of baseline)
  - Missing analytics events in expected funnels
  - Significant drop in any conversion metric (>10% change)

### Regular Reporting

- Daily reports for first week including:
  - IAP funnel conversion rates
  - Analytics event coverage (% of expected events received)
  - Error rates by category and platform
  - Revenue impact comparison with previous implementation

- Weekly reports thereafter including:
  - Trend analysis of all IAP analytics events
  - Funnel drop-off points identification
  - Platform-specific performance metrics
  - User segment analysis (new vs. returning subscribers)

- Monthly comparison with previous implementation:
  - Comprehensive analytics dashboard review
  - Revenue impact analysis
  - User retention metrics
  - Subscription lifecycle events (renewals, cancellations, upgrades)

## Success Criteria

The migration will be considered successful when:

1. All phases of deployment are complete
2. Metrics are stable for 14 consecutive days
3. Purchase success rate meets or exceeds previous implementation
4. Analytics event funnels show complete coverage (>95% of expected events)
5. All analytics dashboards are functioning correctly
6. No critical analytics gaps identified in user journey
7. Subscription conversion and retention metrics meet or exceed previous implementation
8. No critical bugs reported
9. Cleanup script has been executed successfully

## Timeline

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Internal Testing | 1-2 days | TBD | TBD |
| Limited Public Rollout | 3-5 days | TBD | TBD |
| Full Rollout | 1-2 days | TBD | TBD |
| Post-Deployment Cleanup | 1 day | TBD | TBD |

Total deployment time: 6-10 days
