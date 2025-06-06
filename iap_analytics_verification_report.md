## IAP Analytics Verification Report

### Summary

- Total events captured: 9
- Event types captured: 9/14

### Missing Events

- iap_products_fetch_failure
- iap_purchase_failure
- iap_purchase_cancelled
- iap_restore_failure
- iap_receipt_verification_failure

### Funnel Completeness

- Product Fetch Funnel: ✅ Complete
- Purchase Funnel: ✅ Complete
- Restore Funnel: ✅ Complete
- Receipt Verification Funnel: ✅ Complete

### Event Details

#### iap_products_fetch_start

- Count: 1
- Last triggered: 1749169629340
- Parameters: `{}`

#### iap_products_fetch_success

- Count: 1
- Last triggered: 1749169629848
- Parameters: `{"product_count":2,"products":["com.corpastrp.premium.monthly","com.corpastrp.premium.yearly"]}`

#### iap_purchase_start

- Count: 1
- Last triggered: 1749169629849
- Parameters: `{"product_id":"com.corpastrp.premium.monthly"}`

#### iap_purchase_success

- Count: 1
- Last triggered: 1749169630851
- Parameters: `{"product_id":"com.corpastrp.premium.monthly","transaction_id":"mock-transaction-123","purchase_time":1749169630850,"price":"9.99","currency":"USD"}`

#### iap_restore_start

- Count: 1
- Last triggered: 1749169632359
- Parameters: `{}`

#### iap_restore_success

- Count: 1
- Last triggered: 1749169633362
- Parameters: `{"restored_purchases_count":1,"product_ids":["com.corpastrp.premium.monthly"]}`

#### iap_receipt_verification_start

- Count: 1
- Last triggered: 1749169630855
- Parameters: `{"transaction_id":"mock-transaction-123"}`

#### iap_receipt_verification_success

- Count: 1
- Last triggered: 1749169632358
- Parameters: `{"transaction_id":"mock-transaction-123","product_id":"com.corpastrp.premium.monthly"}`

#### iap_subscription_status_changed

- Count: 1
- Last triggered: 1749169633363
- Parameters: `{"product_id":"com.corpastrp.premium.monthly","previous_status":"ACTIVE","new_status":"EXPIRED","remaining_time_days":0}`

