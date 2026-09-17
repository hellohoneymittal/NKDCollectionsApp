function dmBackBtnClick() {
  SHOW_SPECIFIC_DIV(CM_CONTANER);
}

const dmNameTxtBox = "dmNameTxtBox";
const dmAddressTxtBox = "dmAddressTxtBox";
const dmContactNumberTxtBox = "dmContactNumberTxtBox";
const birthdayId = "birthday"; // Changed the name to avoid conflict
const spouseBirthdayId = "spouseBirthday";
const child1BirthdayId = "child1Birthday";
const child2BirthdayId = "child2Birthday";
const anniversaryId = "anniversary";
const professionId = "profession";
const dmSubmitBtn = "dmSubmitBtn";

let donorMasterRequest = {
  apiType: "",
  bheeshmSewak: "",
  devName: "",
  donorName: "",
  Active: 1,
  lastYear: "",
  categoryCalculated: "",
  collection2024: "",
  address: "",
  contactNumber: "",
  courierServiceType: "",
  birthday: "",
  spouseBirthday: "",
  child1Birthday: "",
  child2Birthday: "",
  anniversary: "",
  profession: "",
  comments: "",
  pAN: "",
  gift: "",
  funday: "",
  receiptName: "",
  bdayVefied: "",
  connectedSince: "",
};

function dmSubmitBtnClick() {
  // Get values from each input field
  const donorName = GetControlValue(dmNameTxtBox);
  const address = GetControlValue(dmAddressTxtBox);
  const contactNumber = GetControlValue(dmContactNumberTxtBox);
  const birthday = GetControlValue(birthdayId); // Use the correct id variable
  const spouseBirthday = GetControlValue(spouseBirthdayId); // Use the correct id variable
  const child1Birthday = GetControlValue(child1BirthdayId); // Use the correct id variable
  const child2Birthday = GetControlValue(child2BirthdayId); // Use the correct id variable
  const anniversary = GetControlValue(anniversaryId); // Use the correct id variable
  const profession = GetControlValue(professionId); // Use the correct id variable
  const devoteeNameDM = localStorage.getItem(bheeshmUserNameLSKey);
  const connectedSinceLcl = new Date().toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  // Create an object with all the data
  const donorData = {
    donorName,
    address,
    contactNumber,
    birthday,
    spouseBirthday,
    child1Birthday,
    child2Birthday,
    anniversary,
    profession,
  };
  donorMasterRequest.apiType = "SAVE_DONOR_MASTER_DATA";
  donorMasterRequest.devName = devoteeNameDM;
  donorMasterRequest.donorName = donorData.donorName;
  donorMasterRequest.address = donorData.address;
  donorMasterRequest.contactNumber = donorData.contactNumber;
  donorMasterRequest.birthday = donorData.birthday;
  donorMasterRequest.spouseBirthday = donorData.spouseBirthday;
  donorMasterRequest.child1Birthday = donorData.child1Birthday;
  donorMasterRequest.child2Birthday = donorData.child2Birthday;
  donorMasterRequest.anniversary = donorData.anniversary;
  donorMasterRequest.profession = donorData.profession;
  donorMasterRequest.connectedSince = connectedSinceLcl;

  console.log("Donor Data:", donorMasterRequest);

  IsLoading(true);
  fetch(APPLICATION_URL, {
    method: "POST",
    body: JSON.stringify(donorMasterRequest),
  })
    .then((responseAPI) => responseAPI.json())
    .then((response) => {
      IsLoading(false);
      if (response.status) {
        SHOW_SUCCESS_POPUP("Saved");
        dmResetForm();
        SHOW_SPECIFIC_DIV(CM_CONTANER);
        initializeCollctionMasterPage(devoteeNameDM);
      } else if (!response.status && response.data == "dublicate") {
        SHOW_ERROR_POPUP(
          "Please give correct information , donor name already exists.",
        );
        return;
      } else {
        SHOW_ERROR_POPUP("Not saved");
      }
    })
    .catch((ex) => {
      IsLoading(false);
      console.log("Error - ", ex);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  disabledButtonState(DM_CONTAINER, dmSubmitBtn);
});

document
  .querySelectorAll(
    "#donorMasterContainer input, #donorMasterContainer textarea, #donorMasterContainer select",
  )
  .forEach((element) => {
    element.addEventListener("input", () =>
      disabledButtonState(DM_CONTAINER, dmSubmitBtn),
    );
  });

function dmResetForm() {
  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Reset each input field to its default value or clear it
  document.getElementById(dmNameTxtBox).value = ""; // Clear donor name
  document.getElementById(dmAddressTxtBox).value = ""; // Clear address
  document.getElementById(dmContactNumberTxtBox).value = ""; // Clear contact number
  document.getElementById(birthdayId).value = ""; // Clear birthday
  document.getElementById(spouseBirthdayId).value = today; // Reset to today
  document.getElementById(child1BirthdayId).value = today; // Reset to today
  document.getElementById(child2BirthdayId).value = today; // Reset to today
  document.getElementById(anniversaryId).value = today; // Reset to today
  document.getElementById(professionId).value = ""; // Clear profession

  // Disable submit button if necessary after reset
  disabledButtonState(DM_CONTAINER, dmSubmitBtn);
}
