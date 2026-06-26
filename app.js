function startLiveDashboardClock() {

    const clockDisplayNode = document.getElementById("liveDashboardClockDisplay");

    if (clockDisplayNode) {

        setInterval(() => {

            const currentLiveDateTimeInstance = new Date();

            const computedTimeFormatString = currentLiveDateTimeInstance.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            const computedDateFormatString = currentLiveDateTimeInstance.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

            clockDisplayNode.innerText = `${computedDateFormatString} | ${computedTimeFormatString}`;

        }, 1000);

    }

}

// ==========================================================================
// 1.1 MASTER CUSTOMER REGISTRY ENGINE
// ==========================================================================
let customerRegistryList = JSON.parse(localStorage.getItem("dashboard_master_customer_log_pool")) || [];

function saveNewCustomerToRegistry() {
    const customerInputNode = document.getElementById("newCustomerInput");
    const customerName = customerInputNode ? customerInputNode.value.trim() : "";
    
    if (customerName) {
        if (!customerRegistryList.includes(customerName)) {
            customerRegistryList.push(customerName);
            localStorage.setItem("dashboard_master_customer_log_pool", JSON.stringify(customerRegistryList));
            customerInputNode.value = "";
            renderCustomerRegistryUI();
            alert(`Success! "${customerName}" saved to registry.`);
        } else {
            alert("Customer already exists!");
        }
    }
}

function deleteCustomerFromRegistry(index) {
    if(confirm("Delete this customer?")) {
        customerRegistryList.splice(index, 1);
        localStorage.setItem("dashboard_master_customer_log_pool", JSON.stringify(customerRegistryList));
        renderCustomerRegistryUI();
    }
}

function renderCustomerRegistryUI() {
    const displayList = document.getElementById("customerRegistryDisplayList");
    const dataList = document.getElementById("customerList"); 
    
    // ডিজাইন সেটআপ
    if(displayList) {
        displayList.style.maxHeight = "75px";
        displayList.style.overflowY = "auto";
        displayList.style.border = "1px solid #ccc";
        displayList.style.padding = "10px";
        displayList.style.listStyleType = "none";
    }
    
    let html = "";
    let optionsHtml = ""; // এটি আগে খালি ছিল, এখন লুপ থেকে ভরবে
    
    // লোকাল স্টোরেজ থেকে ডাটা রিফ্রেশ করুন
    customerRegistryList = JSON.parse(localStorage.getItem("dashboard_master_customer_log_pool")) || [];
    
    customerRegistryList.forEach((name, index) => {
        // লিস্টের জন্য HTML
        html += `<li class="list-item">
                    <span class="item-name">${name}</span>
                    <button class="delete-btn" onclick="deleteCustomerFromRegistry(${index})">Delete</button>
                </li>`;
        
        // DATALIST এর জন্য অপশন তৈরি (এই অংশটিই মিসিং ছিল)
        optionsHtml += `<option value="${name}">`;
    });
    
    // UI আপডেট করুন
    if(displayList) displayList.innerHTML = html || "No customers registered.";
    
    // গুরুত্বপূর্ণ: এখানে optionsHtml টা পাস করতে হবে
    if(dataList) {
        dataList.innerHTML = optionsHtml;
    }
}

// পেজ লোড হওয়ার সময় লিস্ট রেন্ডার করা
document.addEventListener("DOMContentLoaded", () => {
    // আপনার আগের কোডের সাথে এটি যুক্ত করুন
    renderCustomerRegistryUI();
});

// ==========================================================================

// 1. MASTER STORAGE CONFIGURATION MATRIX (LOCALSTORAGE BASE ENGINE)

// ==========================================================================
let defaultInventorySeedListArray = [
    "CF-38/HPK OIL",
    "TOMATO FLAVOUR (POWDER)",
    "CHILLI POWDER PREMIUM"
];


let dynamicStoredItemsMemoryDatabase = JSON.parse(localStorage.getItem("dashboard_master_inventory_log_pool")) || defaultInventorySeedListArray;
let activeItemRowCountSequenceCount = 0;



