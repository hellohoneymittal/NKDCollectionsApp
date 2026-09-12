const adminContainerKey = "adminContainer";
let selectedSewaKartaName = "";
let selectedDevoteeNameForCollectionInput = "";
let sevaKartaNameList = null;
document.addEventListener("DOMContentLoaded", function () {
  setupLiveSearch("adminSkName", "adminSkNameULList", function (selectedText) {
    selectedSewaKartaName = selectedText;
  });

  setupLiveSearch(
    "adminCollSkName",
    "adminCollSkNameULList",
    function (selectedText) {
      selectedDevoteeNameForCollectionInput = selectedText;
    }
  );
});

function validateSewakartaLiveSearchSelection() {
  const adminSkNameCtrl = document.getElementById("adminSkName");
  const input = adminSkNameCtrl.value;
  if (!selectedSewaKartaName || selectedSewaKartaName !== input) {
    SHOW_ERROR_POPUP("Please select input from the list.");
    return false; // Validation failed
  }
  return true; // Validation successful
}

async function populateSewakartaPendingDonorList(devName) {
  const request = {
    apiType: API_TYPE_CONSTANT.getPendingDonorList,
    devName: devName,
  };
  try {
    const response = await API_HANDLER(request);
    if (response) {
      const modifiedData = preprocessPendingDonorData(response.data);
      fillDynamicTableRows(modifiedData, "skTableTHead", "skTableTBody");
      ShowPopup("skTableDivDownloadIcon"); // show the download icon
    } else {
      SHOW_ERROR_POPUP("Something Went Wrong");
    }
  } catch (ex) {
    SHOW_ERROR_POPUP("Error :- " + ex);
  }
}

async function adminPanelBtnClick() {
  SHOW_SPECIFIC_DIV(adminContainerKey);
  const request = {
    apiType: API_TYPE_CONSTANT.getSewaKartaNameList,
  };
  if (!sevaKartaNameList) {
    const response = await API_HANDLER(request);
    if (response) {
      sevaKartaNameList = response?.data;
    }
  }

  if (sevaKartaNameList) {
    initializedLiveSearchControl(
      "adminSkName",
      "adminSkNameULList",
      sevaKartaNameList
    );
  }

  const requestColl = {
    apiType: API_TYPE_CONSTANT.getAllDevoteesList,
  };
  const responseAllDevName = await API_HANDLER_WITHOUT_LOADING(requestColl);
  if (responseAllDevName) {
    initializedLiveSearchControl(
      "adminCollSkName",
      "adminCollSkNameULList",
      responseAllDevName?.data
    );
  }
}

function getSkPendingListBtnClick() {
  if (!validateSewakartaLiveSearchSelection()) return;
  populateSewakartaPendingDonorList(selectedSewaKartaName.split(":")[0].trim());
}

function skBackClick() {
  SHOW_SPECIFIC_DIV("collectionMasterContainer");
}

function skExcelButtonClick(tableId) {
  const devNamePart = selectedSewaKartaName.split(":")[0].trim().toString();
  exportTableToExcel(tableId, `PendingList_${devNamePart}_${ExcelDate}.xlsx`);
}

function validateCollDevLiveSearchSelection() {
  const adminSkNameCtrl = document.getElementById("adminCollSkName");
  const input = adminSkNameCtrl.value;
  if (
    !selectedDevoteeNameForCollectionInput ||
    selectedDevoteeNameForCollectionInput !== input
  ) {
    SHOW_ERROR_POPUP("Please select input from the list.");
    return false; // Validation failed
  }

  return true; // Validation successful
}

function goToDevCollectionInputClick() {
  if (!validateCollDevLiveSearchSelection()) return;
  const devName = selectedDevoteeNameForCollectionInput.split("--")[0].trim();
  const facName = selectedDevoteeNameForCollectionInput.split("--")[1].trim();
  localStorage.setItem(bheeshmUserNameLSKey, devName);
  localStorage.setItem(bheeshmUserFacilitatorLSKey, facName);
  initializeCollctionMasterPage(devName);
  SHOW_SPECIFIC_DIV(CM_CONTANER);
  document.getElementById("userNameLbl").innerHTML = `<b>${devName}</b>`; // set user name
}
