import { VersionConstant } from './version-constants';

export class ApiEndpoints {
  public static auth = {
    LOGIN: VersionConstant.v1 + '/admin/masterLogin',
  };

  public static users = {
    GET_USERS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_UNASSIGNED_USERS: VersionConstant.v1 + '/user/getUnassignedUsers',
    GET_USER_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_USER: VersionConstant.v1 + '/admin/user/update',
    SEARCH_USER: VersionConstant.v1 + '/user/search',
    GET_GIFTS: VersionConstant.v1 + '/user/getGifts',
    SHOP_ITEM: VersionConstant.v1 + '/user/shop',
    ASSIST_ITEMS: VersionConstant.v1 + '/user/assistItems',
    REMOVE_SHOP_ITEM: VersionConstant.v1 + '/user/removeItem',
    BAN_DEVICE: VersionConstant.v1 + '/user/banDevice',
    ASSIST_SPECIAL_ID_ITEMS: VersionConstant.v1 + '/user/assistSpecialIdItems',
    TOGGLE_MYSTERY_MEN: VersionConstant.v1 + '/user/toggle-mystery-men',
  };

  public static rooms = {
    GET_ROOMS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_ROOM_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_ROOM: VersionConstant.v1 + '/room/update',
    GET_COUNTRY_ADMIN_ROOMS: VersionConstant.v1 + '/room/country-admin-rooms',
    CONVERT_CUSTOMER_SERVICE_ROOM:
      VersionConstant.v1 + '/room/convert-customer-service',
  };

  public static shop = {
    GET_ITEMS: VersionConstant.v1 + '/shop/getItems',
    ADD_ITEM: VersionConstant.v1 + '/shop/addItem',
    UPDATE_ITEM: VersionConstant.v1 + '/shop/updateItem',
    DELETE_ITEM: VersionConstant.v1 + '/shop/deleteItem',
  };

  public static gift = {
    GET_CATEGORIES: VersionConstant.v1 + '/gift/getCategories',
    ADD_CATEGORY: VersionConstant.v1 + '/gift/addCategory',
    UPDATE_CATEGORY: VersionConstant.v1 + '/gift/updateCategory',
    DELETE_CATEGORY: VersionConstant.v1 + '/gift/deleteCategory',
    GET_GIFTS: VersionConstant.v1 + '/gift/getGifts',
    ADD_GIFT: VersionConstant.v1 + '/gift/addGift',
    UPDATE_GIFT: VersionConstant.v1 + '/gift/updateGift',
    DELETE_GIFT: VersionConstant.v1 + '/gift/deleteGift',
  };

  public static quantity = {
    GET_ALL: VersionConstant.v1 + '/quantity/getQuantities',
    ADD: VersionConstant.v1 + '/quantity/addQuantity',
    UPDATE: VersionConstant.v1 + '/quantity/updateQuantity',
    DELETE: VersionConstant.v1 + '/quantity/deleteQuantity',
  };

  public static carousel = {
    GET_CAROUSELS: VersionConstant.v1 + '/carousel/getCarousels',
    ADD_CAROUSEL: VersionConstant.v1 + '/carousel/add',
    UPDATE_CAROUSEL: VersionConstant.v1 + '/carousel/update',
    DELETE_CAROUSEL: VersionConstant.v1 + '/carousel/delete',
  };

  public static apiKey = {
    GET_APIKEYS: VersionConstant.v1 + '/apiConfig/getApiKeys',
    ADD_APIKEY: VersionConstant.v1 + '/apiConfig/add',
    UPDATE_APIKEY: VersionConstant.v1 + '/apiConfig/update',
    DELETE_APIKEY: VersionConstant.v1 + '/apiConfig/delete',
  };

  public static treasurebox = {
    GET_LEVELS: VersionConstant.v1 + '/treasurebox/levels',
    CREATE_LEVEL: VersionConstant.v1 + '/treasurebox/level',
    UPDATE_LEVEL: VersionConstant.v1 + '/treasurebox/level',
  };

  public static csv = {
    UPLOAD_CSV: VersionConstant.v1 + '/admin/uploadCsv',
  };

  public static password = {
    CREATE_PASS: VersionConstant.v1 + '/admin/addDevice',
  };

  public static report = {
    GET_CSR: VersionConstant.v1 + '/admin/getCSR',
    GET_REPORT: VersionConstant.v1 + '/admin/downloadReport',
    GET_REPORTSUMM_SIZE: VersionConstant.v1 + '/admin/getReportSummarySize',
    GET_REPORTSUMM: VersionConstant.v1 + '/admin/downloadSummary',
    GET_VERIFICATION_REPORT:
      VersionConstant.v1 + '/admin/getVerificationReport',
  };