document.addEventListener("DOMContentLoaded", () => {

    injectNewItemDataRow();
    refreshMasterInventoryListDOMUI();
    const dateField = document.getElementById('docDate');
    if (dateField) {
        dateField.valueAsDate = new Date();
    }
    startLiveDashboardClock();
});



function refreshMasterInventoryListDOMUI() {
    const listHtmlOutputDisplayTargetElement = document.getElementById("inventoryItemsRealtimeDisplayList");

    if(listHtmlOutputDisplayTargetElement) {
        listHtmlOutputDisplayTargetElement.style.maxHeight = "75px"; // কাস্টমার লিস্টের মতোই হাইট
        listHtmlOutputDisplayTargetElement.style.overflowY = "auto";
        listHtmlOutputDisplayTargetElement.style.border = "1px solid #ccc";
        listHtmlOutputDisplayTargetElement.style.padding = "10px";
        listHtmlOutputDisplayTargetElement.style.listStyleType = "none";
    }

    let generatedListItemsHtmlStructure = "";
    
    // ডাটাবেস আপডেট করে নিন
    dynamicStoredItemsMemoryDatabase = JSON.parse(localStorage.getItem("dashboard_master_inventory_log_pool")) || defaultInventorySeedListArray;
    
    dynamicStoredItemsMemoryDatabase.forEach((productStringName, lookupIndex) => {
        generatedListItemsHtmlStructure += `
        <li class="list-item">
            <span class="item-name">${productStringName}</span>
            <button class="delete-btn" onclick="deleteProductFromInventoryRegistry(${lookupIndex})">Delete</button>
        </li>`;
    });

    if(listHtmlOutputDisplayTargetElement) {
        listHtmlOutputDisplayTargetElement.innerHTML = generatedListItemsHtmlStructure || 
            `<li style="padding:10px; color:#a0aec0; font-style:italic;">No items saved!</li>`;
    }
}



function saveNewProductToInventoryDatabasePool() {
    const textInputFieldNode = document.getElementById("newGlobalItemInput");
    const structuralRawValueString = textInputFieldNode ? textInputFieldNode.value.trim() : "";
   
    if (structuralRawValueString) {
        if (!dynamicStoredItemsMemoryDatabase.includes(structuralRawValueString)) {
            dynamicStoredItemsMemoryDatabase.push(structuralRawValueString);
            localStorage.setItem("dashboard_master_inventory_log_pool", JSON.stringify(dynamicStoredItemsMemoryDatabase));
            textInputFieldNode.value = "";
            refreshMasterInventoryListDOMUI();
            refreshGlobalDatalistElementDOMPool(compileSharedDataListOptionsHtml());
            alert(`Success! "${structuralRawValueString}" dynamically indexed inside master memory repository!`);
        } else {
            alert("Duplicate product! This specific item configuration nomenclature already tracked inside inventory registry list.");
        }
    } else {
        alert("Please enter a valid product item name data string description before executing entry trigger process!");
    }

}



function deleteProductFromInventoryRegistry(targetArrayArrayIndex) {
    if(confirm("Are you sure you want to delete this product template specification from the global suggestion engine memory data stream?")) {
        dynamicStoredItemsMemoryDatabase.splice(targetArrayArrayIndex, 1);
        localStorage.setItem("dashboard_master_inventory_log_pool", JSON.stringify(dynamicStoredItemsMemoryDatabase));
        refreshMasterInventoryListDOMUI();
        refreshGlobalDatalistElementDOMPool(compileSharedDataListOptionsHtml());
    }
}


function compileSharedDataListOptionsHtml() {
    let outputOptionsMarkup = "";
    dynamicStoredItemsMemoryDatabase.forEach(itemString => {
        outputOptionsMarkup += `<option value="${itemString}">`;
    });
    return outputOptionsMarkup;
}



// ==========================================================================

