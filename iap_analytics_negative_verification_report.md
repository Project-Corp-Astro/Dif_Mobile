## IAP Analytics Verification Report

### Summary

- Total events captured: 10
- Event types captured: 9/14

### Missing Events

- iap_products_fetch_success
- iap_purchase_success
- iap_restore_success
- iap_receipt_verification_success
- iap_subscription_status_changed

### Funnel Completeness

- Product Fetch Funnel: ❌ Incomplete
- Purchase Funnel: ❌ Incomplete
- Restore Funnel: ❌ Incomplete
- Receipt Verification Funnel: ❌ Incomplete

### Event Details

#### iap_products_fetch_start

- Count: 1
- Last triggered: 1749169634370
- Parameters: `{}`

#### iap_products_fetch_failure

- Count: 1
- Last triggered: 1749169634873
- Parameters: `{"error":"Network error","error_code":"E_NETWORK_ERROR"}`

#### iap_purchase_start

- Count: 2
- Last triggered: 1749169635877
- Parameters: `{"product_id":"com.corpastrp.premium.yearly"}`

#### iap_purchase_failure

- Count: 1
- Last triggered: 1749169635876
- Parameters: `{"product_id":"com.corpastrp.premium.yearly","error":"Payment declined","error_code":"E_PAYMENT_DECLINED"}`

#### iap_purchase_cancelled

- Count: 1
- Last triggered: 1749169636679
- Parameters: `{"product_id":"com.corpastrp.premium.yearly"}`

#### iap_restore_start

- Count: 1
- Last triggered: 1749169636680
- Parameters: `{}`

#### iap_restore_failure

- Count: 1
- Last triggered: 1749169637683
- Parameters: `{"error":"Network error","error_code":"E_NETWORK_ERROR"}`

#### iap_receipt_verification_start

- Count: 1
- Last triggered: 1749169637684
- Parameters: `{"transaction_id":"mock-transaction-789"}`

#### iap_receipt_verification_failure

- Count: 1
- Last triggered: 1749169639185
- Parameters: `{"transaction_id":"mock-transaction-789","product_id":"com.corpastrp.premium.monthly","error":"Invalid receipt","error_code":"E_INVALID_RECEIPT"}`

