import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { RouteMapData } from './types';
import { getRouteMapNodeStyle } from './routeMapStyles';

cytoscape.use(dagre);

export const RouteMapStyles: any[] = [
    // Basic node style - colors will be applied dynamically
    {
        selector: 'node',
        style: {
            'background-color': 'transparent', // Will be overridden dynamically
            'label': 'data(type)',
            'shape': 'round-rectangle',
            'width': '160px', // Larger width for bigger text
            'height': '80px', // Larger height for bigger text
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '16px', // Much larger font for better readability
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': 'bold', // Back to bold
            'color': 'white',
            'text-transform': 'uppercase',
            'text-outline-color': 'black',
            'text-outline-width': 2, // Thicker outline for better contrast
            'text-outline-opacity': 1,
            'border-width': 2,
            'border-color': '#999', // Will be overridden
            'text-wrap': 'wrap',
            'text-max-width': '150px', // Adjusted to new width
            'min-zoomed-font-size': 0, // Don't limit font size when zoomed out
            'font-smooth': 'always' // Force font smoothing
        }
    },
    // Edge styles
    {
        selector: 'edge[type="has_domain"]',
        style: {
            'width': 3,
            'line-color': '#3498db',
            'target-arrow-color': '#3498db',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '14px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': 'bold',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'color': '#2c3e50',
            'text-background-color': 'white',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
        }
    },
    {
        selector: 'edge[type="has_route"]',
        style: {
            'width': 3,
            'line-color': '#27ae60',
            'target-arrow-color': '#27ae60',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '14px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': 'bold',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'color': '#2c3e50',
            'text-background-color': 'white',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
        }
    },
    {
        selector: 'edge[type="has_match"]',
        style: {
            'width': 3,
            'line-color': '#9b59b6',
            'target-arrow-color': '#9b59b6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '14px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': 'bold',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'color': '#2c3e50',
            'text-background-color': 'white',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
        }
    },
    {
        selector: 'edge[type="routes_to"]',
        style: {
            'width': 4,
            'line-color': '#f39c12',
            'target-arrow-color': '#f39c12',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '14px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': 'bold',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'color': '#2c3e50',
            'text-background-color': 'white',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
        }
    },
    // Default edge style
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#95a5a6',
            'target-arrow-color': '#95a5a6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '13px',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'font-weight': '600',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'color': '#2c3e50',
            'text-background-color': 'white',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px'
        }
    }
];

