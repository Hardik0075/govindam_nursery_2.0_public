// Admin Dashboard functionality for Govindam Nursery

let customers = [];
let emailConfig = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreen();
    loadCustomers();
    loadEmailConfig();
    setupEventListeners();
    renderCustomerTable();
    updateStats();
});

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    
    if (!loadingScreen || !progressFill) return;
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove from DOM after animation completes
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 500);
        }
    }, 100);
}

function setupEventListeners() {
    // CSV file input change
    document.getElementById('csvFile').addEventListener('change', handleFileSelect);
    
    // Customer form submission
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
    
    // Add form data persistence
    setupFormPersistence();
    
    // Add beforeunload warning
    window.addEventListener('beforeunload', function(e) {
        if (hasFormData()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved form data. Are you sure you want to leave?';
            return e.returnValue;
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = `Selected: ${file.name}`;
        document.getElementById('processBtn').style.display = 'inline-block';
    }
}

function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a CSV file first.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            const newCustomers = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    if (values.length >= headers.length) {
                        const customer = {};
                        headers.forEach((header, index) => {
                            customer[header] = values[index];
                        });
                        newCustomers.push(customer);
                    }
                }
            }
            
            // Merge with existing customers
            customers = [...customers, ...newCustomers];
            saveCustomers();
            renderCustomerTable();
            updateStats();
            
            showNotification(`Successfully imported ${newCustomers.length} customers from CSV.`, 'success');
            document.getElementById('fileName').textContent = '';
            document.getElementById('processBtn').style.display = 'none';
            fileInput.value = '';
            
        } catch (error) {
            showNotification('Error processing CSV file. Please check the format.', 'error');
            console.error('CSV processing error:', error);
        }
    };
    
    reader.readAsText(file);
}

function handleCustomerSubmit(event) {
    event.preventDefault();
    
    // Get plant selections
    const plantEntries = document.querySelectorAll('.plant-entry');
    const plantSelections = [];
    let totalPlantCount = 0;
    
    plantEntries.forEach(entry => {
        const plantSelect = entry.querySelector('.plant-select');
        const quantityInput = entry.querySelector('.plant-quantity');
        
        if (plantSelect.value && quantityInput.value) {
            plantSelections.push({
                plant: plantSelect.value,
                quantity: parseInt(quantityInput.value)
            });
            totalPlantCount += parseInt(quantityInput.value);
        }
    });
    
    if (plantSelections.length === 0) {
        showNotification('Please select at least one plant.', 'error');
        return;
    }
    
    // Update the plant count field with calculated total
    document.getElementById('customerPlantCount').value = totalPlantCount;
    
    const customer = {
        Name: document.getElementById('customerName').value,
        Phone: document.getElementById('customerPhone').value,
        Email: document.getElementById('customerEmail').value,
        Purchase_Details: document.getElementById('customerPurchase').value,
        Plant_Count: totalPlantCount,
        Plant_Selections: plantSelections,
        Purchase_Date: document.getElementById('customerDate').value,
        Carbon_Offset_kg: calculateCarbonOffset(totalPlantCount),
        Status: 'Pending'
    };
    
    customers.push(customer);
    saveCustomers();
    renderCustomerTable();
    updateStats();
    
    // Reset form
    event.target.reset();
    resetPlantEntries();
    showNotification('Customer added successfully!', 'success');
    
    // Clear any stored form data
    clearFormData();
}

function calculateCarbonOffset(plantCount) {
    // Average carbon offset per plant (kg CO₂/year)
    const avgOffset = 20;
    return plantCount * avgOffset;
}

