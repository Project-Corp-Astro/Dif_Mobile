# IAP Migration Pre-Cleanup Verification

Before running the cleanup script to remove deprecated files, complete this verification checklist to ensure the migration is fully functional and it's safe to proceed with cleanup.

## Verification Checklist

### Code Verification
- [ ] Confirm `useIAP.ts` is fully implemented and functional
- [ ] Verify `hooks/index.ts` correctly exports both `useIAP` and `useSubscription` (as an alias)
- [ ] Confirm all TypeScript errors are resolved
- [ ] Verify the app builds successfully without warnings related to IAP

### Functional Testing
- [ ] Complete all items in the `IAP_SANDBOX_TESTING_CHECKLIST.md`
- [ ] Verify product fetching works correctly on both iOS and Android
- [ ] Confirm purchases can be completed successfully
- [ ] Verify receipt verification with backend is working
- [ ] Test purchase restoration functionality
- [ ] Confirm subscription status is tracked correctly

### Integration Verification
- [ ] Run the find_subscription_usage.sh script to identify any components still using the old implementation
- [ ] Verify all identified components have been updated to use the new implementation
- [ ] Test all subscription-dependent features in the app

### Analytics Verification
- [x] Verify product fetch analytics events are firing correctly
- [x] Verify purchase flow analytics events are firing correctly
- [x] Verify restore flow analytics events are firing correctly
- [x] Verify receipt verification analytics events are firing correctly
- [x] Verify subscription status change analytics events are firing correctly
- [x] Check analytics dashboard to confirm events are being received correctly

#### Analytics Verification Details
- **Automated Verification**: All analytics events have been verified using the automated verification script (`scripts/run_iap_analytics_verification.js`)
- **Verification Reports**: Generated reports are available at:
  - Positive test cases: `iap_analytics_verification_report.md`
  - Negative test cases: `iap_analytics_negative_verification_report.md`
- **Event Coverage**: All expected IAP analytics events have been implemented and verified, including success and failure cases
- **Dashboard Configuration**: Updated dashboard configuration in `IAP_ANALYTICS_DASHBOARD.md`

### Production Readiness
- [ ] Deploy to a staging environment and test with real store sandbox accounts
- [ ] Monitor for any errors or issues for at least 24 hours
- [ ] Get sign-off from QA team on the migration
- [ ] Ensure monitoring is set up according to `IAP_ANALYTICS_TRACKING_PLAN.md`

## Backup Verification
- [ ] Verify backup directory exists: `./backup/hooks/`
- [ ] Confirm the following files are backed up (if they existed):
  - [ ] `useSubscription.ts`
  - [ ] `useSubscription.mock.ts`
  - [ ] `useSubscriptionMock.ts`

## Cleanup Execution Plan

Once all verification steps are complete:

1. Run the cleanup script:
   ```bash
   ./scripts/cleanup_iap_migration.sh
   ```

2. Verify the deprecated files have been removed:
   ```bash
   ls -la ./hooks/useSubscription*
   ```

3. Build and test the app again to confirm everything still works:
   ```bash
   npm run build
   ```

4. Commit the changes:
   ```bash
   git add .
   git commit -m "Complete IAP migration: remove deprecated files"
   ```

## Rollback Plan

If issues are discovered after cleanup:

1. Restore from backup:
   ```bash
   cp ./backup/hooks/useSubscription.ts ./hooks/
   cp ./backup/hooks/useSubscription.mock.ts ./hooks/ # if it existed
   cp ./backup/hooks/useSubscriptionMock.ts ./hooks/ # if it existed
   ```

2. Update `hooks/index.ts` to use the original implementation if needed
3. Build and test the app
4. Document the issues encountered and create a plan to address them
