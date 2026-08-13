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
        this.root.x0 = this.container.clientHeight / 2;
        this.root.y0 = 100;

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
        // Declare tree layout (horizontal layout: dx = vertical spacing, dy = horizontal depth spacing)
        const treeLayout = d3.tree()
            .nodeSize([this.nodeHeight + 35, this.nodeWidth + 70]);

        const treeData = treeLayout(this.root);

        const nodes = treeData.descendants();
        const links = treeData.links();

        // Normalize for fixed-depth spacing
        nodes.forEach(d => {
            d.y = d.depth * (this.nodeWidth + 90);
        });

        // ==================== NODES ====================
        const node = this.g.selectAll("g.node-card")
            .data(nodes, d => d.data.id);

        // Enter new nodes at the parent's previous position
        const nodeEnter = node.enter().append("g")
            .attr("class", "node-card")
            .attr("transform", d => `translate(${source.y0 || source.y},${source.x0 || source.x})`)
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
            .attr("x", 0)
            .attr("y", -this.nodeHeight / 2)
            .attr("rx", 8);

        // Header Line Divider inside Card
        nodeEnter.append("line")
            .attr("x1", 0)
            .attr("y1", -this.nodeHeight / 2 + 26)
            .attr("x2", this.nodeWidth)
            .attr("y2", -this.nodeHeight / 2 + 26)
            .attr("stroke", "rgba(212, 175, 55, 0.3)")
            .attr("stroke-width", "1px");

        // Generation Badge Text (Top Left)
        nodeEnter.append("text")
            .attr("x", 10)
            .attr("y", -this.nodeHeight / 2 + 17)
            .attr("fill", "#D4AF37")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .text(d => `Đời ${d.data.generation}`);

        // Expand/Collapse Indicator Badge (Top Right)
        nodeEnter.append("text")
            .attr("class", "expand-indicator")
            .attr("x", this.nodeWidth - 12)
            .attr("y", -this.nodeHeight / 2 + 17)
            .attr("text-anchor", "end")
            .attr("fill", "#D4AF37")
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
            .attr("x", 12)
            .attr("y", -this.nodeHeight / 2 + 45)
            .text(d => this.truncateText(d.data.full_name, 22));

        // Member Spouse / Note Meta (Bottom)
        nodeEnter.append("text")
            .attr("class", "node-text-meta")
            .attr("x", 12)
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
            .attr("transform", d => `translate(${d.y},${d.x})`);

        nodeUpdate.select(".expand-indicator")
            .text(d => d._children ? "⊕" : (d.children ? "⊖" : ""));

        // EXIT
        const nodeExit = node.exit().transition()
            .duration(this.duration)
            .attr("transform", d => `translate(${source.y},${source.x})`)
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

    // Cubic Bezier Curved link path
    diagonal(s, t) {
        const sy = s.y + this.nodeWidth;
        const sx = s.x;
        const ty = t.y;
        const tx = t.x;

        return `M ${sy} ${sx}
                C ${(sy + ty) / 2} ${sx},
                  ${(sy + ty) / 2} ${tx},
                  ${ty} ${tx}`;
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
    }

    collapseAll() {
        if (!this.root) return;
        if (this.root.children) {
            this.root.children.forEach(c => this.collapseNodeRecursive(c));
        }
        this.update(this.root);
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
        const initialTransform = d3.zoomIdentity.translate(80, containerHeight / 2).scale(0.85);
        this.svg.transition().duration(500).call(this.zoom.transform, initialTransform);
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
            const transform = d3.zoomIdentity
                .translate(containerWidth / 2 - targetNode.y, containerHeight / 2 - targetNode.x)
                .scale(1.1);

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
