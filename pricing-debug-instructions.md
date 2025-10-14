# 🔍 Pricing API Debug Instructions

## Issue: API returning null for factory and distributor prices

Based on your database data, the issue is likely a **tenant ID mismatch**.

### Your Database Data:
```sql
-- Price list items for product 2
SELECT * FROM price_list_items WHERE product_id = 2;
 id | base_price | price_list | product_id | tenant_id 
----+------------+------------+------------+-----------
  1 |      10000 |          6 |          2 |         3
  2 |      15000 |          7 |          2 |         3

-- Price lists
SELECT * FROM price_lists WHERE id IN (6, 7);
 id | level       | name                | tenant_id 
----+-------------+---------------------+-----------
  6 | FACTORY     | factory price may   |          
  7 | DISTRIBUTOR | distributor price may|          
```

## 🔧 Debug Steps:

### 1. Check Current User's Tenant ID
Open browser console and run:
```javascript
// Check what tenant ID the current user has
fetch('/api/users/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log('Current user tenant ID:', data.tenantId));
```

### 2. Check API Response
```javascript
// Test the pricing API directly
fetch('/api/products/2/prices', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log('Pricing API response:', data));
```

### 3. Check Price Lists
```javascript
// Check all price lists
fetch('/api/pricelists', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log('All price lists:', data));
```

## 🎯 Likely Solutions:

### Solution 1: Tenant ID Mismatch
If your current user has `tenantId !== 3`, you need to either:
- Update the price list items to use the correct tenant ID
- Or create new price lists for the correct tenant

### Solution 2: Missing Tenant ID in Price Lists
The price lists (id 6, 7) have empty `tenant_id`. Update them:
```sql
UPDATE price_lists SET tenant_id = 3 WHERE id IN (6, 7);
```

### Solution 3: Backend Query Issue
The backend might not be joining the tables correctly. Check if the API query includes:
- Proper tenant filtering
- Correct joins between products, price_lists, and price_list_items

## 🧪 Test Script
Run this in browser console to test everything:

```javascript
async function debugPricing() {
  try {
    // Get user info
    const user = await fetch('/api/users/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
    
    console.log('👤 User:', user);
    console.log('🏢 Tenant ID:', user.tenantId);
    
    // Test pricing API
    const pricing = await fetch('/api/products/2/prices', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
    
    console.log('💰 Pricing:', pricing);
    
    // Check price lists
    const priceLists = await fetch('/api/pricelists', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
    
    console.log('📋 Price Lists:', priceLists);
    
    // Check price list items
    const priceListItems = await fetch('/api/pricelistitems', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
    
    console.log('📊 Price List Items:', priceListItems);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPricing();
```

## 🎯 Expected Results:
- User should have `tenantId: 3` (matching your database)
- Pricing API should return factory and distributor prices
- If not, update the database records to match the user's tenant ID