  public static operator = {
    GET_OPERATORS: VersionConstant.v1 + '/admin/getOperators',
    DELETE_OPERATOR: VersionConstant.v1 + '/admin/deleteOperator',
  };

  public static countryManagers = {
    GET_COUNTRY_MANAGERS:
      VersionConstant.v1 + '/users/get-all?role=CountryManager',
    ADD_COUNTRY_MANAGER: VersionConstant.v1 + '/users/create',
    UPDATE_COUNTRY_MANAGER: VersionConstant.v1 + '/users',
    DELETE_COUNTRY_MANAGER: VersionConstant.v1 + '/users',
  };

  public static countryAdmins = {
    GET_COUNTRY_ADMINS: VersionConstant.v1 + '/users/get-all?role=CountryAdmin',
    GET_COUNTRY_ADMINS_BY_MANAGER:
      VersionConstant.v1 + '/users/get-country-admins',
    ADD_COUNTRY_ADMIN: VersionConstant.v1 + '/users/create',
    UPDATE_COUNTRY_ADMIN: VersionConstant.v1 + '/users',
    DELETE_COUNTRY_ADMIN: VersionConstant.v1 + '/users',
  };

  public static admin = {
    GET_ADMINS: VersionConstant.v1 + '/users/get-all?role=Admin',
    GET_ADMIN_BY_COUNTRY_ADMIN:
      VersionConstant.v1 + '/users/get-admins-by-country-admin',
    ADD_ADMIN: VersionConstant.v1 + '/users/create',
    UPDATE_ADMIN: VersionConstant.v1 + '/users',
    DELETE_ADMIN: VersionConstant.v1 + '/users',
  };

  public static subAdmin = {
    GET_SUBADMINS: VersionConstant.v1 + '/users/get-all?role=SubAdmin',
    ADD_SUBADMIN: VersionConstant.v1 + '/users/create',
    UPDATE_SUBADMIN: VersionConstant.v1 + '/users',
    DELETE_SUBADMIN: VersionConstant.v1 + '/users',
  };

  public static agency = {
    GET_AGENCIES: VersionConstant.v1 + '/agencies',
    ADD_AGENCY: VersionConstant.v1 + '/agencies/create',
    UPDATE_AGENCY: VersionConstant.v1 + '/agencies',
    DELETE_AGENCY: VersionConstant.v1 + '/agencies',
  };

  public static host = {
    GET_HOSTS: VersionConstant.v1 + '/hosts',
    ADD_HOST: VersionConstant.v1 + '/hosts/create',
    UPDATE_HOST: VersionConstant.v1 + '/hosts',
    DELETE_HOST: VersionConstant.v1 + '/hosts',
  };

  public static salary = {
    GET_SALARY_CYCLES: VersionConstant.v1 + '/admin/salary/salary-cycles',
    GET_SALARY_CYCLE_STATS:
      VersionConstant.v1 + '/admin/salary/salary-cycles/stats',
    GET_SALARY_CYCLE_BY_ID:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id',
    RECALCULATE_SALARY_CYCLE:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id/recalculate',
    HOLD_SALARY_CYCLE:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id/hold',
    RELEASE_SALARY_CYCLE:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id/release',
    FORCE_PAYOUT_SALARY_CYCLE:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id/force-payout',
    REVERSE_SALARY_PAYMENT:
      VersionConstant.v1 + '/admin/salary/salary-cycles/:id/reverse',
    GET_AGENCY_COMMISSIONS:
      VersionConstant.v1 + '/admin/salary/agency-commissions',
    GET_AGENCY_COMMISSION_STATS:
      VersionConstant.v1 + '/admin/salary/agency-commissions/stats',
    GET_AGENCY_COMMISSION_BY_ID:
      VersionConstant.v1 + '/admin/salary/agency-commissions/:id',
    UNLOCK_FUNDS: VersionConstant.v1 + '/admin/salary/transactions/:id/unlock',
    RELOCK_FUNDS: VersionConstant.v1 + '/admin/salary/transactions/:id/relock',
    GET_WALLET_LOCK_STATUS:
      VersionConstant.v1 + '/admin/salary/wallet-lock-status/:userId',
  };