// 2. DYNAMIC DASHBOARD ROW INTERACTION ENGINE

// ==========================================================================

function injectNewItemDataRow() {
    activeItemRowCountSequenceCount++;
    const dataContainerBodyTarget = document.getElementById("dynamicItemRowsContainer");
    const currentActiveOptionsListHtmlString = compileSharedDataListOptionsHtml();
   
    const computedRowHtmlMarkupTemplateLiteral = `
        <tr id="itemDataGridRowElementIndex_${activeItemRowCountSequenceCount}">
            <td class="text-center-align"><strong class="row-sequence-index-display">${String(activeItemRowCountSequenceCount).padStart(2, '0')}</strong></td>
            <td>
                <input type="text"
                       class="input-item-nomenclature"
                       placeholder="Start typing saved item..."
                       list="globalItemAutoSuggestionDataListPool"
                       required>
                <button type="button" class="btn-row-delete" onclick="removeItemDataRow(${activeItemRowCountSequenceCount})">[ Delete Item ]</button>
            </td>
            <td><input type="number" class="input-item-qty" placeholder="0" min="1" required oninput="calculateRowRealtimeAmount(${activeItemRowCountSequenceCount})"></td>
            <td><input type="text" class="input-item-unit" placeholder="e.g., KG" required></td>
            <td class="financial-data-row-cell"><input type="number" class="input-item-rate" placeholder="0.00" step="0.01" oninput="calculateRowRealtimeAmount(${activeItemRowCountSequenceCount})"></td>
            <td class="financial-data-row-cell"><input type="number" class="output-item-amount" placeholder="0.00" readonly></td>
        </tr>
    `;

    dataContainerBodyTarget.insertAdjacentHTML('beforeend', computedRowHtmlMarkupTemplateLiteral);
    refreshGlobalDatalistElementDOMPool(currentActiveOptionsListHtmlString);
    toggleTemplateUIRenderMode();
    reIndexRowSerialNumbers();
}



function refreshGlobalDatalistElementDOMPool(innerOptionsHtmlString) {
    let existingDataListElementNode = document.getElementById("globalItemAutoSuggestionDataListPool");
    if(!existingDataListElementNode) {
        const rawDataListHtmlTagStructure = `<datalist id="globalItemAutoSuggestionDataListPool">${innerOptionsHtmlString}</datalist>`;
        document.body.insertAdjacentHTML('beforeend', rawDataListHtmlTagStructure);
    } else {
        existingDataListElementNode.innerHTML = innerOptionsHtmlString;
    }
}



function calculateRowRealtimeAmount(rowUniqueIdIndex) {
    const structuralTargetRowNode = document.getElementById(`itemDataGridRowElementIndex_${rowUniqueIdIndex}`);
    if (structuralTargetRowNode) {
        const structuralQuantityValue = parseFloat(structuralTargetRowNode.querySelector('.input-item-qty').value) || 0;
        const structuralRateValue = parseFloat(structuralTargetRowNode.querySelector('.input-item-rate').value) || 0;
        const finalCalculatedProductAmount = structuralQuantityValue * structuralRateValue;
        structuralTargetRowNode.querySelector('.output-item-amount').value = finalCalculatedProductAmount.toFixed(2);
    }
}



function removeItemDataRow(rowUniqueIdIndex) {
    const rowElementTargetToDelete = document.getElementById(`itemDataGridRowElementIndex_${rowUniqueIdIndex}`);
    const totalRemainingRowsCount = document.querySelectorAll("#dynamicItemRowsContainer tr").length;
    if (totalRemainingRowsCount > 1) {
        if(rowElementTargetToDelete) {
            rowElementTargetToDelete.remove();
            reIndexRowSerialNumbers();
        }
    } else {
        alert("At least one product item row must be present in the document grid!");
    }
}



function reIndexRowSerialNumbers() {
    const remainingRowSequenceLabelsCollection = document.querySelectorAll(".row-sequence-index-display");
    remainingRowSequenceLabelsCollection.forEach((labelNodeElement, numericLoopIndex) => {
        labelNodeElement.innerText = String(numericLoopIndex + 1).padStart(2, '0');
    });

}



