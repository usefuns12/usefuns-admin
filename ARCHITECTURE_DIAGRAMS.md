# Salary Management System - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE (Angular)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    SIDEBAR NAVIGATION                         │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ Users | Shop | Gifts | Quantities | Management | ... │   │   │
│  │  │                   [Salary Management] ←────────────────┼─┼───│
│  │  │                   (wallet icon)                       │ │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │            SALARY COMPONENT (salary.component.ts)            │   │
│  │                                                              │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  STATS CARDS                                        │    │   │
│  │  │  [Total Cycles] [Active] [Commissions] [Paid]      │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                          ↓                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  TABS                                               │    │   │
│  │  │  [Salary Cycles]    [Agency Commissions]           │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │         ↓                          ↓                        │   │
│  │  ┌────────────────┐         ┌──────────────────┐           │   │
│  │  │ SALARY CYCLES  │         │ AGENCY COMMISSIONS         │   │
│  │  │ ┌──────────────┐          │ ┌────────────────┐        │   │
│  │  │ │ ID Period    │          │ │ ID Agency      │        │   │
│  │  │ │ Start End    │          │ │ Amount Date    │        │   │
│  │  │ │ Amount Status│          │ │ Status         │        │   │
│  │  │ │ Actions ✓    │          │ │ Actions ✓      │        │   │
│  │  │ └──────────────┘          │ └────────────────┘        │   │
│  │  └────────────────┘         └──────────────────┘           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         ACTION HANDLERS & CONFIRMATION DIALOGS               │   │
│  │                                                              │   │
│  │  When action clicked:                                       │   │
│  │  1. Show ConfirmDeleteComponent dialog                      │   │
│  │  2. User confirms action                                    │   │
│  │  3. Call service method                                     │   │
│  │  4. Show loading state                                      │   │
│  │  5. Refresh data on success                                 │   │
│  │  6. Show toast notification                                 │   │
│  │                                                              │   │
│  │  Actions:                                                   │   │
│  │  • Recalculate ────┐                                        │   │
│  │  • Hold ───────────┤                                        │   │
│  │  • Release ────────┤──→ Service.method() → HTTP             │   │
│  │  • Force Payout ───┤                                        │   │
│  │  • Reverse ────────┘                                        │   │
│  │  • Unlock                                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (salary.service.ts)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SalaryService (Injectable)                      │   │
│  │                                                              │   │
│  │  Salary Cycles Methods:                                     │   │
│  │  ├─ getSalaryCycles(page, limit, status)                   │   │
│  │  ├─ getSalaryCycleStats()                                  │   │
│  │  ├─ getSalaryCycleById(id)                                 │   │
│  │  ├─ recalculateSalaryCycle(id)                             │   │
│  │  ├─ holdSalaryCycle(id)                                    │   │
│  │  ├─ releaseSalaryCycle(id)                                 │   │
│  │  ├─ forcePayoutCycle(id)                                   │   │
│  │  └─ reversePayment(id)                                     │   │
│  │                                                              │   │
│  │  Commission Methods:                                        │   │
│  │  ├─ getAgencyCommissions(page, limit)                      │   │
│  │  ├─ getCommissionStats()                                   │   │
│  │  ├─ getAgencyCommissionById(id)                            │   │
│  │  └─ unlockFunds(id) / relockFunds(id)                      │   │
│  │                                                              │   │
│  │  Wallet Status:                                             │   │
│  │  └─ getWalletLockStatus(userId)                            │   │
│  │                                                              │   │
│  │  All methods use HttpClient with environment.baseUrl        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                ↓                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           API CONSTANTS (api-constants.ts)                   │   │
│  │                                                              │   │
│  │  ApiEndpoints.salary = {                                    │   │
│  │    GET_SALARY_CYCLES,                                       │   │
│  │    GET_SALARY_CYCLE_STATS,                                  │   │
│  │    GET_SALARY_CYCLE_BY_ID,                                  │   │
│  │    RECALCULATE_SALARY_CYCLE,                                │   │
│  │    HOLD_SALARY_CYCLE,                                       │   │
│  │    RELEASE_SALARY_CYCLE,                                    │   │
│  │    FORCE_PAYOUT_CYCLE,                                      │   │
│  │    REVERSE_PAYMENT,                                         │   │
│  │    GET_AGENCY_COMMISSIONS,                                  │   │
│  │    GET_COMMISSION_STATS,                                    │   │
│  │    GET_AGENCY_COMMISSION_BY_ID,                             │   │
│  │    UNLOCK_FUNDS,                                            │   │
│  │    RELOCK_FUNDS,                                            │   │
│  │    GET_WALLET_LOCK_STATUS                                   │   │
│  │  }                                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                ↓                                    │
│  Base URL: environment.baseUrl = 'https://api.usefuns.com'         │
│            (or localhost:5000 for development)                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP CLIENT (HttpClient)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  • GET /api/v1/admin/salary/salary-cycles              → Observable │
│  • POST /api/v1/admin/salary/salary-cycles/:id/action  → Observable │
│  • GET /api/v1/admin/salary/agency-commissions         → Observable │
│  • POST /api/v1/admin/salary/transactions/:id/action   → Observable │
│                                                                       │
│  With Authentication Headers:                                       │
│  • Authorization token from auth service                           │
│  • Content-Type: application/json                                  │
│  • Other standard headers                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND API ENDPOINTS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  GET /api/v1/admin/salary/salary-cycles                             │
│  │   ├─ Query: page, limit, status                                  │
│  │   └─ Response: { data: [...salary cycles] }                      │
│  │                                                                   │
│  GET /api/v1/admin/salary/salary-cycles/stats                       │
│  │   └─ Response: { data: { totalCycles, activeCycles } }           │
│  │                                                                   │
│  POST /api/v1/admin/salary/salary-cycles/:id/recalculate            │
│  POST /api/v1/admin/salary/salary-cycles/:id/hold                   │
│  POST /api/v1/admin/salary/salary-cycles/:id/release                │
│  POST /api/v1/admin/salary/salary-cycles/:id/force-payout           │
│  POST /api/v1/admin/salary/salary-cycles/:id/reverse                │
│  │   └─ Response: { message: "...", data: {...} }                   │
│  │                                                                   │
│  GET /api/v1/admin/salary/agency-commissions                        │
│  │   ├─ Query: page, limit                                          │
│  │   └─ Response: { data: [...commissions] }                        │
│  │                                                                   │
│  GET /api/v1/admin/salary/agency-commissions/stats                  │
│  │   └─ Response: { data: { totalCommissions, totalPaid } }         │
│  │                                                                   │
│  POST /api/v1/admin/salary/transactions/:id/unlock                  │
│  POST /api/v1/admin/salary/transactions/:id/relock                  │
│  │   └─ Response: { message: "...", data: {...} }                   │
│  │                                                                   │
│  GET /api/v1/admin/salary/wallet-lock-status/:userId                │
│      └─ Response: { data: { locked: true/false } }                  │
│                                                                       │
│  All endpoints require Master Admin role                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (Backend)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Collections/Tables:                                                 │
│  • salary_cycles  → Stores salary cycle data                        │
│  • commissions    → Stores commission records                       │
│  • transactions   → Stores transaction locks                        │
│  • wallet_locks   → Stores wallet lock status                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER INTERACTION
      ↓
