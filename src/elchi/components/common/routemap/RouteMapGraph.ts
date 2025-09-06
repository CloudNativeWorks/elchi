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
            'width': '95px',
            'height': '50px',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'font-weight': 'bold',
            'color': 'white',
            'text-transform': 'uppercase',
            'text-outline-color': 'black',
            'text-outline-width': 1,
            'text-background-color': 'rgba(0, 0, 0, 0.4)',
            'text-background-padding': '3px',
            'text-background-shape': 'round-rectangle',
            'border-width': 2,
            'border-color': '#999', // Will be overridden
            'text-wrap': 'wrap',
            'text-max-width': '100px'
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
            'font-size': '9px',
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
            'font-size': '9px',
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
            'font-size': '9px',
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
            'font-size': '10px',
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
            'font-size': '9px',
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

    const cy = cytoscape({
        container: container,
        elements: elements,
        style: RouteMapStyles,
        layout: {
            name: 'dagre',
            spacingFactor: 1.2,
            nodeSep: 80,
            edgeSep: 50,
            rankSep: 120,
            rankDir: 'LR',
            align: 'UL',
            ranker: 'network-simplex',
            fit: true,
            padding: 30,
            animate: true,
            animationDuration: 800,
            acyclicer: 'greedy',
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
                labelDiv.style.fontSize = '11px';
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
                    labelDiv.style.fontSize = `${Math.max(8, 11 * zoom)}px`;
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
                    'width': '95px',
                    'height': '50px'
                });
            });

            // Highlight selected node
            node.style({
                'border-color': '#FFD700',
                'border-width': 3,
                'border-style': 'solid',
                'width': '105px',
                'height': '60px'
            });

            // Highlight connected edges and nodes
            node.connectedEdges().forEach(edge => {
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
                        'width': '95px',
                        'height': '50px'
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