function toggleTemplateUIRenderMode() {
    const activeSelectedDocumentModeSelectionValue = document.getElementById("documentTypeSelector").value;
    const targetsFinancialHeaderColumnHeaderNode = document.querySelectorAll(".financial-header-column");
    const targetsFinancialDataRowCellsCollectionArray = document.querySelectorAll(".financial-data-row-cell");
   
    if (activeSelectedDocumentModeSelectionValue === "CHALLAN") {
        targetsFinancialHeaderColumnHeaderNode.forEach(headerNode => headerNode.classList.add("hide-financial-node"));
        targetsFinancialDataRowCellsCollectionArray.forEach(cellElementNode => {
            cellElementNode.classList.add("hide-financial-node");
            const internalRateInputNodeElement = cellElementNode.querySelector('.input-item-rate');
            if(internalRateInputNodeElement) internalRateInputNodeElement.removeAttribute('required');
        });
    } else {
        targetsFinancialHeaderColumnHeaderNode.forEach(headerNode => headerNode.classList.remove("hide-financial-node"));
        targetsFinancialDataRowCellsCollectionArray.forEach(cellElementNode => {
            cellElementNode.classList.remove("hide-financial-node");
            const internalRateInputNodeElement = cellElementNode.querySelector('.input-item-rate');
            if(internalRateInputNodeElement) internalRateInputNodeElement.setAttribute('required', 'true');
        });
    }
}

// ==========================================================================

// 3. ZERO-SERVER CLIENT-SIDE PDF GENERATION WITH METHOD 1 (INPUT FIELD)

// ==========================================================================



// সংখ্যাকে ইংলিশ কথায় রূপান্তর করার হেল্পার ফাংশন (Number to Words Engine)

function convertNumberToEnglishWords(amountNumber) {
    // যদি অ্যামাউন্ট শূন্য বা নেগেটিভ হয়, তবে সেটি হ্যান্ডেল করা
    if (amountNumber <= 0) return "ZERO TAKA ONLY";

    const uppercaseWordsArray = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
    const uppercaseTensArray = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

    let integerPartNumber = Math.floor(amountNumber);
    let decimalPartNumber = Math.round((amountNumber - integerPartNumber) * 100);

    // ... (convertChunk ফাংশনটি আগের মতোই থাকবে) ...
    function convertChunk(num) {
        let chunkString = "";
        if (num >= 100) {
            chunkString += uppercaseWordsArray[Math.floor(num / 100)] + " HUNDRED ";
            num %= 100;
        }
        if (num >= 20) {
            chunkString += uppercaseTensArray[Math.floor(num / 10)] + " ";
            num %= 10;
        }
        if (num > 0) {
            chunkString += uppercaseWordsArray[num] + " ";
        }
        return chunkString.trim();
    }

    // ... (বাকি হিসাব আগের মতোই) ...
    let finalWordsResult = "";
    if (Math.floor(integerPartNumber / 10000000) > 0) {
        finalWordsResult += convertChunk(Math.floor(integerPartNumber / 10000000)) + " CRORE ";
        integerPartNumber %= 10000000;
    }
    if (Math.floor(integerPartNumber / 100000) > 0) {
        finalWordsResult += convertChunk(Math.floor(integerPartNumber / 100000)) + " LAKH ";
        integerPartNumber %= 100000;
    }
    if (Math.floor(integerPartNumber / 1000) > 0) {
        finalWordsResult += convertChunk(Math.floor(integerPartNumber / 1000)) + " THOUSAND ";
        integerPartNumber %= 1000;
    }
    if (integerPartNumber > 0) {
        finalWordsResult += convertChunk(integerPartNumber);
    }

    finalWordsResult = finalWordsResult.trim() + " TAKA";

    if (decimalPartNumber > 0) {
        finalWordsResult += " AND " + convertChunk(decimalPartNumber) + " POISA";
    }

    return finalWordsResult + " ONLY";
}