export const createRouteMapGraph = (
    container: HTMLElement,
    data: RouteMapData,
    options: {
        onNodeTap?: (node: cytoscape.NodeSingular) => void;
        onCanvasTap?: () => void;
    } = {}
): cytoscape.Core => {
    // Transform data to Cytoscape format
    let elements: cytoscape.ElementDefinition[] = [];

    if (data.graph) {
        // Add nodes
        if (data.graph.nodes) {
            elements = elements.concat(data.graph.nodes.map(node => ({
                group: 'nodes' as const,
                data: {
                    ...node.data,
                    originalLabel: node.data.label, // Keep original label for display
                    displayText: (node.data.properties && node.data.properties.description) 
                        ? `${node.data.type}\\n${node.data.label}\\n${node.data.properties.description}` 
                        : `${node.data.type}\\n${node.data.label}`
                }
            })));
        }

        // Add edges
        if (data.graph.edges) {
            elements = elements.concat(data.graph.edges.map(edge => ({
                group: 'edges' as const,
                data: edge.data
            })));
        }
    }

    // Calculate adaptive spacing based on number of nodes
    const nodeCount = elements.filter(el => el.group === 'nodes').length;
    const adaptiveSpacing = nodeCount > 20 ? {
        spacingFactor: 3.0,
        nodeSep: 200,
        edgeSep: 150,
        rankSep: 250,
        padding: 80
    } : nodeCount > 10 ? {
        spacingFactor: 2.5,
        nodeSep: 175,
        edgeSep: 125,
        rankSep: 225,
        padding: 65
    } : {
        spacingFactor: 2.0,
        nodeSep: 150,
        edgeSep: 100,
        rankSep: 200,
        padding: 50
    };

    const cy = cytoscape({
        container: container,
        elements: elements,
        style: RouteMapStyles,
        pixelRatio: 2.0, // Higher pixel ratio for sharper text rendering
        hideEdgesOnViewport: false,
        textureOnViewport: false,
        motionBlur: false,
        layout: {
            name: 'dagre',
            spacingFactor: adaptiveSpacing.spacingFactor,
            nodeSep: adaptiveSpacing.nodeSep,
            edgeSep: adaptiveSpacing.edgeSep,
            rankSep: adaptiveSpacing.rankSep,
            rankDir: 'LR',
            align: 'UL',
            ranker: 'network-simplex',
            fit: true,
            padding: adaptiveSpacing.padding,
            animate: true,
            animationDuration: 800,
            acyclicer: 'greedy',
            // Additional dagre-specific options
            nodeDimensionsIncludeLabels: true, // Consider label size in node dimensions
            stop: function () {
                setTimeout(() => {
                    if (cy) {
                        cy.fit();
                        cy.center();
                    }
                }, 100);
            }
        } as cytoscape.LayoutOptions,
        minZoom: 0.1,
        maxZoom: 3,
        boxSelectionEnabled: false,
        autounselectify: false,
        userPanningEnabled: true,
        userZoomingEnabled: true
    });

    // Add labels and apply styles after graph is ready
    cy.ready(() => {
        cy.nodes().forEach(node => {
            // Apply node colors dynamically based on type
            const nodeType = node.data('type') || 'default';
            const nodeStyle = getRouteMapNodeStyle(nodeType);
            node.style({
                'background-color': nodeStyle.bg,
                'border-color': nodeStyle.border,
                'border-width': 2,
                'border-style': 'solid'
            });

            // Add label below node
            const originalLabel = node.data('originalLabel');
            if (originalLabel) {
                const labelDiv = document.createElement('div');
                labelDiv.className = 'routemap-node-label';
                labelDiv.setAttribute('data-node-id', node.id());
                labelDiv.textContent = originalLabel;
                labelDiv.style.position = 'absolute';
                labelDiv.style.textAlign = 'center';
                labelDiv.style.fontSize = '13px';
                labelDiv.style.fontWeight = 'bold';
                labelDiv.style.color = '#333';
                labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                labelDiv.style.padding = '2px 4px';
                labelDiv.style.borderRadius = '4px';
                labelDiv.style.pointerEvents = 'none';
                labelDiv.style.zIndex = '1000';
                
                container.appendChild(labelDiv);
                
                // Function to update label position and size based on node
                const updateLabel = () => {
                    const pos = node.renderedPosition();
                    const nodeWidth = parseFloat(node.style('width').replace('px', ''));
                    const nodeHeight = parseFloat(node.style('height').replace('px', ''));
                    const zoom = cy.zoom();
                    
                    // Calculate rendered size with zoom
                    const renderedWidth = nodeWidth * zoom;
                    const renderedHeight = nodeHeight * zoom;
                    
                    labelDiv.style.left = `${pos.x - renderedWidth/2}px`;
                    labelDiv.style.top = `${pos.y + renderedHeight/2 + 10}px`;
                    labelDiv.style.width = `${renderedWidth}px`;
                    labelDiv.style.fontSize = `${Math.max(10, 13 * zoom)}px`;
                };
                
                // Initial position
                updateLabel();
                
                // Update label when node moves, resizes, or graph changes
                node.on('position style', updateLabel);
                cy.on('pan zoom resize', updateLabel);
            }
        });
    });

    // Event handlers
    if (options.onNodeTap) {
        cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            
            // Reset all edges to default color first
            cy.edges().style({
                'line-color': '#95a5a6',
                'target-arrow-color': '#95a5a6',
                'width': 2
            });

            // Reset all nodes to default borders and backgrounds
            cy.nodes().forEach(n => {
                const nodeType = n.data('type') || 'default';
                const nodeStyle = getRouteMapNodeStyle(nodeType);
                n.style({
                    'background-color': nodeStyle.bg,
                    'border-color': nodeStyle.border,
                    'border-width': 2,
                    'border-style': 'solid',
                    'width': '160px',
                    'height': '80px'
                });
            });

            // Highlight selected node
            node.style({
                'border-color': '#FFD700',
                'border-width': 3,
                'border-style': 'solid',
                'width': '170px',
                'height': '90px'
            });

            // Highlight connected edges and nodes
            node.connectedEdges().forEach((edge: cytoscape.EdgeSingular) => {
                edge.style({
                    'line-color': '#FFD700',
                    'target-arrow-color': '#FFD700',
                    'width': 3
                });

                // Highlight connected nodes' borders
                const targetNode = edge.target();
                const sourceNode = edge.source();

                if (targetNode.id() !== node.id()) {
                    targetNode.style({
                        'border-color': '#FFD700',
                        'border-width': 3,
                        'border-style': 'solid'
                    });
                }

                if (sourceNode.id() !== node.id()) {
                    sourceNode.style({
                        'border-color': '#FFD700',
                        'border-width': 3,
                        'border-style': 'solid'
                    });
                }
            });

            // Call the callback
            options.onNodeTap!(node);
        });
    }

    if (options.onCanvasTap) {
        cy.on('tap', (evt) => {
            if (evt.target === cy) {
                // Reset all edges to default colors
                cy.edges().style({
                    'line-color': '#95a5a6',
                    'target-arrow-color': '#95a5a6',
                    'width': 2
                });

                // Reset all nodes to default borders, backgrounds, and sizes
                cy.nodes().forEach(node => {
                    const nodeType = node.data('type') || 'default';
                    const nodeStyle = getRouteMapNodeStyle(nodeType);
                    node.style({
                        'background-color': nodeStyle.bg,
                        'border-color': nodeStyle.border,
                        'border-width': 2,
                        'border-style': 'solid',
                        'width': '120px',
                        'height': '60px'
                    });
                });

                options.onCanvasTap!();
            }
        });
    }

    // Add subtle hover effects
    cy.on('mouseover', 'node', (evt) => {
        const node = evt.target;
        // Only add hover effect if node is not currently highlighted
        if (node.style('border-color') !== '#FFD700') {
            const currentWidth = parseInt(node.style('border-width'));
            if (currentWidth <= 2) { // Only hover if not already selected
                node.style({
                    'border-width': 3
                });
            }
        }
    });

    cy.on('mouseout', 'node', (evt) => {
        const node = evt.target;
        // Only remove hover effect if node is not highlighted 
        if (node.style('border-color') !== '#FFD700') {
            node.style({
                'border-width': 2
            });
        }
    });


    // Auto-fit and center after initial render
    setTimeout(() => {
        cy.fit();
        cy.center();
    }, 100);

    return cy;
};

