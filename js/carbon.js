// Carbon page logic: render absorption table, calculator, verification and certificate generation

document.addEventListener('DOMContentLoaded', () => {
    const plants = {
        // Fruit Trees
        Mango: 22, Guava: 20, Pomegranate: 19, Orange: 18, Plum: 17, Peach: 18, Pear: 19, Lichi: 21, StarFruit: 16, Jackfruit: 25, Chikoo: 18, Lemon: 15, Mosambi: 16, Jamun: 24, Anjeer: 20, Phalsa: 14,
        // Palm Trees
        FoxtailPalm: 18, FishtailPalm: 16, ChinesePalm: 17, ChampionPalm: 19, PhoenixPalm: 20,
        // Ornamental Trees
        Ficus: 23, Cycus: 14, MoneyPlant: 12, AluBukhara: 18, Moringa: 16, Karanja: 22, Karonda: 15, Ashok: 21, BottleBrush: 19, SilverOak: 26, Termelia: 20, RubberPlant: 24, Chandan: 28, Hariman: 17, Thuja: 16, Conocarpus: 18, PencilPine: 14, Molsri: 19, Cyprus: 15, Imali: 20, DurantaGreen: 13, DurantaGold: 13, ZPlant: 11, Portulaca: 10, Peepal: 28, ButVrix: 22, DragonFruit: 14,
        // Timber Trees
        Sagwan: 30, Poplar: 25, Malabar: 27, Mahaguni: 29, Neem: 26,
        // Medicinal Trees
        Arjun: 24, Parijat: 19, Kachnar: 20, Amaltash: 22, BelPatra: 18, Aonla: 18,
        // Flowering Plants
        Mogra: 12, Ratrani: 13, MadhuKamini: 11, RaiBel: 14, Rose: 10, Chameli: 11, Gudahal: 13, DoubleChandani: 12, MadhuMalati: 11, Tikoma: 15, Voganvilia: 14, ChampaRed: 13, ChampaWhite: 13
    };

    initializeLoadingScreen();
    renderAbsorption(plants);
    populatePlantSelect(plants);
    attachCalculator(plants);
    attachDownload();
    initializeFloatingLabelsCarbon();
    setupMultiCalculator(plants);
    attachPrintPDF();
    addAbsorptionDisclaimer();
});

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    
    if (!loadingScreen || !progressFill) return;
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (isMobile) {
        // Skip loading animation on mobile devices
        loadingScreen.remove();
        return;
    }
    
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

function renderAbsorption(map) {
    const container = document.getElementById('absorptionList');
    if (!container) return;
    
    // Select 8-10 most common plants for display
    const commonPlants = {
        Mango: 22, Guava: 20, Neem: 26, Peepal: 28, Amla: 18, 
        Pomegranate: 19, Orange: 18, Sagwan: 30, Ashok: 21, Ficus: 23
    };
    
    container.innerHTML = Object.entries(commonPlants).map(([name, kg]) => `
        <div class="absorption-item">
            <span><i class="fas fa-tree"></i> ${name}</span>
            <span class="absorption-kg">${kg} kg CO₂ / year</span>
        </div>
    `).join('');
}

function populatePlantSelect(map) {
    const select = document.getElementById('plantType');
    if (!select) return;
    Object.keys(map).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
}

function attachCalculator(map) {
    const form = document.getElementById('offsetForm');
    const result = document.getElementById('offsetResult');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const plant = document.getElementById('plantType').value;
        const count = parseInt(document.getElementById('plantCount').value || '0', 10);
        const name = (document.getElementById('customerName').value || '').trim();
        const phone = (document.getElementById('verificationPhone').value || '').trim();

        const perPlant = map[plant] || 0;
        const yearly = perPlant * count;
        result.innerHTML = yearly > 0 ? `<strong>Estimated Yearly Offset:</strong> ~ ${yearly} kg CO₂` : '';

        // Legitimacy check: look for phone in stored records
        const records = JSON.parse(localStorage.getItem('gn_records') || '[]');
        const found = records.find(r => r.phone === phone);

        if (!found) {
            if (typeof showNotification === 'function') {
                showNotification('Please submit an inquiry or purchase with this phone number before generating a certificate.', 'error');
            }
            buildCertificate({
                eligible: false,
                customerName: name,
                plant,
                count,
                yearly
            });
            return;
        }

        buildCertificate({
            eligible: true,
            customerName: name,
            plant,
            count,
            yearly
        });
    });
}

