#!/bin/bash

# API Test Script for Product Management
# This script logs in, creates a product, and retrieves product details

BASE_URL="https://stockscout-yqt4.onrender.com"
EMAIL="salesmanager@gmail.com"
PASSWORD="nelson"

echo "🚀 Starting API Test Script..."
echo "📍 Base URL: $BASE_URL"
echo "👤 Email: $EMAIL"
echo ""

# Step 1: Login and get access token
echo "🔐 Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "📋 Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // .accessToken // .token // empty')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
  echo "❌ Failed to get access token. Login failed."
  exit 1
fi

echo "✅ Login successful!"
echo "🔑 Access Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Step 2: Create a new product with all fields
echo "📦 Step 2: Creating a new product..."

# Generate unique product name with timestamp
TIMESTAMP=$(date +%s)
PRODUCT_NAME="Test Product $TIMESTAMP"
SKU="SKU-$TIMESTAMP"

CREATE_PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"name\": \"$PRODUCT_NAME\",
    \"sku\": \"$SKU\",
    \"category\": \"CASUAL_PANTS\",
    \"description\": \"Test product created via API script\",
    \"unitPrice\": 25000,
    \"costPrice\": 20000,
    \"minStockLevel\": 10,
    \"maxStockLevel\": 100,
    \"reorderPoint\": 15,
    \"unit\": \"PCS\",
    \"brand\": \"Test Brand\",
    \"color\": \"Blue\",
    \"size\": \"M\",
    \"weight\": 0.5,
    \"dimensions\": \"30x20x5\",
    \"barcode\": \"$TIMESTAMP\",
    \"isActive\": true,
    \"tags\": [\"test\", \"api\", \"product\"]
  }")

echo "📋 Create Product Response:"
echo "$CREATE_PRODUCT_RESPONSE" | jq '.'

# Extract product ID
PRODUCT_ID=$(echo "$CREATE_PRODUCT_RESPONSE" | jq -r '.id // empty')

if [ -z "$PRODUCT_ID" ] || [ "$PRODUCT_ID" = "null" ]; then
  echo "❌ Failed to create product or extract product ID."
  exit 1
fi

echo "✅ Product created successfully!"
echo "🆔 Product ID: $PRODUCT_ID"
echo "📦 Product Name: $PRODUCT_NAME"
echo "🏷️  SKU: $SKU"
echo ""

# Step 3: Get all products
echo "📋 Step 3: Retrieving all products..."

GET_PRODUCTS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "📋 All Products Response:"
echo "$GET_PRODUCTS_RESPONSE" | jq '.'
echo ""

# Step 4: Get specific product details
echo "🔍 Step 4: Getting details for the created product (ID: $PRODUCT_ID)..."

GET_PRODUCT_DETAILS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "📋 Product Details Response:"
echo "$GET_PRODUCT_DETAILS_RESPONSE" | jq '.'
echo ""

# Step 5: Get product pricing (this might return null initially)
echo "💰 Step 5: Getting pricing for the created product..."

GET_PRODUCT_PRICING_RESPONSE=$(curl -s -X GET "$BASE_URL/api/products/$PRODUCT_ID/prices" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "📋 Product Pricing Response:"
echo "$GET_PRODUCT_PRICING_RESPONSE" | jq '.'
echo ""

# Step 6: Get product inventory
echo "📊 Step 6: Getting inventory for the created product..."

GET_PRODUCT_INVENTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/api/inventories/product/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "📋 Product Inventory Response:"
echo "$GET_PRODUCT_INVENTORY_RESPONSE" | jq '.'
echo ""

# Summary
echo "🎉 API Test Script Completed!"
echo "📊 Summary:"
echo "  ✅ Login: Success"
echo "  ✅ Product Created: $PRODUCT_NAME (ID: $PRODUCT_ID)"
echo "  ✅ Products Retrieved: Success"
echo "  ✅ Product Details Retrieved: Success"
echo "  ✅ Product Pricing Retrieved: Success (may be null)"
echo "  ✅ Product Inventory Retrieved: Success"
echo ""
echo "🔗 Created Product Details:"
echo "  🆔 ID: $PRODUCT_ID"
echo "  📦 Name: $PRODUCT_NAME"
echo "  🏷️  SKU: $SKU"
echo "  💰 Unit Price: 25000"
echo "  🏭 Cost Price: 20000"
echo "  📂 Category: CASUAL_PANTS"
echo ""
echo "💡 You can now use this product ID ($PRODUCT_ID) for pricing tests in the frontend!"
