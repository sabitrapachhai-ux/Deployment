# Database schema

## Users
`name`, `email` unique, `passwordHash`, `role`, timestamps.

## Repairs
Unique `trackingCode`; customer and device fields; `repairStatus`; derived `isRepaired`; costs and dates; `images`; private `internalNotes`; timestamps.

Indexes: unique tracking code/email/SKU; repair status and device type.

## InventoryItem
Name, category, brand, compatibility, unique SKU, price, quantity, low stock threshold, image, description, published flag, timestamps. `stockStatus` is a virtual: 0 is out of stock, quantity below/equal to threshold is low stock, otherwise in stock.

## Other content
Service, Certificate, Experience, Appreciation, and Message models include timestamps. Content uses `order` fields where specified.