function buildCertificate({ eligible, customerName, plant, count, yearly }) {
    const card = document.getElementById('certificateCard');
    const body = document.getElementById('certificateBody');
    if (!card || !body) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const certId = 'GN-' + today.getFullYear() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const line2 = eligible ? 'This certificate acknowledges your contribution to carbon sequestration.' : 'Verification pending: complete an inquiry/purchase to validate.';

    body.innerHTML = `
        <p class="cert-line">This is to certify that</p>
        <h3 class="cert-name">${customerName || 'Customer'}</h3>
        <p class="cert-line">has planted/pledged</p>
        <h4 class="cert-count">${count} ${plant} plant(s)</h4>
        <p class="cert-line">Estimated yearly carbon offset:</p>
        <div class="cert-offset">~ ${yearly} kg CO₂ / year</div>
        <p class="cert-small">${line2}</p>
        <div class="cert-meta">
            <span>Certificate ID: ${certId}</span>
            <span>Date: ${dateStr}</span>
            <span>Status: ${eligible ? 'Verified' : 'Pending'}</span>
        </div>
    `;

    card.style.display = 'block';
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function attachDownload() {
    const btn = document.getElementById('downloadCertificate');
    const card = document.getElementById('certificateCard');
    if (!btn || !card) return;
    btn.addEventListener('click', async () => {
        try {
            const canvas = await html2canvas(card);
            const link = document.createElement('a');
            link.download = 'Govindam_Carbon_Offset_Certificate.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error(e);
        }
    });
}

function attachPrintPDF() {
    const btn = document.getElementById('printCertificate');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.print();
    });
}

// Floating label behavior on carbon page
function initializeFloatingLabelsCarbon() {
    const groups = document.querySelectorAll('.offset-form .form-group');
    groups.forEach(group => {
        const input = group.querySelector('.form-input');
        if (!input) return;
        const toggle = () => {
            if (input.value && input.value.toString().trim().length > 0) {
                group.classList.add('focused');
            } else {
                group.classList.remove('focused');
            }
        };
        input.addEventListener('focus', () => group.classList.add('focused'));
        input.addEventListener('blur', toggle);
        input.addEventListener('input', toggle);
        // Initialize state
        toggle();
    });
}

// Multi-plant calculator
function setupMultiCalculator(map) {
    const rowsContainer = document.getElementById('multiRows');
    const addBtn = document.getElementById('addRowBtn');
    const totalEl = document.getElementById('multiTotal');
    if (!rowsContainer || !addBtn) return;

    const createRow = () => {
        const row = document.createElement('div');
        row.className = 'form-row';
        row.innerHTML = `
            <div class="form-group">
                <label class="form-label">Plant</label>
                <select class="form-input multi-plant"></select>
                <div class="form-focus-line"></div>
            </div>
            <div class="form-group">
                <label class="form-label">Count</label>
                <input type="number" min="1" value="1" class="form-input multi-count" />
                <div class="form-focus-line"></div>
            </div>
            <button type="button" class="btn btn-secondary" data-remove>
                <i class="fas fa-times"></i> Remove
            </button>
        `;

        // populate select
        const select = row.querySelector('.multi-plant');
        Object.keys(map).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });

        // floating labels
        const groupEls = row.querySelectorAll('.form-group');
        groupEls.forEach(g => { g.classList.add('focused'); });

        // remove handler
        row.querySelector('[data-remove]').addEventListener('click', () => {
            rowsContainer.removeChild(row);
            updateTotal();
        });

        // recalc on change
        row.addEventListener('input', updateTotal);
        rowsContainer.appendChild(row);
        updateTotal();
    };

    const updateTotal = () => {
        let sum = 0;
        rowsContainer.querySelectorAll('.form-row').forEach(r => {
            const plant = r.querySelector('.multi-plant')?.value;
            const count = parseInt(r.querySelector('.multi-count')?.value || '0', 10);
            if (plant && map[plant]) {
                sum += map[plant] * (isNaN(count) ? 0 : count);
            }
        });
        if (totalEl) totalEl.textContent = sum > 0 ? `Total: ~ ${sum} kg CO₂ / year` : '';
    };

    addBtn.addEventListener('click', createRow);
    // initialize with one row
    createRow();
}

function addAbsorptionDisclaimer() {
    const container = document.getElementById('absorptionList');
    if (!container) return;
    const disclaimer = document.createElement('div');
    disclaimer.className = 'absorption-disclaimer';
    disclaimer.innerHTML = `
        <div class="disclaimer-content">
            <i class="fas fa-info-circle"></i>
            <strong>Note:</strong> Carbon absorption varies based on tree size, species, age, climate, soil conditions, and maintenance. These are average estimates for mature trees.
        </div>
    `;
    container.appendChild(disclaimer);
}


