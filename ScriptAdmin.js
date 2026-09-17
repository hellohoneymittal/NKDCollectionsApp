const adminContainerKey = "adminContainer";
let selectedSewaKartaName = "";
let selectedDevoteeNameForCollectionInput = "";
let sevaKartaNameList = null;

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
  try {
    const response = await CALL_API_WITH_CACHE(
      "GET_PENDING_DONOR_LIST",
      {},
      24,
    );

    const updatedData = FILTER_ROW_DATA(response?.data, {
      "Devotee Name": devName,
      Active: 1,
    });

    if (updatedData) {
      const options = {
        columnMap: {
          "Donor Name": 1,
          "Last Year Collection": 3,
          "Curent Year Collection": 5,
          "Contact Number": 7,
          Birthday: 9,
        },
      };

      fillDynamicTableRows(
        updatedData,
        "skTableTHead",
        "skTableTBody",
        [],
        options,
      );
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
}

async function getSewaKartaNameList() {
  console.log("Fetching Sewa Karta Name List...");
  setupLiveSearch("adminSkName", "adminSkNameULList", function (selectedText) {
    selectedSewaKartaName = selectedText;
  });

  debugger;
  const response = await CALL_API_WITH_CACHE("GET_SEWAKARTA_NAME_LIST", {}, 24);
  if (response?.status) {
    sevaKartaNameList = response?.data;
  }

  if (sevaKartaNameList) {
    initializedLiveSearchControl(
      "adminSkName",
      "adminSkNameULList",
      sevaKartaNameList,
    );
  }

  SHOW_SPECIFIC_DIV("pendingAPopup");
}

async function getAllDevoteesList() {
  const response = await CALL_API_WITH_CACHE("GET_ALL_DEVOTEES_LIST", {}, 24);

  setupLiveSearch(
    "adminCollSkName",
    "adminCollSkNameULList",
    function (selectedText) {
      selectedDevoteeNameForCollectionInput = selectedText;
    },
  );

  if (response?.status) {
    initializedLiveSearchControl(
      "adminCollSkName",
      "adminCollSkNameULList",
      response?.data,
    );
  }

  SHOW_SPECIFIC_DIV("collectionAPopup");
}

function getSkPendingListBtnClick() {
  if (!validateSewakartaLiveSearchSelection()) return;
  populateSewakartaPendingDonorList(selectedSewaKartaName.split(":")[0].trim());
}

function skBackClick() {
  SHOW_SPECIFIC_DIV("adminContainer");
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
  SET_USER_NAME_ON_SCREEN(devName);
  SET_DIV_TITLE("collectionMasterContainer", "Collection Input Form");
}
