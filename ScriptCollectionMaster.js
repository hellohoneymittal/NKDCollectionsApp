const cmNameLiveSearch = "cmNameLiveSearch";
const cmAmountTxtBox = "cmAmountTxtBox";
const cmPaymentDdl = "cmPaymentDdl";
const cmUploadControl = "cmUploadControl";
const cmNotesTxtBox = "cmNotesTxtBox";
const cmNameULList = "cmNameULList";

const cmTableTHead = "cmTableTHead";
const cmTableTBody = "cmTableTBody";
let selectedfile = "";
let selectedFileType = "";
let selectedFileName = "";

let selectedFile64String = "";
let selectedDonorName = "";
let selectedRecurringDonorName = "";
let masterList = [];

let saveRequest = {
  apiType: "",
  selectedFileType: "",
  selectedFileName: "",
  selectedFile64String: "",
  sewakartaName: "",
  facilitatorName: "",
  timestamp: "",
  devoteeName: "",
  donorName: "",
  donationAmount: "",
  modeOfPayment: "",
  screenshot: "",
  receiptsNo: "",
  notes: "",
};

const dateForExcel = getFormattedDateForDownload();
// Populate the list with cities
const cmNameULListCtrl = document.getElementById(cmNameULList);
const cmNameLiveSearchCtrl = document.getElementById(cmNameLiveSearch);

document.addEventListener("DOMContentLoaded", function () {
  setupLiveSearch("cmNameLiveSearch", "cmNameULList", function (selectedText) {
    selectedDonorName = selectedText;
  });

  setupLiveSearch(
    "cmrNameLiveSearch",
    "cmrNameULList",
    function (selectedText) {
      selectedRecurringDonorName = selectedText;
    },
  );

  const paymentMethodDropDown = document.getElementById("cmPaymentDdl");
  const transactionForContainer = document.getElementById(
    "cmTransactionForContainer",
  );
  const transactionForDropDown = document.getElementById("cmTransactionForDdl");

  function toggleTransactionForDropdown() {
    const isCashSelected = paymentMethodDropDown.value === "Cash";
    transactionForContainer.style.display = isCashSelected ? "block" : "none";
    transactionForDropDown.required = isCashSelected;

    if (!isCashSelected) {
      transactionForDropDown.selectedIndex = 0;
    }
  }

  paymentMethodDropDown.addEventListener(
    "change",
    toggleTransactionForDropdown,
  );
  toggleTransactionForDropdown();
});

function validateDonorSelection() {
  const input = cmNameLiveSearchCtrl.value;
  if (!selectedDonorName || selectedDonorName !== input) {
    SHOW_ERROR_POPUP("Please select a donor from the list.");
    return false; // Validation failed
  }
  return true; // Validation successful
}

