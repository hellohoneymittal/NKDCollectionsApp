//api constant

const CHECK_PASSWORD_API =
  "https://script.google.com/macros/s/AKfycbw6xp8f4KopdloxGYNGQYWWEU6E_eM_-Zd6CrILLjBdUjPRF0o3LQow624rtsBOEhK9-w/exec?password=";
const GET_COLLECTION_MASTER_DATA =
  "https://script.google.com/macros/s/AKfycbx_pga1XERDEQSFqw9p-0JeFFzxvNi_sBVN4yPvurG3m7jrOY1mfDeWZ4t2NNEOhOG9ug/exec?devName=";
const APPLICATION_URL =
  "https://script.google.com/macros/s/AKfycbx_pga1XERDEQSFqw9p-0JeFFzxvNi_sBVN4yPvurG3m7jrOY1mfDeWZ4t2NNEOhOG9ug/exec";

const API_TYPE_CONSTANT = {
  getSewaKartaNameList: "GET_SEWAKARTA_NAME_LIST", // IT IS FOR FILL PENDING DONORS
  getPendingDonorList: "GET_PENDING_DONOR_LIST",
  getAllDevoteesList: "GET_ALL_DEVOTEES_LIST",
  saveRecurringCollection: "SAVE_RECURRING_COLLECTION",
};
const DATE_FORMAT_CONSTANT = {
  grid: "DD MMM YYYY",
  database: "yyyy-MM-dd",
  gridWithDate: "DD MMM YYYY hh:mm A",
};

const PASSWORD_ERROR_STR = "Please enter a correct password";
const DATE_UTC = new Date().toISOString();

const CONTROL_TYPE_CONSTAINT = {
  input: "input",
  button: "button",
  checkbox: "checkbox",
};

//page constant
const PASSWORD_CONTAINER = "passwordContainer";
const CM_CONTANER = "collectionMasterContainer";
const DM_CONTAINER = "donorMasterContainer";

const bheeshmUserNameLSKey = "bheeshmUserName";
const bheeshmUserFacilitatorLSKey = "bheeshmUserFacilitator";

const POPUP_CONSTANT = {
  error: "errorPopup",
  success: "successPopup",
};

const ICON_CONSTANT = {
  downloadIcon: "https://cdn-thumbs.imagevenue.com/85/09/8b/ME196HF8_t.png",
};

const ROLE_CONSTANT = {
  admin: "Admin",
  superAdmin: "Super Admin",
};

const ERROR_MESSAGE_CONSTANT = {
  general: "Something Went Wrong",
};

const ExcelDate = getFormattedDateForDownload();

const INDEX_DB = {
  dbName: "NKDAppDB",
  storeName: "NKDCollAppStore",

  keys: {
    LOGIN: "hostelAppLogin",
    TASK_LIST: "taskListData",
    TASK_MASTER: "taskMasterData",
    USER_PROFILE: "userProfile",
    SETTINGS: "settings",
    APP_VERSION: "appVersion",
  },
};
