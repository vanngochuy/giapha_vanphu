/**
 * Gia Phả Họ Văn Phú - Main Application Manager
 */
document.addEventListener("DOMContentLoaded", () => {
    let treeVisualizer = null;
    let allMembersList = [];
    let treeHierarchyData = null;

    const apiBaseUrl = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
        ? ""
        : ""; // Use relative path for production hosting

    // Initialize D3 Visualizer
    treeVisualizer = new TreeVisualizer("treeContainer", {
        onNodeClick: (memberData) => {
            showMemberDetail(memberData);
        }
    });

    // Fetch Family Tree Data
    fetchFamilyTree();

    // Event Listeners for Controls
    document.getElementById("btnZoomIn").addEventListener("click", () => treeVisualizer.zoomIn());
    document.getElementById("btnZoomOut").addEventListener("click", () => treeVisualizer.zoomOut());
    document.getElementById("btnResetZoom").addEventListener("click", () => treeVisualizer.resetZoom());
    document.getElementById("btnExpandAll").addEventListener("click", () => treeVisualizer.expandAll());
    document.getElementById("btnCollapseAll").addEventListener("click", () => treeVisualizer.collapseAll());
    
    // PDF Export
    document.getElementById("btnExportPDF").addEventListener("click", () => {
        PDFExporter.exportTreeToPDF("treeContainer", "GiaPha_VanPhu_Tree.pdf");
    });

    // Side Panel Toggle & Close
    document.getElementById("btnClosePanel").addEventListener("click", () => hideSidePanel());
    document.getElementById("btnToggleSidePanel").addEventListener("click", () => {
        const sidePanel = document.getElementById("sidePanel");
        sidePanel.classList.toggle("hidden");
    });

    // Search Input Setup
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            searchResults.classList.add("hidden");
            searchResults.innerHTML = "";
            return;
        }

        const filtered = allMembersList.filter(m => 
            m.full_name.toLowerCase().includes(query) ||
            m.id.toLowerCase().includes(query) ||
            (m.branch_name && m.branch_name.toLowerCase().includes(query)) ||
            (m.notes && m.notes.toLowerCase().includes(query))
        );

        renderSearchResults(filtered);
    });

    // Close search dropdown on outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-box")) {
            searchResults.classList.add("hidden");
        }
    });

    // Fetch Tree Hierarchy
    async function fetchFamilyTree() {
        showLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/members/tree`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            
            if (json.success && json.data && json.data.length > 0) {
                treeHierarchyData = json.data[0]; // Root node (Ông Văn Phú Dưỡng)
                
                // Build flat list for search
                allMembersList = [];
                flattenTree(treeHierarchyData, allMembersList);
                
                document.getElementById("totalMembersCount").innerText = `Tổng số: ${allMembersList.length} thành viên`;
                
                // Render tree
                treeVisualizer.render(treeHierarchyData);
            }
        } catch (error) {
            console.error("Error fetching family tree:", error);
            alert("Không thể kết nối API Gia Phả. Vui lòng kiểm tra lại server backend.");
        } finally {
            showLoading(false);
        }
    }

    function flattenTree(node, list) {
        if (!node) return;
        list.push(node);
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => flattenTree(child, list));
        }
    }

    function renderSearchResults(results) {
        searchResults.innerHTML = "";
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="search-result-item"><span class="item-meta">Không tìm thấy thành viên nào.</span></div>`;
        } else {
            results.slice(0, 10).forEach(m => {
                const item = document.createElement("div");
                item.className = "search-result-item";
                item.innerHTML = `
                    <div class="item-name">${m.full_name} (${m.id})</div>
                    <div class="item-meta">Đời ${m.generation} | ${m.branch_name || 'Họ Văn Phú'} | ${m.spouse ? 'Vợ/Chồng: ' + m.spouse : ''}</div>
                `;
                item.addEventListener("click", () => {
                    searchResults.classList.add("hidden");
                    searchInput.value = m.full_name;
                    treeVisualizer.focusNode(m.id);
                    showMemberDetail(m);
                });
                searchResults.appendChild(item);
            });
        }
        searchResults.classList.remove("hidden");
    }

    function showMemberDetail(m) {
        if (!m) return;
        
        document.getElementById("memberName").innerText = m.full_name || "---";
        document.getElementById("badgeGen").innerText = `Đời ${m.generation}`;
        document.getElementById("badgeGender").innerText = m.gender || "Chưa rõ";
        document.getElementById("badgeStatus").innerText = m.status || "Còn sống";
        
        document.getElementById("infoId").innerText = m.id || "---";
        document.getElementById("infoParent").innerText = m.parent_id ? getMemberNameById(m.parent_id) : "(Thuỷ Tổ)";
        document.getElementById("infoOrder").innerText = m.order_in_family ? `Con thứ ${m.order_in_family}` : "---";
        document.getElementById("infoSpouse").innerText = m.spouse || "Không có thông tin";
        document.getElementById("infoBranch").innerText = m.branch_name || "Dòng chính Họ Văn Phú";
        
        document.getElementById("infoBirthYear").innerText = m.birth_year || "Không rõ";
        document.getElementById("infoDeathLunar").innerText = m.death_date_lunar || "Không rõ";
        document.getElementById("infoBurial").innerText = m.burial_place || "Chưa cập nhật";
        document.getElementById("infoNotes").innerText = m.notes || "Không có ghi chú.";

        // Gender avatar icon
        const avatarIcon = document.getElementById("memberAvatarIcon");
        if (m.gender === "Nữ") {
            avatarIcon.className = "fa-solid fa-user-nurse";
            avatarIcon.style.color = "var(--parchment-muted)";
        } else {
            avatarIcon.className = "fa-solid fa-user-tie";
            avatarIcon.style.color = "var(--gold-primary)";
        }

        // Show side panel
        document.getElementById("sidePanel").classList.remove("hidden");
    }

    function hideSidePanel() {
        document.getElementById("sidePanel").classList.add("hidden");
    }

    function getMemberNameById(id) {
        const found = allMembersList.find(m => m.id === id);
        return found ? `${found.full_name} (${found.id})` : id;
    }

    function showLoading(show) {
        const overlay = document.getElementById("loadingOverlay");
        if (show) {
            overlay.classList.remove("hidden");
        } else {
            overlay.classList.add("hidden");
        }
    }
});
