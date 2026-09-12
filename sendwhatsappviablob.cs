exportTableToExcel('cmTable', 'honey.xlsx')


async function handleExportAndSend(tableId) {
  // Export table to Excel
  exportTableToExcel(tableId);

  // Assume that the generated Excel file is available to upload
  const file = new Blob([/* your Excel data here */], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  try {
    const shareableLink = await uploadFile(file);
    sendToWhatsApp(shareableLink);
  } catch (error) {
    console.error(error);
    alert("Failed to upload the file and send the link.");
  }
}


function sendToWhatsApp(shareableLink) {
  const message = `Here is the Excel file you requested: ${shareableLink}`;
  const encodedMessage = encodeURIComponent(message);
  const mobileNumber = "YOUR_MOBILE_NUMBER"; // Replace with the actual number

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobileNumber}&text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("YOUR_UPLOAD_API_ENDPOINT", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed.");
  }

  const data = await response.json();
  return data.shareableLink; // Assuming the API returns a shareable link
}


function exportTableToExcel(tableId, filename = "data.xlsx") {
  // Get the table
  var table = document.getElementById(tableId);

  // Check if table exists
  if (!table) {
    console.error(`Table with ID ${tableId} not found.`);
    return;
  }

  // Extract data from the table
  var data = [];
  var rows = table.querySelectorAll("tr");

  // Loop through each row and collect the cell data
  rows.forEach(function (row) {
    var rowData = [];
    row.querySelectorAll("th, td").forEach(function (cell) {
      const cellValue = cell.innerText.trim();
      if (!isNaN(cellValue) && cellValue !== "") {
        rowData.push(parseFloat(cellValue)); // Store as number
      } else {
        rowData.push(cellValue); // Store as string
      }
    });
    data.push(rowData);
  });

  // Create a worksheet and workbook
  var ws = XLSX.utils.aoa_to_sheet(data); // Convert 2D array to sheet
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Set column widths for better display
  const colWidths = [];
  for (let i = 0; i < data[0].length; i++) {
    colWidths.push({
      wch: Math.max(...data.map((row) => (row[i] || "").toString().length)) + 2, // +2 for padding
    });
  }
  ws["!cols"] = colWidths;

  // Export the file locally
  XLSX.writeFile(wb, filename);
}