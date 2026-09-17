const pcSubmitBtn = "pcSubmitBtn";
const mainPasswordTxtBox = "mainPasswordTxtBox";

document.addEventListener("DOMContentLoaded", async function () {
  const cacheResponse = await DB_GET(
    "GET_DEVOTEE_INFO",
    INDEX_DB.dbName,
    INDEX_DB.storeName,
  );

  if (cacheResponse) {
    populateDevoteeData(cacheResponse);
    // selectedUser = cacheResponse?.data;
    // selectedDevoteeName = cacheResponse?.data?.name;
    // renderMenus(cacheResponse?.data?.role);
  } else {
    SHOW_SPECIFIC_DIV("passwordPopup");
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
    document.getElementById("userNameLbl").innerHTML = `<b>${devName}</b>`; // set user name
    localStorage.setItem(bheeshmUserNameLSKey, devName);
    localStorage.setItem(
      bheeshmUserFacilitatorLSKey,
      response?.data?.facilitator?.toString(),
    );
    ShowPopup(CM_CONTANER);
    HidePopup(PASSWORD_CONTAINER);
    initializeCollctionMasterPage(devName);
  }
}

function clearLocalStorageOnInitialLoad() {
  // Clear specific keys
  localStorage.removeItem(bheeshmUserNameLSKey);
  localStorage.removeItem(bheeshmUserFacilitatorLSKey);
  document.getElementById("userNameLbl").innerHTML = "";
  ShowPopup("passwordContainer");
  HidePopup("collectionMasterContainer");
  ClearTextBoxValue("mainPasswordTxtBox");
}

window.onload = function () {
  clearLocalStorageOnInitialLoad();
};

function logoutClick() {
  clearLocalStorageOnInitialLoad();
  resetFormFields();
}
