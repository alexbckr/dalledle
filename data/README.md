# Frozen Archive Data

This app now runs without Postgres.

## Files
- `images.json`: all archived image rows (former `image` table)
- `stat_book.json`: global totals (former `stat_book` table)

## How to preserve your historical stats
1. Export your old Postgres `image` and `stat_book` rows to JSON.
2. Replace `data/images.json` and `data/stat_book.json` with those exports.
3. Keep all numeric fields (`plays`, `solves`, `unique_*`, `return_*`) so archive solve rates stay accurate.

The API increment routes are read-only no-ops, so the archive stays frozen.
