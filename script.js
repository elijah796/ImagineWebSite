// --- SPREADSHEET CONFIGURATION ---
const SPREADSHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTX9XHN498TdDuCk4W7sVZ25ewHIS--J3zfuJP2iPIKoo0jLqsNFRZ4PQTCqSFHP_CG_tgw0BqlmqeK/pub?gid=0&single=true&output=csv"; 

let sites = []; 

const fallbackSites = [
    { 
        title: "Niice Auto Group", 
        type: "Automotive", 
        desc: "A premium digital showroom and inventory management system for Niice Auto Group.", 
        tags: ["E-Commerce", "Inventory", "Modern UI"],
        url: "https://www.niiceautogroup.com/"
    }
];

// Initialize projects
function renderSites(data) {
    const grid = document.getElementById('siteGrid');
    const noResults = document.getElementById('noResults');
    grid.innerHTML = '';
    
    if (!data || data.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        data.forEach(site => {
            const card = document.createElement('div');
            card.className = 'card p-6 rounded-2xl flex flex-col justify-between h-72 cursor-pointer';
            card.onclick = () => { if(site.url) window.open(site.url, '_blank'); };
            
            const tagsHtml = (site.tags || []).map(tag => `<span class="text-[10px] opacity-50">#${tag.trim()}</span>`).join('');

            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <span class="badge uppercase tracking-tighter font-bold text-[10px]">${site.type || 'Project'}</span>
                        <svg class="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </div>
                    <h3 class="text-2xl mb-2 text-color-white"><Strong>${site.title}</Strong></h3>
                    <p class="text-sm opacity-80 mb-4">${site.desc}</p>
                    <span class="text-xs text-color-white opacity-60 underline">Visit Website &rarr;</span>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                    ${tagsHtml}
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Search logic
function filterSites() {
    const query = document.getElementById('siteSearch').value.toLowerCase();
    const filtered = sites.filter(s => 
        (s.title && s.title.toLowerCase().includes(query)) || 
        (s.type && s.type.toLowerCase().includes(query)) ||
        (s.desc && s.desc.toLowerCase().includes(query))
    );
    renderSites(filtered);
}

// SPA Navigation
function showPage(pageId) {
    const home = document.getElementById('homePage');
    const portfolio = document.getElementById('portfolioPage');
    
    if (pageId === 'home') {
        home.classList.remove('hidden-section');
        portfolio.classList.add('hidden-section');
        window.scrollTo(0, 0);
    } else {
        home.classList.add('hidden-section');
        portfolio.classList.remove('hidden-section');
        window.scrollTo(0, 0);
        renderSites(sites); 
    }
}

// Fetch data from Google Sheets
function loadSpreadsheetData() {
    if (!SPREADSHEET_CSV_URL) {
        console.log("No spreadsheet URL provided. Using fallback data.");
        sites = fallbackSites;
        renderSites(sites);
        return;
    }

    Papa.parse(SPREADSHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            sites = results.data.map(row => ({
                title: row.Title,
                type: row.Type,
                desc: row.Description,
                tags: row.Tags ? row.Tags.split(',').filter(t => t.trim() !== '') : [],
                url: row.URL
            })).filter(site => site.title); 

            renderSites(sites);
        },
        error: function(error) {
            console.error("Error fetching spreadsheet:", error);
            sites = fallbackSites; 
            renderSites(sites);
        }
    });
}

// Initial render
window.onload = () => {
    loadSpreadsheetData();
};