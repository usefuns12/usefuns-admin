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
  };

  public static rooms = {
    GET_ROOMS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_ROOM_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_ROOM: VersionConstant.v1 + '/room/update',
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
}
