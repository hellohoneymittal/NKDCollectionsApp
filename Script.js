const pcSubmitBtn = "pcSubmitBtn";
const mainPasswordTxtBox = "mainPasswordTxtBox";
let loginUserName = "";
document.addEventListener("DOMContentLoaded", async function () {
  const cacheResponse = await DB_GET(
    "GET_DEVOTEE_INFO",
    INDEX_DB.dbName,
    INDEX_DB.storeName,
  );

  if (cacheResponse) {
    populateDevoteeData(cacheResponse);
    SET_USER_NAME_ON_SCREEN(cacheResponse?.data?.devName?.toString().trim());
    SET_DIV_TITLE("collectionMasterContainer", "Collection Input Form");
  } else {
    SHOW_SPECIFIC_DIV("passwordContainer");
  }
});

async function pcSubmitBtnClick() {
  const passwordVal = GetControlValue(mainPasswordTxtBox)
    .toString()
    .toLowerCase()
    .trim();
  LOGIN_USER_FAC_NAME = "";
  if (!passwordVal) {
    SHOW_ERROR_POPUP("Please Enter Password");
    return;
  }

  const request = {
    apiType: "",
    password: passwordVal,
  };

  const response = await CALL_API_WITH_CACHE("GET_DEVOTEE_INFO", request);
  populateDevoteeData(response);
}

function populateDevoteeData(response) {
  if (response.status) {
    if (
      response?.data?.role == ROLE_CONSTANT.admin ||
      response?.data?.role == ROLE_CONSTANT.superAdmin
    ) {
      ShowPopup("adminRoleButton");
    }
    const devName = response?.data?.devName?.toString().trim();
    loginUserName = devName;
    SET_USER_NAME_ON_SCREEN(loginUserName);
    SET_DIV_TITLE("collectionMasterContainer", "Collection Input Form");
    localStorage.setItem(bheeshmUserNameLSKey, loginUserName);
    localStorage.setItem(
      bheeshmUserFacilitatorLSKey,
      response?.data?.facilitator?.toString(),
    );
    ShowPopup(CM_CONTANER);
    HidePopup(PASSWORD_CONTAINER);
    initializeCollctionMasterPage(loginUserName);
  }
}

function clearLocalStorageOnInitialLoad() {
  // Clear specific keys
  localStorage.removeItem(bheeshmUserNameLSKey);
  localStorage.removeItem(bheeshmUserFacilitatorLSKey);

  ShowPopup("passwordContainer");
  HidePopup("collectionMasterContainer");
  ClearTextBoxValue("mainPasswordTxtBox");
}

window.onload = function () {
  clearLocalStorageOnInitialLoad();
};

async function logoutClick() {
  await DB_CLEAR(INDEX_DB.dbName, INDEX_DB.storeName);
  clearLocalStorageOnInitialLoad();
  resetFormFields();
}