// Async function to fetch data
async function getCollectionMasterDataAsync(devName) {
  try {
    const responseApi = await fetch(GET_COLLECTION_MASTER_DATA + devName);
    const response = await responseApi.json();
    if (response.status) {
      ShowPopup("cmCollectionListContainer");
      console.log("response.data - ", response.data);
      const modifiedData = preprocessCMData(response.data);
      fillDynamicTableRows(modifiedData, cmTableTHead, cmTableTBody);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null if there's an error
  }
}

function preprocessCMData(data) {
  return data.map((row) => {
    return {
      Date: row.Date,
      "Donor Name": row["Donor Name"],
      "Donation Amount": row["Donation Amount"],
      "Mode of Payment": "Cash",
      Screenshot: row.Screenshot,
      Notes: row.Notes,
    };
  });
}

async function cmTotalCollectionBtnClick() {
  const devoteeNameCM = localStorage
    .getItem(bheeshmUserNameLSKey)
    .toString()
    .trim();
  IsLoading(true);
  await getCollectionMasterDataAsync(devoteeNameCM);
  IsLoading(false);
}

// Function to run on page load
async function initializeCollctionMasterPage(devName) {
  const request = {
    apiType: "",
    devName: devName,
  };

  const response = await CALL_API_WITH_CACHE("GET_DONOR_NAME_LIST", request);
  populateCollectionInputForm(devName, response);
}

async function initializeCollctionMasterPageWithReload(isReload = false) {
  const request = {
    apiType: "",
    devName: loginUserName,
  };

  const response = await CALL_API_WITH_CACHE(
    "GET_DONOR_NAME_LIST",
    request,
    "",
    isReload,
  );
  populateCollectionInputForm(loginUserName, response);
}

function populateCollectionInputForm(devName, response) {
  if (response.status) {
    masterList = response.data;

    initializedLiveSearchControl(
      "cmrNameLiveSearch",
      "cmrNameULList",
      masterList,
    );

    masterList.unshift(devName);
    initializedLiveSearchControl(cmNameLiveSearch, cmNameULList, masterList);
  } else {
    SHOW_ERROR_POPUP(
      "Something went wrong , Please contact to any NKD Servants",
    );
  }
}

function cmNewDonorBtnClick() {
  HidePopup(CM_CONTANER);
  ShowPopup(DM_CONTAINER);
}

function cmFetchFile() {
  // Get the file input element
  const fileInput = document.getElementById(cmUploadControl);

  // Get the selected file(s)
  const files = fileInput.files;

  if (files.length > 0) {
    const file = files[0]; // Get the first selected file
    selectedfile = file;

    const reader = new FileReader();

    // Define the onload event handler for the FileReader
    reader.onload = function (event) {
      const base64String = event.target.result.split(",")[1]; // Remove the data URL prefix
      selectedFile64String = base64String;
    };

    reader.readAsDataURL(file);
  } else {
    console.log("No file selected");
  }
}

function cmSubmitBtnClick() {
  if (!validateDonorSelection()) return;

  const donorNameVal = GetControlValue(cmNameLiveSearch)
    .split("--")[0]
    .toString()
    .trim();
  const amount = GetControlValue(cmAmountTxtBox);
  const paymentMethod = GetControlValue(cmPaymentDdl);
  const notes = GetControlValue(cmNotesTxtBox);
  const devoteeNameCM = localStorage.getItem(bheeshmUserNameLSKey);
  const devoteeFacNameCM = localStorage.getItem(bheeshmUserFacilitatorLSKey);

  if (!donorNameVal) {
    SHOW_ERROR_POPUP("Enter Devotee Name");
    return;
  }
  if (!amount) {
    SHOW_ERROR_POPUP("Enter Amount");
    return;
  }
  if (!paymentMethod) {
    SHOW_ERROR_POPUP("Choose Payment Options");
    return;
  }
  if (
    (paymentMethod == "NEFT" || paymentMethod == "Cheque") &&
    !selectedfile?.name
  ) {
    SHOW_ERROR_POPUP("Upload File is required for NEFT / Cheque");

    return;
  }

  saveRequest.apiType = "SAVE_COLLECTION_MASTER_DATA";
  saveRequest.selectedFileType = selectedfile?.type;
  saveRequest.selectedFileName = selectedfile?.name;
  saveRequest.selectedFile64String = selectedFile64String;
  saveRequest.sewakartaName = devoteeNameCM;
  saveRequest.devoteeName = devoteeNameCM;
  saveRequest.facilitatorName = devoteeFacNameCM;
  saveRequest.timestamp = DATE_UTC;
  saveRequest.donorName = donorNameVal;
  saveRequest.donationAmount = amount;
  saveRequest.modeOfPayment = paymentMethod;
  saveRequest.screenshot = "";
  saveRequest.receiptsNo = "";
  saveRequest.notes = notes;
  saveRequest.timestamp = DATE_UTC;

  IsLoading(true);
  fetch(APPLICATION_URL, {
    method: "POST",
    body: JSON.stringify(saveRequest),
  })
    .then((response) => response.json())
    .then((data) => {
      IsLoading(false);
      if (data.status) {
        SHOW_SUCCESS_POPUP("Data saved successfully!");
        resetFormFields();
      } else {
        SHOW_ERROR_POPUP("Data not saved");
      }
    })
    .catch((ex) => {
      IsLoading(false);
      console.log("Error - ", ex);
    });
}

function resetFormFields() {
  ClearTextBoxValue(cmNameLiveSearch);
  ClearTextBoxValue(cmAmountTxtBox);
  ClearTextBoxValue(cmUploadControl);
  ClearTextBoxValue(cmNotesTxtBox);
  ClearDropdownValue(cmPaymentDdl);
}

function cmClearBtnClick() {
  resetFormFields();
}

async function cmPedningDonorBtnClick() {
  const devoteeNameCM = localStorage.getItem(bheeshmUserNameLSKey);
  const request = {
    apiType: "GET_PENDING_DONOR_LIST",
    devName: devoteeNameCM,
  };

  IsLoading(true);
  try {
    const apiResponse = await fetch(APPLICATION_URL, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const response = await apiResponse.json();
    IsLoading(false); // Stop loading indicator
    if (response.status) {
      console.log(response.data);
      ShowPopup("cmPendingDonorContainer");
      HidePopup("collectionMasterContainer");

      const modifiedData = preprocessPendingDonorData(response.data);
      fillDynamicTableRows(modifiedData, "pdTableHead", "pdTableBody");
    } else {
      SHOW_ERROR_POPUP("Something Went Wrong");
    }
  } catch (ex) {
    IsLoading(false); // Stop loading indicator on error
    SHOW_ERROR_POPUP("Error :- " + ex);
  }
}

function cmPendingDonorContainerCancelClick() {
  ShowPopup("collectionMasterContainer");
  HidePopup("cmPendingDonorContainer");
}

function preprocessPendingDonorData(data) {
  debugger;
  const updatedData = data.map((row) => {
    return {
      "Donor Name": row["Donor Name"],
      "Last year amount": row["Last Year Collection"],
      "Contact Number": row["Contact Number"],
      Birthday: row.Birthday,
    };
  });

  const sortedData = sortObjectByValue(updatedData, "Last year amount");

  console.log(sortedData);
  return sortedData;
}

function cmPendingDonorDownloadClick(tableId) {
  const devNamePart = localStorage
    .getItem(bheeshmUserNameLSKey)
    .split(" ")[0]
    .toString()
    .trim();

  exportTableToExcel(
    tableId,
    `PendingList_${devNamePart}_${dateForExcel}.xlsx`,
  );
}

function collectionListExcelBtnClick(tableId) {
  const devNamePart = localStorage
    .getItem(bheeshmUserNameLSKey)
    .split(" ")[0]
    .toString()
    .trim();

  exportTableToExcel(
    tableId,
    `CollectionList_${devNamePart}_${dateForExcel}.xlsx`,
  );
}

function cmCollectionListContainerClick() {
  ShowPopup("collectionMasterContainer");
  HidePopup("cmCollectionListContainer");
}

function openCMRContainer() {
  SHOW_CONFIRMATION_POPUP(
    "Do you want to open recurring collection form",
    openCMRContainerDiv,
  );
}

function openCMRContainerDiv() {
  SHOW_SPECIFIC_DIV("cmrContainer");
}

function cmrBackButton() {
  SHOW_SPECIFIC_DIV("collectionMasterContainer");
}

async function cmrSubmitBtnClick() {
  // Get values from the inputs

  const recurringType = document.getElementById("cmrRecurringTypeDdl").value;
  const email = document.getElementById("cmrEmailTextBox").value.trim();
  const description = document.getElementById("cmrDesTxtBox").value.trim();

  // Validate each required field
  if (!selectedRecurringDonorName) {
    SHOW_ERROR_POPUP("Name is required");
    return false;
  }
  if (!recurringType) {
    SHOW_ERROR_POPUP("Type is required.");
    return false;
  }
  if (!email) {
    SHOW_ERROR_POPUP("Email is required.");
    return false;
  } else if (!validateEmail(email)) {
    SHOW_ERROR_POPUP("Email format is invalid.");
    return false;
  }
  if (!description) {
    SHOW_ERROR_POPUP("Description is required.");
    return false;
  }

  const devNameStored = localStorage
    .getItem(bheeshmUserNameLSKey)
    .toString()
    .trim();

  const recurringData = {
    devName: devNameStored,
    donorName: selectedRecurringDonorName.split("--")[0].trim(),
    description: description,
    recurringType: recurringType,
  };
  const recurringRequest = {
    recurringData: recurringData,
    apiType: API_TYPE_CONSTANT.saveRecurringCollection,
  };

  const response = await API_HANDLER(recurringRequest);
  if (response?.status) {
    SHOW_SUCCESS_POPUP("Input saved successfully");
    resetRecurringForm();
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function resetRecurringForm() {
  document.getElementById("cmrNameLiveSearch").value = "";
  document.getElementById("cmrRecurringTypeDdl").value = "";
  document.getElementById("cmrEmailTextBox").value = "";
  document.getElementById("cmrDesTxtBox").value = "";
}
