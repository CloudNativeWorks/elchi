import cytoscape from 'cytoscape';
import { getNodeStyle, getIconForResource } from './utils';
import { ThemeColors } from './themes';


export const createDependencyGraph = (
    containerRef: HTMLDivElement,
    dependencies: any,
    callbackFns: {
        // eslint-disable-next-line
        onNodeTap: (node: any, x: number, y: number) => void,
        onCanvasTap: () => void
    }
) => {
    try {
        // Process data structure
        let nodes = [];
        let edges = [];

        try {
            if (dependencies.nodes && Array.isArray(dependencies.nodes)) {
                nodes = dependencies.nodes;
            } else if (dependencies.elements && Array.isArray(dependencies.elements)) {
                nodes = dependencies.elements.filter(el => el.group === 'nodes');
                edges = dependencies.elements.filter(el => el.group === 'edges');
            } else if (Array.isArray(dependencies)) {
                // API might have returned elements directly as an array
                nodes = dependencies.filter(item =>
                    item.group === 'nodes' ||
                    (item.data && !item.data.source && !item.data.target)
                );
                edges = dependencies.filter(item =>
                    item.group === 'edges' ||
                    (item.data && item.data.source && item.data.target)
                );
            }

            if (dependencies.edges && Array.isArray(dependencies.edges)) {
                edges = dependencies.edges;
            }

            if (nodes.length === 0) {
                throw new Error("No nodes found in dependency data");
            }

            // Format each node and edge data structure correctly
            const formattedElements = [];

            // Add nodes
            nodes.forEach((node) => {
                const nodeData = node.data || node;

                // GType check
                let nodeGtype = nodeData.gtype || '';


                // Fix label visibility issue
                let nodeLabel = nodeData.label || nodeData.name || nodeData.id || 'Node';

                formattedElements.push({
                    data: {
                        id: nodeData.id || `node-${Math.random().toString(36).substr(2, 9)}`,
                        label: nodeLabel,
                        category: nodeData.category || nodeData.type || 'default',
                        gtype: nodeGtype,
                        first: nodeData.first || false,
                        link: nodeData.link || '',
                    },
                    group: 'nodes',
                    classes: '',
                });
            });

            // Add edges
            edges.forEach((edge) => {
                const edgeData = edge.data || edge;
                // Skip invalid edges without source or target
                if (!edgeData.source || !edgeData.target) {
                    return;
                }
                formattedElements.push({
                    data: {
                        id: edgeData.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
                        source: edgeData.source,
                        target: edgeData.target,
                        label: edgeData.label || ''
                    },
                    group: 'edges',
                });
            });

            // Check all style properties for string/number consistency
            const styles = [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'background-color': function (ele) {
                            return getNodeStyle(ele.data('category')).bg;
                        },
                        'shape': 'round-rectangle',
                        'width': 65,
                        'height': 65,
                        'border-width': 2,
                        'border-color': function (ele) {
                            return getNodeStyle(ele.data('category')).border;
                        },
                        'border-style': 'solid',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'color': '#333',
                        'font-size': 14,
                        'font-weight': 'bold',
                        'text-margin-y': 10,
                        'text-background-color': '#ffffff',
                        'text-background-opacity': 1,
                        'text-background-shape': 'roundrectangle',
                        'text-background-padding': 5,
                        'text-border-opacity': 1,
                        'text-border-width': 1,
                        'text-border-color': '#ddd',
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'text-outline-width': 0,
                        'text-outline-opacity': 0,
                        'text-opacity': 1,
                        'z-index': 10
                    } as any
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': ThemeColors.edge.default,
                        'target-arrow-color': ThemeColors.edge.default,
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 1.5,
                        'curve-style': 'bezier',
                        'line-style': 'solid',
                        'label': 'data(label)',
                        'font-size': 12,
                        'font-weight': 'normal',
                        'text-rotation': 'autorotate',
                        'text-background-opacity': 1,
                        'text-background-color': '#f8f8f8',
                        'text-background-padding': '5px',
                        'text-background-shape': 'roundrectangle',
                        'color': '#555',
                        'text-margin-y': -5,
                        'source-endpoint': '0% 50%',
                        'target-endpoint': '0% 50%',
                        'target-distance-from-node': 10,
                        'source-distance-from-node': 5,
                        'text-outline-color': '#fff',
                        'text-outline-width': 2,
                        'z-index': 5
                    } as any
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': ThemeColors.node.highlighted.bg,
                        'border-color': ThemeColors.node.highlighted.border,
                        'border-width': 3,
                        'line-color': ThemeColors.edge.highlighted,
                        'target-arrow-color': ThemeColors.edge.highlighted,
                        'color': ThemeColors.node.highlighted.text,
                        'z-index': 999
                    } as any
                }
            ];

            // Create cytoscape instance
            const cy = cytoscape({
                container: containerRef,
                elements: formattedElements,
                layout: {
                    name: 'dagre',
                    padding: 60,
                    spacingFactor: 1.5,
                    nodeSep: 180,
                    edgeSep: 120,
                    rankSep: 250,
                    rankDir: 'LR',
                    align: 'UL',
                    ranker: 'network-simplex',
                    fit: true,
                    animate: true,
                    animationDuration: 400,
                    acyclicer: 'greedy',
                } as cytoscape.LayoutOptions,
                style: styles,
                autoungrabify: false,
                autounselectify: false,
            });

            // Create a div with HTML content
            const createNodeIconContainer = (node) => {
                // Node icon and content
                const nodeContainer = document.createElement('div');
                nodeContainer.className = 'node-icon-container';
                nodeContainer.id = `icon-${node.id()}`;
                nodeContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    z-index: 10;
                `;

                // Create the icon
                const iconUrl = getIconForResource(node.data('category'));
                if (iconUrl) {
                    const iconEl = document.createElement('img');
                    iconEl.src = iconUrl;
                    iconEl.style.cssText = `
                        width: 85%;
                        height: 85%;
                        object-fit: contain;
                        pointer-events: none;
                    `;
                    nodeContainer.appendChild(iconEl);
                }

                if (node.data('first')) {
                    const star = document.createElement('span');
                    star.innerHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="#FFD700" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 12.4,7.5 18.3,7.6 13.6,11.6 15.2,17.3 10,14 4.8,17.3 6.4,11.6 1.7,7.6 7.6,7.5"/></svg>`;
                    star.style.position = 'absolute';
                    star.style.top = '-10px';
                    star.style.right = '-10px';
                    star.style.width = '16px';
                    star.style.height = '16px';
                    star.style.pointerEvents = 'none';
                    star.style.zIndex = '1001';
                    nodeContainer.appendChild(star);
                }

                return nodeContainer;
            };

            // Add icon container for each node
            cy.ready(() => {
                cy.nodes().forEach(node => {
                    const nodeContainerDiv = createNodeIconContainer(node);
                    const pos = node.renderedPosition();
                    const width = node.renderedWidth();
                    const height = node.renderedHeight();

                    nodeContainerDiv.style.left = `${pos.x - width / 2}px`;
                    nodeContainerDiv.style.top = `${pos.y - height / 2}px`;
                    nodeContainerDiv.style.width = `${width}px`;
                    nodeContainerDiv.style.height = `${height}px`;

                    containerRef.appendChild(nodeContainerDiv);
                });

                // Update node positions
                cy.on('position', 'node', function (e) {
                    const node = e.target;
                    const iconDiv = document.getElementById(`icon-${node.id()}`);
                    if (iconDiv) {
                        const pos = node.renderedPosition();
                        const width = node.renderedWidth();
                        const height = node.renderedHeight();

                        iconDiv.style.left = `${pos.x - width / 2}px`;
                        iconDiv.style.top = `${pos.y - height / 2}px`;
                        iconDiv.style.width = `${width}px`;
                        iconDiv.style.height = `${height}px`;
                    }
                });

                // Update positions when zoom changes
                cy.on('zoom', function () {
                    cy.nodes().forEach(node => {
                        const iconDiv = document.getElementById(`icon-${node.id()}`);
                        if (iconDiv) {
                            const pos = node.renderedPosition();
                            const width = node.renderedWidth();
                            const height = node.renderedHeight();

                            iconDiv.style.left = `${pos.x - width / 2}px`;
                            iconDiv.style.top = `${pos.y - height / 2}px`;
                            iconDiv.style.width = `${width}px`;
                            iconDiv.style.height = `${height}px`;
                        }
                    });
                });

                // Update positions when pan changes
                cy.on('pan', function () {
                    cy.nodes().forEach(node => {
                        const iconDiv = document.getElementById(`icon-${node.id()}`);
                        if (iconDiv) {
                            const pos = node.renderedPosition();
                            const width = node.renderedWidth();
                            const height = node.renderedHeight();

                            iconDiv.style.left = `${pos.x - width / 2}px`;
                            iconDiv.style.top = `${pos.y - height / 2}px`;
                            iconDiv.style.width = `${width}px`;
                            iconDiv.style.height = `${height}px`;
                        }
                    });
                });
            });

            setTimeout(() => {
                if (cy) {
                    try {
                        cy.center();
                        cy.fit();
                        //cy.zoom(0.7);

                        cy.edges().forEach(edge => {
                            edge.style({
                                'source-endpoint': 'outside-to-node',
                                'target-endpoint': 'outside-to-node',
                                'curve-style': 'bezier',
                                'control-point-step-size': 40,
                                'target-arrow-shape': 'triangle',
                                'arrow-scale': 1.5
                            });
                        });
                    } catch (layoutError) {
                        console.error("Layout adjustment error:", layoutError);
                    }
                }
            }, 500);

            // Add interactions
            cy.on('tap', 'node', (event) => {
                const node = event.target;


                cy.edges().style({
                    'line-color': ThemeColors.edge.default,
                    'target-arrow-color': ThemeColors.edge.default
                });

                // Highlight selected node and connections
                node.style({
                    'border-color': ThemeColors.edge.highlighted,
                    'border-width': 3,
                    'border-style': 'solid'
                });

                // Highlight connected edges and nodes
                node.connectedEdges().forEach(edge => {
                    edge.style({
                        'line-color': ThemeColors.edge.highlighted,
                        'target-arrow-color': ThemeColors.edge.highlighted,
                        'width': 3
                    });

                    // Highlight connected nodes' borders
                    const targetNode = edge.target();
                    const sourceNode = edge.source();

                    if (targetNode.id() !== node.id()) {
                        targetNode.style({
                            'border-color': ThemeColors.edge.highlighted,
                            'border-width': 3,
                            'border-style': 'solid'
                        });
                    }

                    if (sourceNode.id() !== node.id()) {
                        sourceNode.style({
                            'border-color': ThemeColors.edge.highlighted,
                            'border-width': 3,
                            'border-style': 'solid'
                        });
                    }
                });

                // Call the node tap callback with node's rendered position
                const { x, y } = node.renderedPosition();
                callbackFns.onNodeTap(node, x, y);
            });

            // Canvas tap event
            cy.on('tap', (event) => {
                if (event.target === cy) {
                    // Call the canvas tap callback
                    callbackFns.onCanvasTap();

                    // Clear all highlights
                    cy.nodes().forEach(n => {
                        n.style({
                            'border-color': function () {
                                return getNodeStyle(n.data('category')).border;
                            },
                            'border-width': 2,
                            'border-style': 'solid'
                        });
                    });

                    cy.edges().style({
                        'line-color': ThemeColors.edge.default,
                        'target-arrow-color': ThemeColors.edge.default,
                        'width': 2
                    });
                }
            });

            // Node mouseover effect
            cy.on('mouseover', 'node', function (e) {
                const node = e.target;

                node.style({
                    'border-width': 3,
                    'border-style': 'dashed'
                });

                // Icon effect (zoom)
                const iconDiv = document.getElementById(`icon-${node.id()}`);
                if (iconDiv) {
                    const iconImg = iconDiv.querySelector('img');
                    if (iconImg) {
                        iconImg.style.width = '75%';
                        iconImg.style.height = '75%';
                        iconImg.style.transition = 'all 0.2s ease';
                    }
                }
            });

            // Node mouseout effect
            cy.on('mouseout', 'node', function (e) {
                const node = e.target;
                if (!node.hasClass('highlighted')) {
                    node.style({
                        'border-width': 2,
                        'border-style': 'solid'
                    });
                }

                // Return icon to normal
                const iconDiv = document.getElementById(`icon-${node.id()}`);
                if (iconDiv) {
                    const iconImg = iconDiv.querySelector('img');
                    if (iconImg) {
                        iconImg.style.width = '70%';
                        iconImg.style.height = '70%';
                    }
                }
            });

            // Layout tamamlandığında fit ve center uygula
            cy.on('layoutstop', () => {
                cy.fit();
                cy.center();
            });

            return cy;
        } catch (dataProcessingError) {
            console.error("Data processing error:", dataProcessingError);
            throw dataProcessingError;
        }
    } catch (globalError) {
        console.error("Global error in createDependencyGraph:", globalError);
        throw globalError;
    }
}; 