┌─────────────────────────────────────────┐
│ User clicks action button               │
│ (Recalculate, Hold, Release, etc.)      │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Show Confirmation Dialog                │
│ ConfirmDeleteComponent                  │
└──────────────┬──────────────────────────┘
               ↓
       ┌───────────────────┐
       │  User Confirms?   │
       └───────┬───────────┘
               │
         ┌─────┴──────┐
         ↓            ↓
      NO (Close)   YES (Proceed)
         ↓            ↓
      Cancel      ┌──────────────────────────┐
                  │ Call Service Method      │
                  │ e.g., holdSalaryCycle() │
                  └────────────┬─────────────┘
                               ↓
                  ┌──────────────────────────┐
                  │ HttpClient.post()        │
                  │ POST to API endpoint     │
                  └────────────┬─────────────┘
                               ↓
                  ┌──────────────────────────┐
                  │ Backend Processes        │
                  │ Updates Database         │
                  └────────────┬─────────────┘
                               ↓
            ┌──────────────────────────────────┐
            │   Backend Response Received       │
            └──────┬───────────────────────────┘
                   │
            ┌──────┴──────────┐
            ↓                 ↓
      SUCCESS             ERROR
        ↓                   ↓
    ┌───────────┐    ┌────────────┐
    │ loadData()│    │ Show Error │
    │ Refresh   │    │ Toast      │
    │ Data      │    │ Notification
    │ ↓         │    │            │
    │ Show      │    └────────────┘
    │ Success   │
    │ Toast     │
    └───────────┘
```

## Component Hierarchy

```
SidebarComponent (Main Layout)
├── Navigation (Sidebar)
│   └── MenuItems
│       └── SalaryManagement Item
│           └── Route: /salary
│
└── RouterOutlet
    └── SalaryComponent (Lazy Loaded)
        ├── Stats Cards Section
        │   ├── Total Cycles Card
        │   ├── Active Cycles Card
        │   ├── Total Commissions Card
        │   └── Total Paid Card
        │
        ├── Tabs Section
        │   ├── Salary Cycles Tab
        │   │   ├── Table
        │   │   │   ├── Header Row
        │   │   │   └── Data Rows (with action buttons)
        │   │   ├── Empty State
        │   │   └── Loading State
        │   │
        │   └── Agency Commissions Tab
        │       ├── Table
        │       │   ├── Header Row
        │       │   └── Data Rows (with unlock button)
        │       ├── Empty State
        │       └── Loading State
        │
        └── Dialog Service Integration
            └── ConfirmDeleteComponent (Modal)
                ├── Title
                ├── Message
                ├── Cancel Button
                └── Confirm Button
```

## Data State Management

```
SalaryComponent State:
┌──────────────────────────────┐
│ activeTab: 'cycles'          │ ← Current active tab
├──────────────────────────────┤
│ salaryCycles: any[]          │ ← Array of salary cycles
│ agencyCommissions: any[]     │ ← Array of commissions
│ cycleStats: any             │ ← { totalCycles, activeCycles }
│ commissionStats: any        │ ← { totalCommissions, totalPaid }
│ isLoading: boolean          │ ← Loading state (true/false)
└──────────────────────────────┘
                ↓
        Service.subscribe()
                ↓
    Backend Response → Update State → Re-render UI
```

## Event Flow

```
Initialization (ngOnInit)
├── loadData()
│   ├── getSalaryCycles()
│   ├── getSalaryCycleStats()
│   ├── getAgencyCommissions()
│   └── getCommissionStats()
│
└── Subscribe to Service Refresh Events
    └── salaryService.salaryRefresh$

User Action
├── Click Action Button
├── Service Method Called
├── HTTP Request Sent
├── Backend Response Received
├── loadData() Called (Refresh)
└── Toast Notification Shown
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable service layer
✅ Lazy-loaded components
✅ Proper dependency injection
✅ Observable-based reactive patterns
✅ Scalable and maintainable code