document.getElementById("documentGenerationForm").addEventListener("submit", ($e) => {
    $e.preventDefault();

    // ১. প্রয়োজনীয় ডাটা সংগ্রহ
    const extractionTargetDocumentSelectionType = document.getElementById("documentTypeSelector").value;
    const invoiceNo = document.getElementById("invoiceNo").value;
    const poNo = document.getElementById("poNo").value || "N/A";
    const clientPhone = document.getElementById('clientPhone').value;
    const customerName = document.getElementById("customerName").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const docDate = document.getElementById("docDate").value;
    
    // PAID AMOUNT সংগ্রহ
    const paidAmount = parseFloat(document.getElementById("paidAmount").value) || 0;
    const preparedBy = document.getElementById("preparedBy").value.trim() || "Admin";

    const submitBtnPointer = document.querySelector(".btn-primary-compile");
    const originalBtnText = submitBtnPointer.innerText;
    submitBtnPointer.innerText = "Opening Preview Window...";
    submitBtnPointer.disabled = true;

    let previewWindow = window.open("", "_blank");
    if (!previewWindow) {
        alert("Popup Blocker detected! Please allow popups for this website to view the PDF preview.");
        submitBtnPointer.innerText = originalBtnText;
        submitBtnPointer.disabled = false;
        return;
    }

    // ২. রো ডাটা প্রসেসিং
   let totalAccumulatedFinancialSum = 0;
const allCurrentRowsNodeList = document.querySelectorAll("#dynamicItemRowsContainer tr");

let tableRowsMarkup = "";
allCurrentRowsNodeList.forEach((rowNode) => {
    const serialNo = rowNode.querySelector('.row-sequence-index-display').innerText;
    const itemName = rowNode.querySelector('.input-item-nomenclature').value.trim();
    const quantity = parseFloat(rowNode.querySelector('.input-item-qty').value) || 0;
    const unit = rowNode.querySelector('.input-item-unit').value;
    const unitRate = parseFloat(rowNode.querySelector('.input-item-rate').value) || 0;
    const calculatedLineAmount = quantity * unitRate;
    
    totalAccumulatedFinancialSum += calculatedLineAmount;

    // আইটেম রো
    tableRowsMarkup += `
        <tr style="height: 28px;">
            <td style="border-right: 1px solid #000000; padding: 5px; text-align: center;">${serialNo}</td>
            <td style="border-right: 1px solid #000000; padding: 5px; font-weight: 500; text-align: left;">${itemName}</td>
            <td style="border-right: 1px solid #000000; padding: 5px; text-align: center;">${quantity}</td>
            <td style="border-right: 1px solid #000000; padding: 5px; text-align: center;">${unit}</td>
            ${extractionTargetDocumentSelectionType === "INVOICE" ? `
            <td style="border-right: 1px solid #000000; padding: 5px; text-align: center;">${unitRate.toFixed(2)}</td>
            <td style="padding: 5px; text-align: center;">${calculatedLineAmount.toFixed(2)}</td>` : ''}
        </tr>
    `;
});

// ফিলার রো লজিকটি লুপের বাইরে হবে!
const totalRows = 12; 
const currentRows = allCurrentRowsNodeList.length;

if (currentRows < totalRows) {
    for (let i = 0; i < (totalRows - currentRows); i++) {
        tableRowsMarkup += `
            <tr style="height: 28px;">
                <td style="border-right: 1px solid #000000; padding: 5px;">&nbsp;</td>
                <td style="border-right: 1px solid #000000; padding: 5px;"></td>
                <td style="border-right: 1px solid #000000; padding: 5px;"></td>
                <td style="border-right: 1px solid #000000; padding: 5px;"></td>
                ${extractionTargetDocumentSelectionType === "INVOICE" ? `
                <td style="border-right: 1px solid #000000; padding: 5px;"></td>
                <td style="padding: 5px;"></td>` : ''}
            </tr>
        `;
    }
}

    // ৩. ফাইনাল ক্যালকুলেশন (Due Amount)
    const netBillDue = totalAccumulatedFinancialSum - paidAmount;
    const calculatedBillInWordsString = convertNumberToEnglishWords(netBillDue); 

    let summarySectionHtml = "";
    if (extractionTargetDocumentSelectionType === "INVOICE") {
        summarySectionHtml = `
            <div style="width: 100%; border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000; box-sizing: border-box; display: flex; margin-top: -1px;">
                <div style="width: 59%; padding: 10px; border-right: 1px solid #000000; font-size: 13px; font-weight: bold; text-transform: uppercase; display: flex; align-items: center; word-break: break-word; overflow-wrap: break-word; hyphens: auto;">
                BILL AMOUNT IN WORD: "${calculatedBillInWordsString}"
            </div>
                            
                <div style="width: 45%;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; padding: 5px; text-align: left; font-weight: bold; width: 45%;">TOTAL AMOUNT:</td>
                            <td style="border-bottom: 1px solid #000000; padding: 5px; text-align: right; width: 55%;">${totalAccumulatedFinancialSum.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; padding: 5px; text-align: left; font-weight: bold;">NET PAYABLE:</td>
                            <td style="border-bottom: 1px solid #000000; padding: 5px; text-align: right;">${totalAccumulatedFinancialSum.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; padding: 5px; text-align: left; font-weight: bold;">PAID AMOUNT:</td>
                            <td style="border-bottom: 1px solid #000000; padding: 5px; text-align: right;">${paidAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #000000; padding: 5px; text-align: left; font-weight: bold;">BILL DUE:</td>
                            <td style="padding: 5px; text-align: center; font-weight: bold; ">${netBillDue.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;
    }

    // STEP C: Construct the complete modular standalone HTML template context



    // ড্রপডাউন সিলেকশন অনুযায়ী হেডিং টেক্সট ডাইনামিক করার লজিক

    let headerTitleText = "";
    if (extractionTargetDocumentSelectionType === "CHALLAN") {
        headerTitleText = "CHALLAN";
    } else {
        headerTitleText = "INVOICE DETAILS";
    }



    const previewDocumentContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview - ${extractionTargetDocumentSelectionType} #${invoiceNo}</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background-color: #525659;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .action-bar {
                    width: 190mm;
                    background: #2f3542;
                    padding: 12px 20px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                }
                .bar-title {
                    color: #ffffff;
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                }
                .btn-download {
                    background-color: #2ed573;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .btn-download:hover {
                    background-color: #26af5f;
                }
                #print_area {
                    width: 190mm;
                    min-height: 265mm;
                    background: #ffffff;
                    padding: 15mm 10mm;
                    box-sizing: border-box;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                }
                .no-wrap-label {
                    white-space: nowrap;
                }
            </style>
        </head>

        <body>
            <div class="action-bar">
                <h3 class="bar-title">Document Preview Mode (Verify details before saving)</h3>
                <button class="btn-download" id="download_trigger_btn">Download PDF Document</button>
            </div>

            <div id="print_area">
                <div style="text-align: center; margin-top: 40px; margin-bottom:20px;">
                    <h2 style="margin: 0; font-size: 20px; text-decoration: underline; letter-spacing: 1px; font-weight: 700; color: #000000; text-transform: uppercase;">${headerTitleText}</h2>
                </div>

                <table style="width: 100%; margin-bottom: 20px; font-size: 13px; line-height: 1.6; border: none; border-collapse: collapse; color: #000000;">
                    <tr>
                        <td class="no-wrap-label" style="width: 18%; font-weight: bold; vertical-align: top; padding: 3px 0;">CUSTOMER NAME</td>
                        <td style="width: 42%; vertical-align: top; padding: 3px 0;">: ${customerName}</td>
                        <td class="no-wrap-label" style="width: 16%; font-weight: bold; vertical-align: top; text-align: left; padding: 3px 0; padding-left: 15px;">INVOICE NO.</td>
                        <td style="width: 24%; vertical-align: top; padding: 3px 0;">: ${invoiceNo}</td>
                    </tr>

                    <tr>
                        <td class="no-wrap-label" style="font-weight: bold; vertical-align: top; padding: 3px 0;">ADDRESS</td>
                        <td style="vertical-align: top; white-space: pre-line; padding: 3px 0;">: ${customerAddress}</td>
                        <td class="no-wrap-label" style="font-weight: bold; vertical-align: top; text-align: left; padding: 3px 0; padding-left: 15px;">PO. NO.</td>
                        <td style="vertical-align: top; padding: 3px 0;">: ${poNo}</td>
                    </tr>

                    <tr>
                        <td class="no-wrap-label" style="font-weight: bold; vertical-align: top; padding: 3px 0;">PHONE</td>
                        <td style="vertical-align: top; padding: 3px 0;">: ${clientPhone}</td>
                        <td class="no-wrap-label" style="font-weight: bold; vertical-align: top; text-align: left; padding: 3px 0; padding-left: 15px;">DATE</td>
                        <td style="vertical-align: top; padding: 3px 0;">: ${docDate}</td>
                    </tr>

                    <tr>
                        <td class="no-wrap-label" style="font-weight: bold; vertical-align: top; padding: 3px 0;">PREPARED BY</td>
                        <td style="vertical-align: top; padding: 3px 0;">: ${preparedBy}</td>
                        <td colspan="2"></td>
                    </tr>
                </table>

               <table style="width: 100%; border-collapse: collapse; margin: 0; font-size: 12px; color: #000000; border: 1px solid #000000; box-sizing: border-box;">
                    <thead>
                        <tr style="text-align: center; font-weight: bold; background-color: #ffffff; height: 30px;">
                            <th style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; width: 6%; ">S.N.</th>
                            <th style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; width: 40%;">ITEM NAME</th>
                            <th style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; width: 12%;">QUANTITY</th>
                            <th style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; width: 10%;">UNIT</th>
                            ${extractionTargetDocumentSelectionType === "INVOICE" ? `
                            <th style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; width: 15%; text-align: center; padding-right: 5px;">RATE (TK)</th>
                            <th style="border-bottom: 1px solid #000000; width: 17%; text-align: center; padding-right: 5px;">AMOUNT (TK)</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsMarkup}
                    </tbody>
                </table>
                ${summarySectionHtml}
                <div style="margin-top: 100px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #000000; padding: 0 5px;">
                    <div style="width: 30%; border-top: 1px solid #000000; padding-top: 6px; text-align: center;">CUSTOMER SIGNATURE</div>
                    <div style="width: 30%; border-top: 1px solid #000000; padding-top: 6px; text-align: center;">AUTHORIZED SIGNATURE</div>
                </div>
            </div>



            <script>
                document.getElementById("download_trigger_btn").addEventListener("click", function() {
                    this.innerText = "Downloading...";
                    this.disabled = true;
                    const element = document.getElementById("print_area");
                    const opt = {
                        margin:       [10, 10, 10, 10],
                        filename:     "${extractionTargetDocumentSelectionType}_REF_${invoiceNo}_LOG.pdf",
                        image:        { type: 'jpeg', quality: 1.0 },
                        html2canvas:  { scale: 2, useCORS: true, logging: false },
                        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };

                    html2pdf().set(opt).from(element).save().then(() => {
                        document.getElementById("download_trigger_btn").innerText = "Download PDF Document";
                        document.getElementById("download_trigger_btn").disabled = false;
                    }).catch(err => {
                        console.error(err);
                        alert("Error generating PDF!");
                    });
                });
            </script>
        </body>
        </html>
    `;

    previewWindow.document.open();
    previewWindow.document.write(previewDocumentContent);
    previewWindow.document.close();

    submitBtnPointer.innerText = originalBtnText;
    submitBtnPointer.disabled = false;

});