function addPlantEntry() {
    const plantEntriesContainer = document.getElementById('plantEntries');
    const newEntry = document.createElement('div');
    newEntry.className = 'plant-entry';
    newEntry.innerHTML = `
        <div class="plant-entry-row">
            <div class="form-group">
                <label>Plant Name</label>
                <select class="plant-select" required>
                    <option value="">Select a plant</option>
                    <option value="Mango">Mango</option>
                    <option value="Guava">Guava</option>
                    <option value="Pomegranate">Pomegranate</option>
                    <option value="Orange">Orange</option>
                    <option value="Lichi">Lichi</option>
                    <option value="Neem">Neem</option>
                    <option value="Poplar">Poplar</option>
                    <option value="Eucalyptus">Eucalyptus</option>
                    <option value="Moringa">Moringa</option>
                    <option value="Arjun">Arjun</option>
                    <option value="Ficus">Ficus</option>
                    <option value="MoneyPlant">Money Plant</option>
                    <option value="Ashok">Ashok</option>
                    <option value="BottleBrush">Bottle Brush</option>
                    <option value="SilverOak">Silver Oak</option>
                    <option value="Tulsi">Tulsi</option>
                    <option value="Aonla">Aonla</option>
                    <option value="BelPatra">Bel Patra</option>
                    <option value="Chandan">Chandan</option>
                    <option value="Jamun">Jamun</option>
                    <option value="Lemon">Lemon</option>
                    <option value="Gulmohar">Gulmohar</option>
                    <option value="Termelia">Termelia</option>
                    <option value="Conocarpus">Conocarpus</option>
                    <option value="Mogra">Mogra</option>
                    <option value="Ratrani">Ratrani</option>
                    <option value="MadhuKamini">Madhu Kamini</option>
                    <option value="RaiBel">Rai Bel</option>
                    <option value="Rose">Rose</option>
                    <option value="Chameli">Chameli</option>
                            <option value="Gudahal">Gudahal</option>
                            <option value="DoubleChandani">Double Chandani</option>
                            <option value="MadhuMalati">Madhu Malati</option>
                            <option value="Tikoma">Tikoma</option>
                            <option value="Voganvilia">Voganvilia</option>
                            <option value="ChampaRed">Champa Red</option>
                            <option value="ChampaWhite">Champa White</option>
                            <option value="FoxtailPalm">Foxtail Palm</option>
                            <option value="FishtailPalm">Fishtail Palm</option>
                            <option value="ChinesePalm">Chinese Palm</option>
                            <option value="ChampionPalm">Champion Palm</option>
                            <option value="PhoenixPalm">Phoenix Palm</option>
                </select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="plant-quantity" min="1" value="1" required>
            </div>
            <button type="button" class="remove-plant-btn" onclick="removePlantEntry(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    plantEntriesContainer.appendChild(newEntry);
}

function removePlantEntry(button) {
    const plantEntriesContainer = document.getElementById('plantEntries');
    const entries = plantEntriesContainer.querySelectorAll('.plant-entry');
    
    if (entries.length > 1) {
        button.closest('.plant-entry').remove();
    } else {
        showNotification('At least one plant entry is required.', 'error');
    }
}

function resetPlantEntries() {
    const plantEntriesContainer = document.getElementById('plantEntries');
    plantEntriesContainer.innerHTML = `
        <div class="plant-entry">
            <div class="plant-entry-row">
                <div class="form-group">
                    <label>Plant Name</label>
                    <select class="plant-select" required>
                        <option value="">Select a plant</option>
                        <option value="Mango">Mango</option>
                        <option value="Guava">Guava</option>
                        <option value="Pomegranate">Pomegranate</option>
                        <option value="Orange">Orange</option>
                        <option value="Lichi">Lichi</option>
                        <option value="Neem">Neem</option>
                        <option value="Poplar">Poplar</option>
                        <option value="Eucalyptus">Eucalyptus</option>
                        <option value="Moringa">Moringa</option>
                        <option value="Arjun">Arjun</option>
                        <option value="Ficus">Ficus</option>
                        <option value="MoneyPlant">Money Plant</option>
                        <option value="Ashok">Ashok</option>
                        <option value="BottleBrush">Bottle Brush</option>
                        <option value="SilverOak">Silver Oak</option>
                        <option value="Tulsi">Tulsi</option>
                        <option value="Aonla">Aonla</option>
                        <option value="BelPatra">Bel Patra</option>
                        <option value="Chandan">Chandan</option>
                        <option value="Jamun">Jamun</option>
                        <option value="Lemon">Lemon</option>
                        <option value="Gulmohar">Gulmohar</option>
                        <option value="Termelia">Termelia</option>
                        <option value="Conocarpus">Conocarpus</option>
                        <option value="Mogra">Mogra</option>
                        <option value="Ratrani">Ratrani</option>
                        <option value="MadhuKamini">Madhu Kamini</option>
                        <option value="RaiBel">Rai Bel</option>
                        <option value="Rose">Rose</option>
                        <option value="Chameli">Chameli</option>
                        <option value="Gudahal">Gudahal</option>
                        <option value="DoubleChandani">Double Chandani</option>
                        <option value="MadhuMalati">Madhu Malati</option>
                        <option value="Tikoma">Tikoma</option>
                        <option value="Voganvilia">Voganvilia</option>
                        <option value="ChampaRed">Champa Red</option>
                        <option value="ChampaWhite">Champa White</option>
                        <option value="FoxtailPalm">Foxtail Palm</option>
                        <option value="FishtailPalm">Fishtail Palm</option>
                        <option value="ChinesePalm">Chinese Palm</option>
                        <option value="ChampionPalm">Champion Palm</option>
                        <option value="PhoenixPalm">Phoenix Palm</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="plant-quantity" min="1" value="1" required>
                </div>
                <button type="button" class="remove-plant-btn" onclick="removePlantEntry(this)">
                    <i class="fas fa-trash"></i>
                </button>
                </div>
            </div>
        </div>
    `;
}

function renderCustomerTable() {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = customers.map((customer, index) => `
        <tr>
            <td>${customer.Name}</td>
            <td>${customer.Phone}</td>
            <td>${customer.Email || 'N/A'}</td>
            <td>
                ${customer.Purchase_Details || 'N/A'}
                ${customer.Plant_Selections ? `<br><small><strong>Plants:</strong> ${customer.Plant_Selections.map(p => `${p.plant} (${p.quantity})`).join(', ')}</small>` : ''}
            </td>
            <td>${customer.Plant_Count}</td>
            <td>${customer.Carbon_Offset_kg} kg</td>
            <td>
                <span class="status-badge ${customer.Status.toLowerCase()}">${customer.Status}</span>
            </td>
            <td>
                <button class="action-btn btn-generate" onclick="generateCertificate(${index})">
                    <i class="fas fa-certificate"></i> Certificate
                </button>
                ${customer.Email ? `<button class="action-btn btn-email" onclick="sendEmail(${index})">
                    <i class="fas fa-envelope"></i> Email
                </button>` : ''}
                <button class="action-btn btn-generate" onclick="deleteCustomer(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function generateCertificate(customerIndex) {
    const customer = customers[customerIndex];
    
    // Create certificate data
    const certificateData = {
        customerName: customer.Name,
        plantCount: customer.Plant_Count,
        carbonOffset: customer.Carbon_Offset_kg,
        purchaseDate: customer.Purchase_Date,
        certificateId: generateCertificateId(),
        status: 'Generated'
    };
    
    // Update customer status
    customer.Status = 'Certificate Generated';
    customer.Certificate_ID = certificateData.certificateId;
    customer.Certificate_Generated_Date = new Date().toISOString().split('T')[0];
    
    saveCustomers();
    renderCustomerTable();
    updateStats();
    
    // Generate and download certificate
    downloadCertificate(certificateData);
    
    showNotification(`Certificate generated for ${customer.Name}`, 'success');
}

function generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `GN-${timestamp}-${random}`.toUpperCase();
}

function downloadCertificate(certificateData) {
    // Create certificate HTML
    const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Carbon Offset Certificate - ${certificateData.customerName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .certificate { max-width: 800px; margin: 0 auto; border: 3px solid #4a7c59; border-radius: 15px; padding: 40px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #4a7c59, #2d5a3d); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 2rem; }
                .title { font-size: 2.5rem; font-weight: 700; color: #2c5530; margin-bottom: 10px; }
                .subtitle { font-size: 1.1rem; color: #6c757d; }
                .body { text-align: center; margin-bottom: 40px; }
                .name { font-size: 2.2rem; font-weight: 600; color: #2c5530; margin: 20px 0; background: linear-gradient(135deg, #2c5530, #4a7c59); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 10px 20px; border: 2px solid #4a7c59; border-radius: 10px; display: inline-block; }
                .offset { font-size: 2rem; font-weight: 700; color: #28a745; margin: 20px 0; background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 20px 40px; border-radius: 15px; border: 2px solid #28a745; }
                .meta { display: flex; justify-content: space-between; margin: 30px 0; padding: 20px; background: rgba(74, 124, 89, 0.05); border-radius: 10px; font-size: 0.9rem; color: #495057; }
                .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .signatures { display: flex; gap: 60px; }
                .sig-line { text-align: center; }
                .sig-line::before { content: ''; display: block; width: 120px; height: 2px; background: #4a7c59; margin-bottom: 10px; }
                .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 4rem; color: rgba(74, 124, 89, 0.08); font-weight: 700; pointer-events: none; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <div class="watermark">GOVINDAM NURSERY</div>
                <div class="header">
                    <div class="logo">🌱</div>
                    <h1 class="title">Govindam Nursery and Farms</h1>
                    <p class="subtitle">Carbon Offset Certificate</p>
                </div>
                <div class="body">
                    <p>This is to certify that</p>
                    <h3 class="name">${certificateData.customerName}</h3>
                    <p>has planted/pledged</p>
                    <h4>${certificateData.plantCount} plant(s)</h4>
                    <p>Estimated yearly carbon offset:</p>
                    <div class="offset">~ ${certificateData.carbonOffset} kg CO₂ / year</div>
                    <p>This certificate acknowledges your contribution to carbon sequestration.</p>
                    
                    <div class="meta">
                        <span>Certificate ID: ${certificateData.certificateId}</span>
                        <span>Date: ${new Date(certificateData.purchaseDate).toLocaleDateString()}</span>
                        <span>Status: Verified</span>
                    </div>
                </div>
                <div class="footer">
                    <div class="signatures">
                        <div class="sig-line">
                            <div>Govindam Nursery</div>
                            <div>Authorized Signature</div>
                        </div>
                        <div class="sig-line">
                            <div>Carbon Offset Program</div>
                            <div>Program Director</div>
                        </div>
                    </div>
                    <div>
                        <div>Certificate ID: ${certificateData.certificateId}</div>
                        <div>Verification: Verified</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certificateData.customerName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function sendEmail(customerIndex) {
    const customer = customers[customerIndex];
    
    if (!customer.Email) {
        showNotification('No email address available for this customer.', 'error');
        return;
    }
    
    // Simulate email sending (in real implementation, this would connect to an email service)
    showNotification(`Email notification sent to ${customer.Email}`, 'success');
    
    // Update customer status
    customer.Status = 'Email Sent';
    customer.Email_Sent_Date = new Date().toISOString().split('T')[0];
    
    saveCustomers();
    renderCustomerTable();
    updateStats();
}

function sendAllEmails() {
    const customersWithEmail = customers.filter(c => c.Email);
    
    if (customersWithEmail.length === 0) {
        showNotification('No customers have email addresses.', 'error');
        return;
    }
    
    customersWithEmail.forEach((customer, index) => {
        setTimeout(() => {
            sendEmail(customers.indexOf(customer));
        }, index * 1000); // Send emails with 1-second delay
    });
    
    showNotification(`Sending emails to ${customersWithEmail.length} customers...`, 'success');
}

function generateAllCertificates() {
    const pendingCustomers = customers.filter(c => c.Status === 'Pending');
    
    if (pendingCustomers.length === 0) {
        showNotification('No pending customers to generate certificates for.', 'error');
        return;
    }
    
    pendingCustomers.forEach((customer, index) => {
        setTimeout(() => {
            generateCertificate(customers.indexOf(customer));
        }, index * 500); // Generate certificates with 0.5-second delay
    });
    
    showNotification(`Generating certificates for ${pendingCustomers.length} customers...`, 'success');
}

function deleteCustomer(customerIndex) {
    if (confirm(`Are you sure you want to delete ${customers[customerIndex].Name}?`)) {
        customers.splice(customerIndex, 1);
        saveCustomers();
        renderCustomerTable();
        updateStats();
        showNotification('Customer deleted successfully.', 'success');
    }
}

function exportCustomerData() {
    const csvContent = convertToCSV(customers);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `govindam_nursery_customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Customer data exported successfully.', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    // Define custom headers to ensure proper order and formatting
    const headers = [
        'Name', 'Phone', 'Email', 'Purchase_Details', 'Plant_Count', 
        'Plant_Selections', 'Purchase_Date', 'Carbon_Offset_kg', 'Status'
    ];
    
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            let value = row[header] || '';
            
            // Handle plant selections specially
            if (header === 'Plant_Selections' && row.Plant_Selections) {
                value = row.Plant_Selections.map(p => `${p.plant}:${p.quantity}`).join(';');
            }
            
            // Handle arrays and objects
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function saveEmailConfig() {
    emailConfig = {
        smtpEmail: document.getElementById('smtpEmail').value,
        smtpPassword: document.getElementById('smtpPassword').value,
        emailTemplate: document.getElementById('emailTemplate').value
    };
    
    localStorage.setItem('govindam_email_config', JSON.stringify(emailConfig));
    showNotification('Email configuration saved successfully.', 'success');
}

function loadEmailConfig() {
    const saved = localStorage.getItem('govindam_email_config');
    if (saved) {
        emailConfig = JSON.parse(saved);
        document.getElementById('smtpEmail').value = emailConfig.smtpEmail || '';
        document.getElementById('smtpPassword').value = emailConfig.smtpPassword || '';
        document.getElementById('emailTemplate').value = emailConfig.emailTemplate || '';
    }
}

function loadCustomers() {
    const saved = localStorage.getItem('govindam_customers');
    if (saved) {
        customers = JSON.parse(saved);
    } else {
        // Load sample data from CSV if no saved data
        customers = [];
    }
}

function saveCustomers() {
    localStorage.setItem('govindam_customers', JSON.stringify(customers));
}

function updateStats() {
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalPlants').textContent = customers.reduce((sum, c) => sum + (parseInt(c.Plant_Count) || 0), 0);
    document.getElementById('totalCarbonOffset').textContent = customers.reduce((sum, c) => sum + (parseInt(c.Carbon_Offset_kg) || 0), 0);
    document.getElementById('pendingCertificates').textContent = customers.filter(c => c.Status === 'Pending').length;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Form persistence functions to prevent accidental data loss
function setupFormPersistence() {
    const form = document.getElementById('customerForm');
    
    // Save form data on input changes
    form.addEventListener('input', saveFormData);
    
    // Restore form data on page load
    restoreFormData();
}

function saveFormData() {
    const formData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPurchase: document.getElementById('customerPurchase').value,
        customerDate: document.getElementById('customerDate').value,
        customerPlantCount: document.getElementById('customerPlantCount').value
    };
    
    localStorage.setItem('govindam_form_data', JSON.stringify(formData));
}

function restoreFormData() {
    const saved = localStorage.getItem('govindam_form_data');
    if (saved) {
        const formData = JSON.parse(saved);
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element && formData[key]) {
                element.value = formData[key];
            }
        });
    }
}

function clearFormData() {
    localStorage.removeItem('govindam_form_data');
}

function hasFormData() {
    const form = document.getElementById('customerForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    for (let input of inputs) {
        if (input.value && input.type !== 'submit') {
            return true;
        }
    }
    
    return false;
}
