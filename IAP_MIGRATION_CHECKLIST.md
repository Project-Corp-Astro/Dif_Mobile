# In-App Purchase Migration Checklist

## Setup Phase

- [ ] Install `react-native-iap` dependency
- [ ] Remove `expo-in-app-purchases` dependency
- [ ] Update native iOS and Android configurations if needed

## Implementation Phase

- [ ] Create `useIAP.ts` hook with the same interface as `useSubscription.ts`
- [ ] Implement connection to store
- [ ] Implement product fetching
- [ ] Implement purchase handling
- [ ] Implement purchase restoration
- [ ] Implement subscription status tracking
- [ ] Update type definitions

## Testing Phase

- [ ] Test product fetching on iOS
- [ ] Test product fetching on Android
- [ ] Test purchase flow on iOS
- [ ] Test purchase flow on Android
- [ ] Test purchase restoration on iOS
- [ ] Test purchase restoration on Android
- [ ] Test subscription status tracking

## Integration Phase

- [ ] Replace imports of `useSubscription` with `useIAP`
- [ ] Update any components using the hook
- [ ] Remove old implementation

## Deployment Phase

- [ ] Final testing on iOS
- [ ] Final testing on Android
- [ ] Update documentation
- [ ] Release to app stores
