/**
 * Gia Phả Họ Văn Phú - D3.js Interactive Tree Visualizer
 */
class TreeVisualizer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.svg = d3.select("#treeSvg");
        this.onNodeClick = options.onNodeClick || function() {};
        
        this.nodeWidth = 200;
        this.nodeHeight = 80;
        this.duration = 400; // Transition duration in ms

        this.initSvg();
    }

    initSvg() {
        // Clear previous elements
        this.svg.selectAll("*").remove();

        // Create main container group for zooming
        this.g = this.svg.append("g").attr("class", "tree-group");

        // Define Zoom Behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.15, 2.5])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });

        this.svg.call(this.zoom).on("dblclick.zoom", null);
    }

    render(treeData) {
        if (!treeData) return;

        // Convert data into D3 hierarchy
        this.root = d3.hierarchy(treeData, d => d.children);
        this.root.x0 = 0;
        this.root.y0 = 0;

        // Collapse nodes deeper than generation 3 by default for cleaner view
        if (this.root.children) {
            this.root.children.forEach(child => this.collapseDeep(child, 3));
        }

        this.update(this.root);
        this.resetZoom();
    }

    collapseDeep(d, maxDepth) {
        if (d.depth >= maxDepth && d.children) {
            d._children = d.children;
            d.children = null;
        }
        if (d.children) {
            d.children.forEach(c => this.collapseDeep(c, maxDepth));
        }
    }

    update(source) {
        // Declare tree layout (vertical layout: dx = width spacing, dy = height spacing)
        const treeLayout = d3.tree()
            .nodeSize([this.nodeWidth + 40, this.nodeHeight + 80]);

        const treeData = treeLayout(this.root);

        const nodes = treeData.descendants();
        const links = treeData.links();

        // Normalize for fixed-depth spacing
        nodes.forEach(d => {
            d.y = d.depth * (this.nodeHeight + 80);
        });

        // ==================== NODES ====================
        const node = this.g.selectAll("g.node-card")
            .data(nodes, d => d.data.id);

        // Enter new nodes at the parent's previous position
        const nodeEnter = node.enter().append("g")
            .attr("class", "node-card")
            .attr("transform", d => `translate(${source.x0 || source.x},${source.y0 || source.y})`)
            .on("click", (event, d) => {
                event.stopPropagation();
                
                // Highlight selected node
                d3.selectAll(".node-card").classed("selected", false);
                d3.select(event.currentTarget).classed("selected", true);
                
                this.onNodeClick(d.data);
            });

        // Node Rectangle Background
        nodeEnter.append("rect")
            .attr("class", "node-rect")
            .attr("width", this.nodeWidth)
            .attr("height", this.nodeHeight)
            .attr("x", -this.nodeWidth / 2)
            .attr("y", -this.nodeHeight / 2)
            .attr("rx", 8)
            .style("stroke", d => d.data.generation === 1 ? "var(--seal-red)" : null)
            .style("fill", d => d.data.generation === 1 ? "var(--bg-root-node)" : null);

        // Signature seal for Thuỷ Tổ (Top Left - overlapping border)
        const sealGroup = nodeEnter.filter(d => d.data.generation === 1).append("g")
            .attr("transform", `translate(${-this.nodeWidth / 2 - 4}, ${-this.nodeHeight / 2 - 4}) rotate(-8)`);
        
        sealGroup.append("circle")
            .attr("r", 14)
            .attr("fill", "var(--seal-red)");
            
        sealGroup.append("text")
            .attr("x", 0)
            .attr("y", 4)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--seal-text)")
            .attr("font-family", "var(--font-heading)")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .text("VP");

        // Header Line Divider inside Card
        nodeEnter.append("line")
            .attr("class", "node-divider")
            .attr("x1", -this.nodeWidth / 2)
            .attr("y1", -this.nodeHeight / 2 + 25)
            .attr("x2", this.nodeWidth / 2)
            .attr("y2", -this.nodeHeight / 2 + 25)
            .attr("stroke", "var(--gold-border)");

        // Generation Badge Text (Top Left)
        nodeEnter.append("text")
            .attr("x", -this.nodeWidth / 2 + 12)
            .attr("y", -this.nodeHeight / 2 + 17)
            .attr("fill", "var(--gold-primary)")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            .attr("font-family", "var(--font-mono)")
            .text(d => `Đời ${d.data.generation}`);

        // Expand/Collapse Indicator Badge (Top Right)
        nodeEnter.append("text")
            .attr("class", "expand-indicator")
            .attr("x", this.nodeWidth / 2 - 12)
            .attr("y", -this.nodeHeight / 2 + 17)
            .attr("text-anchor", "end")
            .attr("fill", "var(--gold-primary)")
            .attr("font-size", "12px")
            .style("cursor", "pointer")
            .text(d => d._children ? "⊕" : (d.children ? "⊖" : ""))
            .on("click", (event, d) => {
                event.stopPropagation();
                this.toggleNode(d);
            });

        // Member Full Name (Middle)
        nodeEnter.append("text")
            .attr("class", "node-text-name")
            .attr("x", -this.nodeWidth / 2 + 12)
            .attr("y", -this.nodeHeight / 2 + 45)
            .text(d => this.truncateText(d.data.full_name, 22));

        // Member Spouse / Note Meta (Bottom)
        nodeEnter.append("text")
            .attr("class", "node-text-meta")
            .attr("x", -this.nodeWidth / 2 + 12)
            .attr("y", -this.nodeHeight / 2 + 65)
            .text(d => {
                if (d.data.spouse) return this.truncateText(d.data.spouse, 26);
                if (d.data.notes) return this.truncateText(d.data.notes, 26);
                return d.data.gender ? `Giới tính: ${d.data.gender}` : "";
            });

        // UPDATE
        const nodeUpdate = node.merge(nodeEnter);

        nodeUpdate.transition()
            .duration(this.duration)
            .attr("transform", d => `translate(${d.x},${d.y})`);

        nodeUpdate.select(".expand-indicator")
            .text(d => d._children ? "⊕" : (d.children ? "⊖" : ""));

        // EXIT
        const nodeExit = node.exit().transition()
            .duration(this.duration)
            .attr("transform", d => `translate(${source.x},${source.y})`)
            .remove();

        // ==================== LINKS ====================
        const link = this.g.selectAll("path.link-line")
            .data(links, d => d.target.data.id);

        // Enter new links at parent's previous position
        const linkEnter = link.enter().insert("path", "g")
            .attr("class", "link-line")
            .attr("d", d => {
                const o = { x: source.x0 || source.x, y: source.y0 || source.y };
                return this.diagonal(o, o);
            });

        const linkUpdate = link.merge(linkEnter);

        linkUpdate.transition()
            .duration(this.duration)
            .attr("d", d => this.diagonal(d.source, d.target));

        link.exit().transition()
            .duration(this.duration)
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();

        // Stash the old positions for transition
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Cubic Bezier Curved link path (Vertical)
    diagonal(s, t) {
        const sx = s.x;
        const sy = s.y + this.nodeHeight / 2;
        const tx = t.x;
        const ty = t.y - this.nodeHeight / 2;

        return `M ${sx} ${sy}
                C ${sx} ${(sy + ty) / 2},
                  ${tx} ${(sy + ty) / 2},
                  ${tx} ${ty}`;
    }

    toggleNode(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }

    expandAll() {
        if (!this.root) return;
        this.expandNodeRecursive(this.root);
        this.update(this.root);
        // BUG-001/002/003 Fix: auto-fit after expanding all nodes
        setTimeout(() => this.fitToScreen(), 450);
    }

    collapseAll() {
        if (!this.root) return;
        if (this.root.children) {
            this.root.children.forEach(c => this.collapseNodeRecursive(c));
        }
        this.update(this.root);
        // Re-center on root after collapse
        setTimeout(() => this.resetZoom(), 450);
    }

    expandNodeRecursive(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        if (d.children) {
            d.children.forEach(c => this.expandNodeRecursive(c));
        }
    }

    collapseNodeRecursive(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        if (d._children) {
            d._children.forEach(c => this.collapseNodeRecursive(c));
        }
    }

    zoomIn() {
        this.svg.transition().duration(300).call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        this.svg.transition().duration(300).call(this.zoom.scaleBy, 0.75);
    }

    resetZoom() {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const isMobile = containerWidth < 768;
        const scale = isMobile ? 0.45 : 0.85;
        const initialTransform = d3.zoomIdentity.translate(containerWidth / 2, 80).scale(scale);
        this.svg.transition().duration(500).call(this.zoom.transform, initialTransform);
    }

    // BUG-005 Fix: Fit all visible nodes into screen
    fitToScreen() {
        if (!this.root) return;
        const nodes = this.root.descendants();
        if (nodes.length === 0) return;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        nodes.forEach(d => {
            if (d.x !== undefined && d.y !== undefined) {
                minX = Math.min(minX, d.x - this.nodeWidth / 2);
                maxX = Math.max(maxX, d.x + this.nodeWidth / 2);
                minY = Math.min(minY, d.y - this.nodeHeight / 2);
                maxY = Math.max(maxY, d.y + this.nodeHeight + 20);
            }
        });

        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const padding = 60;
        const treeWidth = maxX - minX;
        const treeHeight = maxY - minY;

        const scaleX = (containerWidth - padding * 2) / treeWidth;
        const scaleY = (containerHeight - padding * 2) / treeHeight;
        const scale = Math.min(scaleX, scaleY, 1.0); // cap at 1.0 for readability

        const tx = containerWidth / 2 - (minX + treeWidth / 2) * scale;
        const ty = padding - minY * scale;

        const transform = d3.zoomIdentity.translate(tx, ty).scale(scale);
        this.svg.transition().duration(600).call(this.zoom.transform, transform);
    }

    focusNode(memberId) {
        if (!this.root) return;
        
        let targetNode = null;
        this.root.each(d => {
            if (d.data.id === memberId) {
                targetNode = d;
            }
        });

        if (targetNode) {
            // Expand ancestors
            let curr = targetNode;
            while (curr.parent) {
                if (curr.parent._children) {
                    curr.parent.children = curr.parent._children;
                    curr.parent._children = null;
                }
                curr = curr.parent;
            }
            this.update(this.root);

            // Center view on target node
            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;
            const isMobile = containerWidth < 768;
            const targetScale = isMobile ? 0.7 : 1.2;
            const transform = d3.zoomIdentity
                .translate(containerWidth / 2 - targetNode.x, containerHeight / 2 - targetNode.y + this.nodeHeight / 2)
                .scale(targetScale);

            this.svg.transition().duration(750).call(this.zoom.transform, transform);

            // Highlight node
            d3.selectAll(".node-card").classed("selected", false);
            d3.selectAll(".node-card")
                .filter(d => d.data.id === memberId)
                .classed("selected", true);
        }
    }

    truncateText(str, maxLen) {
        if (!str) return "";
        return str.length > maxLen ? str.substring(0, maxLen - 3) + "..." : str;
    }
}
