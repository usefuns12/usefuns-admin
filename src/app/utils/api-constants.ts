import { environment } from '../../environments/environment';
import { VersionConstant } from './version-constants';

export class ApiEndpoints  {
  public static auth = {
    LOGIN: VersionConstant.v1 + '/admin/masterLogin',
  };

  public static users = {
    GET_USERS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_USER_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_USER: VersionConstant.v1 + '/admin/user/update'
  };

  public static rooms = {
    GET_ROOMS: VersionConstant.v1 + '/user/getAll/limitedData',
    GET_ROOM_DETAILS: VersionConstant.v1 + '/user/getById',
    UPDATE_ROOM: VersionConstant.v1 + '/room/update'
  };

  public static dashboard = {
    GET_DASHBOARD: VersionConstant.v1 + '/admin/getDashboardData',
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
