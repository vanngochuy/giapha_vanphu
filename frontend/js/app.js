/**
 * Gia Phả Họ Văn Phú - Main Application Manager
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- Theme Toggle Logic ---
    const btnThemeToggle = document.getElementById("btnThemeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 6 && currentHour < 18;
    
    let currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
        currentTheme = isDayTime ? "light" : "dark"; // Default theo thời gian thực (6h sáng đến 6h tối là sáng)
    }

    const applyTheme = (theme) => {
        if (theme === "light") {
            document.body.classList.add("light-theme");
            if(themeIcon) themeIcon.className = "fa-solid fa-moon"; // Hiện mặt trăng để bấm tắt light mode
        } else {
            document.body.classList.remove("light-theme");
            if(themeIcon) themeIcon.className = "fa-solid fa-sun"; // Hiện mặt trời để bật light mode
        }
        localStorage.setItem("theme", theme);
    };

    applyTheme(currentTheme);
    
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener("click", () => {
            currentTheme = currentTheme === "light" ? "dark" : "light";
            applyTheme(currentTheme);
        });
    }

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
    document.getElementById("btnFitScreen").addEventListener("click", () => treeVisualizer.fitToScreen()); // BUG-005
    document.getElementById("btnExpandAll").addEventListener("click", () => treeVisualizer.expandAll());
    document.getElementById("btnCollapseAll").addEventListener("click", () => treeVisualizer.collapseAll());

    // Click vào vùng trống trên canvas → đóng Side Panel về lề phải
    document.getElementById("treeSvg").addEventListener("click", (e) => {
        // Chỉ đóng nếu click vào nền (không phải node card)
        if (!e.target.closest(".node-card")) {
            hideSidePanel();
            d3.selectAll(".node-card").classed("selected", false);
        }
    });

    // Phím Escape → đóng Side Panel
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideSidePanel();
            d3.selectAll(".node-card").classed("selected", false);
        }
    });
    
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

    // Status is edited directly in the member profile card.
    const memberStatusSelect = document.getElementById("memberStatus");
    if (memberStatusSelect) {
        memberStatusSelect.addEventListener("change", saveMemberStatus);
    }

    // Search Input Setup
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    // BUG-004 Fix: Helper normalize tiếng Việt bỏ dấu
    const normalize = (str) => str
        ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";

    searchInput.addEventListener("input", (e) => {
        const rawQuery = e.target.value.trim();
        const query = normalize(rawQuery);
        if (!query) {
            searchResults.classList.add("hidden");
            searchResults.innerHTML = "";
            return;
        }

        const filtered = allMembersList.filter(m => 
            normalize(m.full_name).includes(query) ||
            normalize(m.id).includes(query) ||
            (m.branch_name && normalize(m.branch_name).includes(query)) ||
            (m.notes && normalize(m.notes).includes(query))
        );

        renderSearchResults(filtered);
    });

    // UX-005 Fix: Đóng dropdown khi bấm Escape
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            searchResults.classList.add("hidden");
            searchInput.blur();
        }
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

    // UX-004: helper ẩn row nếu giá trị rỗng (với null-guard phòng element bị xóa khỏi HTML)
    function setInfoRow(rowId, value, emptyText) {
        const el = document.getElementById(rowId);
        if (!el) return; // Guard: element không tồn tại trong DOM
        const row = el.closest(".info-row");
        if (value && value !== emptyText) {
            el.innerText = value;
            if (row) row.style.display = "";
        } else {
            el.innerText = "";
            if (row) row.style.display = "none";
        }
    }

    function showMemberDetail(m) {
        if (!m) return;
        
        document.getElementById("memberName").innerText = m.full_name || "---";
        document.getElementById("badgeGen").innerText = `Đời ${m.generation}`;
        setMemberStatusControl(m.id, m.status);
        
        document.getElementById("infoParent").innerText = m.parent_id ? getMemberNameById(m.parent_id) : "(Thuỷ Tổ)";
        
        setInfoRow("infoOrder", m.order_in_family ? `Con thứ ${m.order_in_family}` : null, null);
        setInfoRow("infoSpouse", m.spouse, null);
        renderChildren(m.id);
        
        setInfoRow("infoBirthYear", m.birth_year, null);
        setInfoRow("infoDeathLunar", m.death_date_lunar, null);
        setInfoRow("infoBurial", m.burial_place && m.burial_place !== "Chưa cập nhật" ? m.burial_place : null, null);
        setInfoRow("infoNotes", m.notes, null);

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

    function setMemberStatusControl(memberId, status) {
        if (!memberStatusSelect) return;
        const normalizedStatus = status === "Đã mất" ? "Đã mất" : "Còn sống";
        memberStatusSelect.dataset.memberId = memberId;
        memberStatusSelect.value = normalizedStatus;
        memberStatusSelect.classList.toggle("is-deceased", normalizedStatus === "Đã mất");
        memberStatusSelect.disabled = false;
    }

    async function saveMemberStatus(event) {
        const statusSelect = event.currentTarget;
        const memberId = statusSelect.dataset.memberId;
        const member = allMembersList.find(item => item.id === memberId);

        if (!memberId || !member) return;

        const previousStatus = member.status === "Đã mất" ? "Đã mất" : "Còn sống";
        const nextStatus = statusSelect.value;
        if (nextStatus === previousStatus) return;

        statusSelect.disabled = true;
        statusSelect.classList.add("is-saving");

        try {
            const response = await fetch(`${apiBaseUrl}/api/members/${encodeURIComponent(memberId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedMember = await response.json();
            Object.assign(member, updatedMember);
            setMemberStatusControl(memberId, updatedMember.status);
            treeVisualizer.refreshMember(memberId);
        } catch (error) {
            console.error("Error updating member status:", error);
            member.status = previousStatus;
            setMemberStatusControl(memberId, previousStatus);
            alert("Không thể cập nhật trạng thái thành viên. Vui lòng thử lại.");
        } finally {
            statusSelect.classList.remove("is-saving");
            statusSelect.disabled = false;
        }
    }

    function renderChildren(memberId) {
        const childrenRow = document.getElementById("infoChildrenRow");
        const childrenList = document.getElementById("infoChildren");
        if (!childrenRow || !childrenList) return;

        const children = allMembersList
            .filter(member => member.parent_id === memberId)
            .sort((a, b) => {
                const aOrder = a.order_in_family ?? Number.MAX_SAFE_INTEGER;
                const bOrder = b.order_in_family ?? Number.MAX_SAFE_INTEGER;
                return aOrder - bOrder || a.full_name.localeCompare(b.full_name, "vi");
            });

        childrenList.replaceChildren();

        if (children.length === 0) {
            const emptyItem = document.createElement("li");
            emptyItem.className = "children-list-empty";
            emptyItem.innerText = "Chưa có thông tin con.";
            childrenList.appendChild(emptyItem);
        } else {
            children.forEach(child => {
                const childItem = document.createElement("li");
                childItem.className = "children-list-item";
                const ordinal = child.order_in_family ? `Con thứ ${child.order_in_family}: ` : "";
                childItem.innerText = `${ordinal}${child.full_name}`;
                childrenList.appendChild(childItem);
            });
        }

        childrenRow.style.display = "";
    }

    function hideSidePanel() {
        document.getElementById("sidePanel").classList.add("hidden");
    }

    function getMemberNameById(id) {
        const found = allMembersList.find(m => m.id === id);
        return found ? found.full_name : id; // Chỉ hiển thị tên, bỏ mã VP-XXX
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
