# Salary Management System - Quick Reference

## Access Point

**URL:** `http://localhost:4200/salary` (after navigation from sidebar)

**Sidebar Menu:** Look for "Salary Management" with wallet icon in the sidebar

## Features Overview

### 1. Salary Cycles Tab

Displays all salary cycles with the following data:

- Cycle ID
- Period
- Start Date
- End Date
- Total Amount
- Status

**Available Actions:**

- **Recalculate:** Re-compute salary calculations (blue button)
- **Hold:** Temporarily hold the cycle (yellow button)
- **Release:** Resume a held cycle (green button)
- **Force Payout:** Immediately force payment (red button - critical action)
- **Reverse:** Undo a payment (gray button - irreversible)

### 2. Agency Commissions Tab

Displays all agency commissions:

- Commission ID
- Agency Name
- Amount
- Date
- Status

**Available Actions:**

- **Unlock:** Unlock funds for specific transaction (teal button)

### 3. Dashboard Stats

Four key metrics displayed:

- **Total Cycles:** Total number of salary cycles
- **Active Cycles:** Currently active cycles
- **Total Commissions:** Total commission amount
- **Total Paid:** Total paid out amount

## Confirmation Dialogs

The following actions require confirmation before proceeding:

### Standard Confirmations:

- Recalculate Salary Cycle
- Hold Salary Cycle
- Release Salary Cycle
- Unlock Funds

### Critical Action Confirmations:

- **Force Payout:** Shows warning "This action is critical!"
- **Reverse Payment:** Shows warning "This action cannot be undone!"

## Data Refresh

- Data automatically loads on component initialization
- Can manually refresh by navigating away and back
- Service broadcasts refresh events for reactive updates

## Error Handling

All errors are displayed as toast notifications with:

- Error message from backend
- Fallback messages if backend message unavailable
- Auto-dismissing notifications

## API Integration

All operations use these backend endpoints:

### GET Endpoints:

- `/api/v1/admin/salary/salary-cycles` - List cycles
- `/api/v1/admin/salary/salary-cycles/stats` - Cycle statistics
- `/api/v1/admin/salary/agency-commissions` - List commissions
- `/api/v1/admin/salary/agency-commissions/stats` - Commission stats
- `/api/v1/admin/salary/wallet-lock-status/:userId` - Lock status

### POST Endpoints:

- `/api/v1/admin/salary/salary-cycles/:id/recalculate`
- `/api/v1/admin/salary/salary-cycles/:id/hold`
- `/api/v1/admin/salary/salary-cycles/:id/release`
- `/api/v1/admin/salary/salary-cycles/:id/force-payout`
- `/api/v1/admin/salary/salary-cycles/:id/reverse`
- `/api/v1/admin/salary/transactions/:id/unlock`
- `/api/v1/admin/salary/transactions/:id/relock`

## Status Badge Colors

- **Active:** Green background
- **Pending:** Yellow background
- **Completed:** Light blue background
- **Failed:** Red background
- **Hold:** Gray background

## Files Reference

| File                                              | Purpose                             |
| ------------------------------------------------- | ----------------------------------- |
| `src/app/services/salary.service.ts`              | API service with all salary methods |
| `src/app/components/salary/salary.component.ts`   | Main component logic                |
| `src/app/components/salary/salary.component.html` | Template structure                  |
| `src/app/components/salary/salary.component.scss` | Styling                             |
| `src/app/components/salary/salary.routes.ts`      | Route configuration                 |
| `src/app/utils/api-constants.ts`                  | API endpoint constants              |
| `src/app/navigation/sidebar/sidebar.routes.ts`    | Sidebar routes                      |
| `src/app/navigation/sidebar/sidebar.component.ts` | Sidebar menu items                  |

## Testing the Integration

1. **Start the app:**

   ```bash
   npm start
   ```

2. **Login** with master admin credentials

3. **Navigate** to Salary Management from sidebar

4. **Verify:**
   - Stats cards display correctly
   - Salary cycles table loads
   - Agency commissions tab works
   - Actions display confirmation dialogs
   - Notifications appear on success/error

## Browser Console

- Check console for any errors
- Service logs API calls
- Confirm network requests to backend

## Next: Country-Wise Admin Setup

When ready to add country-wise React admin, follow the same pattern:

1. Create salary service with similar methods
2. Create components for salary management
3. Add route to navigation
4. Implement with Redux/Saga pattern (as in existing React admin)
