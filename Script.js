const pcSubmitBtn = "pcSubmitBtn";
const mainPasswordTxtBox = "mainPasswordTxtBox";
function pcSubmitBtnClick() {
  const passwordVal = GetControlValue(mainPasswordTxtBox)
    .toString()
    .toLowerCase()
    .trim();
  LOGIN_USER_FAC_NAME = "";
  if (!passwordVal) {
    SHOW_ERROR_POPUP("Please Enter Password");
    return;
  }
  IsLoading(true);
  const request = {
    apiType: "GET_DEVOTEE_INFO",
    password: passwordVal,
  };
  fetch(GET_DEVOTEE_INFO, {
    method: "POST",
    body: JSON.stringify(request),
  })
    .then((apiResponse) => apiResponse.json())
    .then((response) => {
      IsLoading(false);
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
          response?.data?.facilitator?.toString()
        );
        ShowPopup(CM_CONTANER);
        HidePopup(PASSWORD_CONTAINER);
        initializeCollctionMasterPage(devName);
      } else if (!response.status) {
        SHOW_ERROR_POPUP("Wrong Password");
        return;
      }
    })
    .catch((ex) => {
      IsLoading(false);
    });
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