  public static kpi = {
    GET_DASHBOARD_SUMMARY: VersionConstant.v1 + '/admin/kpi/dashboard',
    GET_SYSTEM_HEALTH: VersionConstant.v1 + '/admin/kpi/system-health',
    GET_WALLET_HEALTH: VersionConstant.v1 + '/admin/kpi/wallet-health',
    GET_SALARY_CYCLE_HEALTH:
      VersionConstant.v1 + '/admin/kpi/salary-cycle-health',
    GET_GIFT_ANOMALIES: VersionConstant.v1 + '/admin/kpi/gift-anomalies',
  };

  public static policy = {
    GET_ALL_POLICIES: VersionConstant.v1 + '/admin/policies',
    CREATE_HOST_SALARY_POLICY: VersionConstant.v1 + '/admin/policies/salary',
    UPDATE_HOST_SALARY_POLICY:
      VersionConstant.v1 + '/admin/policies/salary/:id',
    DELETE_SALARY_POLICY: VersionConstant.v1 + '/admin/policies/salary/:id',
    CREATE_COMMISSION_POLICY: VersionConstant.v1 + '/admin/policies/commission',
    UPDATE_COMMISSION_POLICY:
      VersionConstant.v1 + '/admin/policies/commission/:id',
    PROCESS_SALARY_CYCLES:
      VersionConstant.v1 + '/admin/policies/salary/process-cycles',
    PAY_ALL_SALARIES: VersionConstant.v1 + '/admin/policies/salary/pay-all',
    CALCULATE_COMMISSIONS:
      VersionConstant.v1 + '/admin/policies/commission/calculate',
    PAY_ALL_COMMISSIONS:
      VersionConstant.v1 + '/admin/policies/commission/pay-all',
    GET_SALARY_STATS: VersionConstant.v1 + '/admin/policies/salary/stats',
    GET_COMMISSION_STATS:
      VersionConstant.v1 + '/admin/policies/commission/stats',
  };

  public static fraud = {
    LIST_FRAUD_ACTIONS: VersionConstant.v1 + '/admin/fraud/actions',
    GET_FRAUD_ACTION: VersionConstant.v1 + '/admin/fraud/actions/:id',
    GET_TARGET_FRAUD_ACTIONS:
      VersionConstant.v1 + '/admin/fraud/target/:targetType/:targetRef',
    GET_FRAUD_STATS: VersionConstant.v1 + '/admin/fraud/stats',
    CREATE_FRAUD_ACTION: VersionConstant.v1 + '/admin/fraud/actions',
    RELEASE_FRAUD_ACTION:
      VersionConstant.v1 + '/admin/fraud/actions/:id/release',
    EXTEND_FRAUD_ACTION: VersionConstant.v1 + '/admin/fraud/actions/:id/extend',
    CONVERT_TO_PERMANENT:
      VersionConstant.v1 + '/admin/fraud/actions/:id/convert-permanent',
  };

  public static dispute = {
    LIST_DISPUTES: VersionConstant.v1 + '/admin/disputes',
    GET_DISPUTE: VersionConstant.v1 + '/admin/disputes/:id',
    RAISE_DISPUTE: VersionConstant.v1 + '/disputes',
    GET_MY_DISPUTES: VersionConstant.v1 + '/disputes/my',
    REVIEW_DISPUTE: VersionConstant.v1 + '/admin/disputes/:id/review',
    SIMULATE_RECALCULATION:
      VersionConstant.v1 + '/admin/disputes/:id/recalculate',
    RESOLVE_DISPUTE: VersionConstant.v1 + '/admin/disputes/:id/resolution',
    REJECT_DISPUTE: VersionConstant.v1 + '/admin/disputes/:id/reject',
    APPROVE_ADJUSTMENT: VersionConstant.v1 + '/admin/disputes/:id/approve',
  };

  public static alert = {
    LIST_ALERTS: VersionConstant.v1 + '/admin/alerts',
    GET_ALERT: VersionConstant.v1 + '/admin/alerts/:id',
    GET_ALERT_STATS: VersionConstant.v1 + '/admin/alerts/stats',
    GET_ENTITY_ALERTS:
      VersionConstant.v1 + '/admin/alerts/entity/:referenceType/:referenceId',
    ACKNOWLEDGE_ALERT: VersionConstant.v1 + '/admin/alerts/:id/acknowledge',
    RESOLVE_ALERT: VersionConstant.v1 + '/admin/alerts/:id/resolve',
    ESCALATE_ALERT: VersionConstant.v1 + '/admin/alerts/:id/escalate',
    BULK_ACKNOWLEDGE: VersionConstant.v1 + '/admin/alerts/bulk/acknowledge',
    BULK_RESOLVE: VersionConstant.v1 + '/admin/alerts/bulk/resolve',
  };
}
