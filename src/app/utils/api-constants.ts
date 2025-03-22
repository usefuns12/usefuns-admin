import { environment } from '../../environments/environment';
import { VersionConstant } from './version-constants';

export class ApiEndpoints  {
  public static auth = {
    LOGIN: VersionConstant.v1 + '/admin/masterLogin',
  };

  public static users = {
    GET_USERS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_USER_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_USER: VersionConstant.v1 + '/admin/user/update',
    SEARCH_USER: VersionConstant.v1 + '/user/search',
    GET_GIFTS: VersionConstant.v1 + '/user/getGifts'
  };

  public static rooms = {
    GET_ROOMS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_ROOM_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_ROOM: VersionConstant.v1 + '/room/update'
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

  public static carousel = {
    GET_CAROUSELS: VersionConstant.v1 + '/carousel/getCarousels',
    ADD_CAROUSEL: VersionConstant.v1 + '/carousel/add',
    UPDATE_CAROUSEL: VersionConstant.v1 + '/carousel/update',
    DELETE_CAROUSEL: VersionConstant.v1 + '/carousel/delete',
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
    GET_VERIFICATION_REPORT: VersionConstant.v1 + '/admin/getVerificationReport'
  }

  public static operator = {
    GET_OPERATORS: VersionConstant.v1 + '/admin/getOperators',
    DELETE_OPERATOR: VersionConstant.v1 + '/admin/deleteOperator'
  }
}
