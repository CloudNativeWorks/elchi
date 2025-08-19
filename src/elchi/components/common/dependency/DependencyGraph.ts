import cytoscape from 'cytoscape';
import { getNodeStyle } from './utils';
import { ThemeColors } from './themes';
import { 
    GlobalOutlined,
    ClusterOutlined,
    FilterOutlined,
    ShareAltOutlined,
    AimOutlined,
    SafetyOutlined,
    CodeOutlined,
    KeyOutlined,
    AppstoreOutlined,
    CloudOutlined
} from '@ant-design/icons';
import React from 'react';
import { createRoot } from 'react-dom/client';


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

            // Calculate adaptive node size based on node count - made larger for better visibility
            const nodeCount = formattedElements.filter(el => el.group === 'nodes').length;
            const getAdaptiveNodeSize = () => {
                if (nodeCount === 1) return { width: 100, height: 100, fontSize: 18 };
                if (nodeCount <= 3) return { width: 90, height: 90, fontSize: 17 };
                if (nodeCount <= 8) return { width: 80, height: 80, fontSize: 16 };
                return { width: 70, height: 70, fontSize: 14 };
            };

            const { width: nodeWidth, height: nodeHeight, fontSize } = getAdaptiveNodeSize();

            // Check all style properties for string/number consistency
            const styles = [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'background-color': '#ccc', // Will be overridden in cy.ready
                        'shape': 'round-rectangle',
                        'width': nodeWidth,
                        'height': nodeHeight,
                        'border-width': 2,
                        'border-color': '#999', // Will be overridden in cy.ready
                        'border-style': 'solid',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'color': '#2d3748',
                        'font-size': fontSize,
                        'font-weight': '600',
                        'text-margin-y': 12,
                        'text-background-color': 'rgba(255, 255, 255, 0.95)',
                        'text-background-opacity': 1,
                        'text-background-shape': 'roundrectangle',
                        'text-background-padding': 6,
                        'text-border-opacity': 1,
                        'text-border-width': 1,
                        'text-border-color': 'rgba(0, 0, 0, 0.1)',
                        'text-wrap': 'wrap',
                        'text-max-width': 120,
                        'text-outline-width': 0,
                        'text-outline-opacity': 0,
                        'text-opacity': 1,
                        'transition-property': 'all',
                        'transition-duration': '300ms',
                        'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
                        'z-index': 10
                    } as any
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 4,
                        'line-color': ThemeColors.edge.default,
                        'target-arrow-color': ThemeColors.edge.default,
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 2,
                        'curve-style': 'bezier',
                        'line-style': 'solid',
                        'label': 'data(label)',
                        'font-size': 11,
                        'font-weight': '500',
                        'text-rotation': 'autorotate',
                        'text-background-opacity': 0,
                        'color': '#333333',
                        'text-margin-y': -8,
                        'source-endpoint': 'outside-to-node',
                        'target-endpoint': 'outside-to-node',
                        'target-distance-from-node': 8,
                        'source-distance-from-node': 8,
                        'text-outline-color': 'rgba(255, 255, 255, 0.8)',
                        'text-outline-width': 1,
                        'control-point-step-size': 40,
                        'opacity': 1,
                        'transition-property': 'all',
                        'transition-duration': '200ms',
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

                // Direkt Ant Design icon componentlerini kullan
                const category = node.data('category');
                
                // Category to Ant Design icon component mapping
                const antIconComponentMap: { [key: string]: any } = {
                    'listeners': GlobalOutlined,
                    'routes': ShareAltOutlined,
                    'virtual_hosts': CloudOutlined,
                    'clusters': ClusterOutlined,
                    'endpoints': AimOutlined,
                    'tls': SafetyOutlined,
                    'secrets': KeyOutlined,
                    'filters': FilterOutlined,
                    'extensions': AppstoreOutlined,
                    'bootstrap': CodeOutlined
                };
                
                const IconComponent = antIconComponentMap[category];
                if (IconComponent) {
                    // React componentini DOM'a render et
                    const iconWrapper = document.createElement('div');
                    iconWrapper.style.cssText = `
                        font-size: 28px;
                        color: white;
                        pointer-events: none;
                        line-height: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                    `;
                    
                    const root = createRoot(iconWrapper);
                    root.render(React.createElement(IconComponent, {
                        style: { 
                            fontSize: '28px', 
                            color: 'white' 
                        }
                    }));
                    
                    nodeContainer.appendChild(iconWrapper);
                    return nodeContainer;
                }
                
                // For other categories, use existing SVG system temporarily
                const iconSvgMap: { [key: string]: string } = {
                    'listener': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItOC40IC04LjQgNDAuODAgNDAuODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZmZmZiI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCIgLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiAvPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48ZyBkYXRhLW5hbWU9IlByb2R1Y3QgSWNvbnMiPiA8ZyBkYXRhLW5hbWU9ImNvbG9yZWQtMzIvbG9hZC1iYWxhbmNpbmciPjxyZWN0IHN0eWxlPSJmaWxsOm5vbmUiIC8+IDxnPjxyZWN0IHN0eWxlPSJmaWxsOiNmZmZmZmYiIHg9IjE4IiB5PSIxMiIgd2lkdGg9IjIiIGhlaWdodD0iNCIgLz48cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmIiB4PSIxMSIgeT0iMTIiIHdpZHRoPSIyIiBoZWlnaHQ9IjQiIC8+PHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgeD0iNCIgeT0iMTIiIHdpZHRoPSIyIiBoZWlnaHQ9IjQiIC8+PHBvbHlnb24gaWQ9IkZpbGwtMiIgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgcG9pbnRzPSIxMyAxMSAxMSAxMSAxMSA3IDEzIDcgMTMgMTEiIC8+PHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgeD0iNCIgeT0iMTEiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyIiAvPjxyZWN0IHN0eWxlPSJmaWxsOiNmZmZmZmYiIHg9IjYiIHk9IjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSI1IiAvPjxyZWN0IHN0eWxlPSJmaWxsOiNmZmZmZmYiIHg9IjEyIiB5PSIyIiB3aWR0aD0iNiIgaGVpZ2h0PSI1IiAvPjxyZWN0IHN0eWxlPSJmaWxsOiNmZmZmZmYiIHg9IjE2IiB5PSIxNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgLz48cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmIiB4PSIyIiB5PSIxNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgLz48cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmIiB4PSI1IiB5PSIxNiIgd2lkdGg9IjMiIGhlaWdodD0iNiIgLz48cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmIiB4PSI5IiB5PSIxNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgLz48cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmIiB4PSIxMiIgeT0iMTYiIHdpZHRoPSIzIiBoZWlnaHQ9IjYiIC8+PHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgeD0iMTkiIHk9IjE2IiB3aWR0aD0iMyIgaGVpZ2h0PSI2IiAvPjwvZz4gPC9nPiA8L2c+IDwvZz48L3N2Zz4=',
                    'cluster': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItNS42IC01LjYgMjcuMjAgMjcuMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZmZmZiI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCIgLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiAvPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48cGF0aCBzdHlsZT0iZmlsbDogI2ZmZmZmZiIgZmlsbFJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDBhMi4yNSAyLjI1IDAgMDAtLjc1IDQuMzcydi40NjVhMy4yNSAzLjI1IDAgMDAtMS43OTcgMS4xNDRsLS42MjUtLjM2NmEyLjI1IDIuMjUgMCAxMC0xLjAzOCAxLjEzbDEuMDI2LjYwMmEzLjI2MSAzLjI2MSAwIDAwMCAxLjMwNmwtMS4wMjYuNjAxYTIuMjUgMi4yNSAwIDEwMS4wMzggMS4xM2wuNjI1LS4zNjZhMy4yNSAzLjI1IDAgMDAxLjc5NyAxLjE0NXYuNDY1YTIuMjUgMi4yNSAwIDEwMS41IDB2LS40NjVhMy4yNSAzLjI1IDAgMDAxLjc5Ny0xLjE0NWwuNjI1LjM2NmEyLjI1IDIuMjUgMCAxMDEuMDM4LTEuMTNsLTEuMDI2LS42YTMuMjYgMy4yNiAwIDAwMC0xLjMwN2wxLjAyNi0uNjAxYTIuMjUgMi4yNSAwIDEwLTEuMDM4LTEuMTNsLS42MjUuMzY1QTMuMjUxIDMuMjUxIDAgMDA4Ljc1IDQuODM3di0uNDY1QTIuMjUgMi4yNSAwIDAwOCAwem0tLjc1IDIuMjVhLjc1Ljc1IDAgMTExLjUgMCAuNzUuNzUgMCAwMS0xLjUgMHpNMi43NSA0YS43NS43NSAwIDEwMCAxLjUuNzUuNzUgMCAwMDAtMS41em0wIDYuNWEuNzUuNzUgMCAxMDAgMS41Ljc1Ljc1IDAgMDAwLTEuNXptNC41IDMuMjVhLjc1Ljc1IDAgMTExLjUgMCAuNzUuNzUgMCAwMS0xLjUgMHptNi0zLjI1YS43NS43NSAwIDEwMCAxLjUuNzUuNzUgMCAwMDAtMS41em0wLTYuNWEuNzUuNzUgMCAxMDAgMS41Ljc1Ljc1IDAgMDAwLTEuNXpNNi4zOTUgNy4zYTEuNzUgMS43NSAwIDExMy4yMSAxLjQgMS43NSAxLjc5IDAgMDEtMy4yMS0xLjR6IiBjbGlwUnVsZT0iZXZlbm9kZCIgLz48L2c+PC9zdmc+',
                    'filter': 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMjguODYgLTEyOC44NiA2MjUuODkgNjI1Ljg5Ij48ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZVdpZHRoPSIwIj48L2c+PGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlTGluZWNhcD0icm91bmQiIHN0cm9rZUxpbmVqb2luPSJyb3VuZCI+PC9nPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48Zz48Zz48Zz48cGF0aCBkPSJNMjQ4LjA4NCw5Ni42ODRoMTJjNC40LDAsOC0zLjYsOC04YzAtNC40LTMuNi04LTgtOGgtMTJjLTQuNCwwLTgsMy42LTgsOEMyNDAuMDg0LDkzLjA4NCwyNDMuNjg0LDk2LjY4NCwyNDguMDg0LDk2LjY4NCB6Ij48L3BhdGg+PHBhdGggZD0iTTM2Ni40ODQsMjUuNDg0Yy0yLjgtNS42LTguNC04LjgtMTQuNC04LjhoLTMzNmMtNiwwLTExLjYsMy42LTE0LjQsOC44Yy0yLjgsNS42LTIsMTIsMS42LDE2LjhsMTQxLjIsMTc3LjZ2MTE1LjYgYzAsNiwzLjIsMTEuMiw4LjQsMTRjMi40LDEuMiw0LjgsMiw3LjYsMmMzLjIsMCw2LjQtMC44LDkuMi0yLjhsNDQuNC0zMC44YzYuNC00LjgsMTAtMTIsMTAtMTkuNnYtNzguOGwxNDAuOC0xNzcuMiBDMzY4LjQ4NCwzNy40ODQsMzY5LjI4NCwzMS4wODQsMzY2LjQ4NCwyNS40ODR6IE0yMDkuNjg0LDIxMS44ODRjLTAuOCwxLjItMS42LDIuOC0xLjYsNC44djgxLjJjMCwyLjgtMS4yLDUuMi0zLjIsNi44IGwtNDQuNCwzMC44di0xMTguOGMwLTIuOC0xLjItNS4yLTMuMi02LjRsLTkwLjQtMTEzLjZoMTQ1LjJjNC40LDAsOC0zLjYsOC04YzAtNC40LTMuNi04LTgsOGgtMTU2Yy0wLjQsMC0xLjIsMC0xLjYsMGwtMzguNC00OCBoMzM2TDIwOS42ODQsMjExLjg4NHoiPjwvcGF0aD48L2c+PC9nPjwvZz48L2c+PC9zdmc+',
                    'route': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItOC40IC04LjQgNDAuODAgNDAuODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZmZmZiI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCIgLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiAvPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48ZyBkYXRhLW5hbWU9IlByb2R1Y3QgSWNvbnMiPjxnPjxnPjxnIGRhdGEtbmFtZT0iIDI0IHJvdXRlciI+IDxwYXRoIHN0eWxlPSJmaWxsOiAjZmZmZmZmIiBkPSJNMTksMTR2M2wtNS01LDUtNXYzaDN2NFpNNSwxMEgydjRINXYzbDUtNUw1LDdabTksN1YxNEgxMHYzSDdsNSw1LDUtNVpNMTQsN3YzSDEwVjdIN2w1LTUsNSw1WiIgLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==',
                    'endpoint': 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB2ZXJzaW9uPSIxLjEiIGlkPSJYTUxJRF8xMzlfIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04LjQgLTguNCA0MC44MCA0MC44MCI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCIgLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiAvPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPGcgaWQ9InNlcnZlci1jbHVzdGVyIj4gPGc+IDxwYXRoIHN0eWxlPSJmaWxsOiAjZmZmZmZmIiBkPSJNMjQsMjNIMFYwaDI0VjIzIHogTTIsMjFoMjB2LTVIMFY5SDE2VjcgeiIgLz4gPC9nPiA8Zz4gPHJlY3QgeD0iMTMiIHk9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIC8+IDwvZz4gPGc+IDxyZWN0IHg9IjE2IiB5PSIzIiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiAvPiA8L2c+IDxnPiA8cmVjdCB4PSIxOSIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMyIgLz4gPC9nPiA8Zz4gPHJlY3QgeD0iMTMiIHk9IjEwIiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiAvPiA8L2c+IDxnPiA8cmVjdCB4PSIxNiIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIC8+IDwvZz4gPGc+IDxyZWN0IHg9IjE5IiB5PSIxMCIgd2lkdGg9IjIiIGhlaWdodD0iMyIgLz4gPC9nPiA8Zz4gPHJlY3QgeD0iMTMiIHk9IjE3IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiAvPiA8L2c+IDxnPiA8cmVjdCB4PSIxNiIgeT0iMTciIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIC8+IDwvZz4gPGc+IDxyZWN0IHg9IjE5IiB5PSIxNyIgd2lkdGg9IjIiIGhlaWdodD0iMyIgLz4gPC9nPiA8L2c+IDwvZz48L3N2Zz4=',
                    'tls': 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB2aWV3Qm94PSItNi40IC02LjQgNDQuODAgNDQuODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCIgLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiAvPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48dGl0bGU+VGxzPC90aXRsZT48cGF0aCBkPSJNMTUuOTg2IDIxLjY1MmMwLjAwNC0wIDAuMDA5LTAgMC4wMTQtMCAwLjg4MyAwIDEuNTk5IDAuNzE2IDEuNTk5IDEuNTk5IDAgMC41OTQtMC4zMjMgMS4xMTItMC44MDQgMS4zODdsLTAuMDA4IDAuMDA0djEuNTU2Yy0wLjAwMyAwLjQzMi0wLjM1NCAwLjc4MS0wLjc4NyAwLjc4MXMtMC43ODQtMC4zNDktMC43ODctMC43ODF2LTEuNTU2Yy0wLjQ4OC0wLjI4LTAuODEyLTAuNzk4LTAuODEyLTEuMzkxIDAtMC44NzggMC43MDgtMS41OTEgMS41ODQtMS41OThoMC4wMDF6TTIuOTE1IDEzLjE4N2MtMC41NzMgMC4wNDQtMS4wMjEgMC41Mi0xLjAyMSAxLjFzMC40NDggMS4wNTYgMS4wMTcgMS4xbDAuMDA0IDBIMy43NDdjMC41NzMtMC4wNDQgMS4wMjEtMC41MiAxLjAyMS0xLjFzLTAuNDQ4LTEuMDU2LTEuMDE3LTEuMWwtMC4wMDQtMHpNMjUuMjE0IDEzLjE4NGMtMC42MDggMC4wMDItMS4xIDAuNDk1LTEuMSAxLjEwMyAwIDAuNjA5IDAuNDk0IDEuMTAzIDEuMTAzIDEuMTAzIDAuMDMwIDAgMC4wNTktMC4wMDEgMC4wODgtMC4wMDNsLTAuMDA0IDBoMy43ODJjMC41NzMtMC4wNDQgMS4wMjEtMC41MiAxLjAyMS0xLjFzLTAuNDQ4LTEuMDU2LTEuMDE3LTEuMWwtMC4wMDQtMGgtMy43ODJxLTAuMDQ0LTAuMDAzLTAuMDg4LTAuMDAzek0xNS45OTEgMTIuNTU1YzAuMDAzIDAgMC4wMDYgMCAwLjAwOSAwIDEuNDg1IDAgMi42ODkgMS4yMDQgMi42ODkgMi42ODkgMCAwIDAgMCAwIDB2MCAxLjg1OWgtNS4zNzl2LTEuODU5YzAgMCAwLTAgMC0wIDAtMS40ODIgMS4xOTktMi42ODQgMi42OC0yLjY4OWgwLjAwMXpNMTUuOTc1IDguOTM5Yy0zLjQ3MiAwLjAxNC02LjI4MSAyLjgzMS02LjI4MSA2LjMwNXYwIDEuODU5aC0xLjQ1OGMtMC42NjUgMC4wMDItMS4yMDMgMC41NC0xLjIwNiAxLjIwNXYxMS40ODNjMC4wMDIgMC42NjUgMC41NDEgMS4yMDMgMS4yMDUgMS4yMDVoMTUuNTI4YzAuNjY1LTAuMDAyIDEuMjAzLTAuNTQgMS4yMDUtMS4yMDV2LTExLjQ4NWMtMC0zLjQ4Mi0yLjgyMy02LjMwNS02LjMwNS02LjMwNS0wLjAwOCAwLTAuMDE3IDAtMC4wMjUgMGgwLjAwMXpNNi40MDMgNC45MDZjLTAgMC0wIDAtMCAwLTAuNjA5IDAtMS4xMDMgMC40OTQtMS4xMDMgMS4xMDMgMCAwLjMxMyAwLjEzIDAuNTk2IDAuMzQgMC43OTdsMCAwIDIuOTYyIDIuNDM3YzAuMTg4IDAuMTU2IDAuNDMxIDAuMjUgMC42OTYgMC4yNSAwLjAwMiAwIDAuMDAzIDAgMC4wMDQgMGgtMHYtMC4wMDJjMCAwIDAgMCAwIDAgMC42MDggMCAxLjEtMC40OTMgMS4xLTEuMSAwLTAuMzQxLTAuMTU1LTAuNjQ2LTAuMzk5LTAuODQ4bC0wLjAwMi0wLjAwMS0yLjk2NC0yLjQzNWMtMC4xNzctMC4xMjYtMC4zOTctMC4yMDEtMC42MzUtMC4yMDFoLTB6TTI1LjYxNyA0Ljg4OWMtMC4yNDYgMC4wMDEtMC40NzIgMC4wODMtMC42NTQgMC4yMmwwLjAwMy0wLjAwMi0yLjk2NyAyLjQzNGMtMC4yNDcgMC4yMDMtMC40MDIgMC41MDktMC40MDIgMC44NTEgMCAwLjYwOCAwLjQ5MyAxLjEwMSAxLjEwMSAxLjEwMSAwLjI2NiAwIDAuNTEtMC4wOTQgMC43MDEtMC4yNTJsLTAuMDAyIDAuMDAyIDIuOTYzLTIuNDM4YzAuMjIzLTAuMjAyIDAuMzYzLTAuNDkzIDAuMzYzLTAuODE3IDAtMC42MDgtMC40OTMtMS4xLTEuMS0xLjEtMC4wMDIgMC0wLjAwNCAwLTAuMDA2IDBsMHpNMTUuOTg5IDEuMDA0Yy0wLjU3NiAwLjAwNi0xLjA0NiAwLjQ1Mi0xLjA4OSAxLjAxN2wtMCAwLjAwNHYzLjc3NWMwLjAwNCAwLjYwNSAwLjQ5NSAxLjA5NCAxLjEgMS4wOTQgMC42MDQgMCAxLjA5NS0wLjQ4NyAxLjEtMS4wOXYtMy43NzljLTAuMDQ0LTAuNTczLTAuNTItMS4wMjEtMS4xLTEuMDIxLTAuMDA0IDAtMC4wMDcgMC0wLjAxMSAwaDArMC4wMDF6Ij48L3BhdGg+PC9nPjwvc3ZnPg==',
                    'bootstrap': 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB2aWV3Qm94PSItMy42IC0zLjYgMzEuMjAgMzEuMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCI+PC9nPjxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZUxpbmVjYXA9InJvdW5kIiBzdHJva2VMaW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHBvbHlnb24gaWQ9InNlY29uZGFyeSIgcG9pbnRzPSI5IDggOSAxNiAxNSAxMiA5IDgiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6ICNmZmZmZmY7IHN0cm9rZUxpbmVjYXA6IHJvdW5kOyBzdHJva2VMaW5lam9pbjogcm91bmQ7IHN0cm9rZVdpZHRoOiAyOyIgPjwvcG9seWdvbj48cmVjdCBpZD0icHJpbWFyeSIgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMSIgc3R5bGU9ImZpbGw6IG5vbmU7IHN0cm9rZTogI2ZmZmZmZjsgc3Ryb2tlTGluZWNhcDogcm91bmQ7IHN0cm9rZUxpbmVqb2luOiByb3VuZDsgc3Ryb2tlV2lkdGg6IDI7IiA+PC9yZWN0PjwvZz48L3N2Zz4=',
                    'secret': 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iLTYzLjE2IC02My4xNiAzNzguOTYgMzc4Ljk2IiBmaWxsPSIjZmZmZmZmIj48ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZVdpZHRoPSIwIj48L2c+PGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlTGluZWNhcD0icm91bmQiIHN0cm9rZUxpbmVqb2luPSJyb3VuZCI+PC9nPjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj48Zz48cGF0aCBzdHlsZT0iZmlsbDogI2ZmZmZmZiIgZD0iTTIzNS4xNDMsMTcuMDgxSDE3LjVjLTkuNjQ5LDAtMTcuNSw3Ljg1MS0xNy41LDE3LjV2MTQ3LjY1OGMwLDkuNjQ5LDcuODUxLDE3LjUsMTcuNSwxNy41aDEyNi45MTEgbC0zLjgzMiwyMy4zN2MtMC43MjEsNC4zOTksMC43MzQsOC4zODQsMy44OTMsMTAuNjU4YzMuMTU4LDIuMjc0LDcuMzk2LDIuMzk2LDExLjM0MSwwLjMxN2wyNy4zODEtMTQuNDEyIGMwLjc2NC0wLjM5MiwyLjg2OS0wLjM5MiwzLjYzMywwbDI3LjM4MSwxNC40MTJjMS44NzMsMC45ODYsMy44MTMsMS40NzcsNS42NzIsMS40NzdjMi4wNTYsMCw0LjAxMi0wLjYwMSw1LjY3LTEuNzk1IGMzLjE1OC0yLjI3NCw0LjYxMy02LjI2LDMuODkzLTEwLjY1OWwtMy44MzEtMjMuMzY5aDkuNTMyYzkuNjQ5LDAsMTcuNS03Ljg1MSwxNy41LTE3LjVWMzQuNTgxIEMyNTIuNjQzLDI0LjkzMSwyNDQuNzkyLDE3LjA4MSwyMzUuMTQzLDE3LjA4MXogTTE4NS4wMTEsMTY5Ljc0M2MtMTYuODE3LDAtMzAuNS0xMy42ODMtMzAuNS0zMC41YzAtMTYuODE3LDEzLjY4My0zMC41LDMwLjUtMzAuNSBzMzAuNSwxMy42ODMsMzAuNSwzMC41QzIxNS41MTEsMTU2LjA2LDIwMS44MjgsMTY5Ljc0MywxODUuMDExLDE2OS43NDN6IE0xOTMuODE0LDIwNi4zOTljLTUuMTAxLTIuNjg2LTEyLjUwNi0yLjY4Ni0xNy42MDYsMCBsLTE5LjM1OCwxMC4xODlsNi4xNTQtMzcuNTM5YzYuNTI3LDMuNjIzLDE0LjAyOSw1LjY5MywyMi4wMDgsNS42OTNzMTUuNDgtMi4wNzEsMjIuMDA4LTUuNjkzbDIuMzk4LDE0LjYzNSBjMC4wMDYsMC4wMjQsMC4wMDgsMC4wNSwwLjAxMywwLjA3NGwzLjc0MywyMi44MzFMMTkzLjgxNCwyMDYuMzk5eiBNMjM3LjY0MywxODIuMjM5YzAsMS4zNTUtMS4xNDUsMi41LTIuNSwyLjVoLTExLjk5MSBsLTIuNzM5LTE2LjcwOWMtMC4wMTEtMC4wNjYtMC4wMjktMC4xMjktMC4wNDItMC4xOTVjNi4zMzUtNy44MTgsMTAuMTQxLTE3Ljc2OCwxMC4xNDEtMjguNTkyYzAtMjUuMDg5LTIwLjQxMS00NS41LTQ1LjUtNDUuNSBjLTI1LjA4OSwwLTQ1LjUsMjAuNDExLTQ1LjUsNDUuNWMwLDEwLjgyNCwzLjgwNiwyMC43NzIsMTAuMTQxLDI4LjU5MmMtMC4wMTMsMC4wNjUtMC4wMzEsMC4xMjktMC4wNDIsMC4xOTRsLTIuNzQxLDE2LjcyMyBjLTAuMDg0LTAuMDAzLTAuMTY1LTAuMDEzLTAuMjQ5LTAuMDEzSDE3LjVjLTEuMzU1LDAtMi41LTEuMTQ1LTIuNS0yLjVWMzQuNTgxYzAtMS4zNTUsMS4xNDUtMi41LDIuNS0yLjVoMjE3LjY0MyBjMS4zNTUsMCwyLjUsMS4xNDUsMi41LDIuNVYxODIuMjM5eiI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiAjZmZmZmZmIiBkPSJNMjA4LjYxOSw2MC4yNDNoLTE3MGMtNC4xNDMsMC03LjUsMy4zNTctNy41LDcuNWMwLDQuMTQzLDMuMzU3LDcuNSw3LjUsNy41aDE3MCBjNC4xNDMsMCw3LjUtMy4zNTcsNy41LTcuNUMyMTYuMTE5LDYzLjYsMjEyLjc2Miw2MC4yNDMsMjA4LjYxOSw2MC4yNDN6Ij48L3BhdGg+IDxwYXRoIHN0eWxlPSJmaWxsOiAjZmZmZmZmIiBkPSJNMTEwLjYxOSwxMDAuOTExaC03MmMtNC4xNDMsMC03LjUsMy4zNTctNy41LDcuNWMwLDQuMTQzLDMuMzU3LDcuNSw3LjUsNy41aDcyIGM0LjE0MywwLDcuNS0zLjM1Nyw3LjUtNy41QzExOC4xMTksMTA0LjI2OCwxMTQuNzYyLDEwMC45MTEsMTEwLjYxOSwxMDAuOTExeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+',
                    'extension': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItNC44IC00LjggMzMuNjAgMzMuNjAiIGZpbGw9IiNmZmZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgYXJpYS1sYWJlbGxlZGJ5PSJleHRlbnNpb25JY29uVGl0bGUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlV2lkdGg9IjEiIHN0cm9rZUxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlTGluZWpvaW49Im1pdGVyIiBjb2xvcj0iI2ZmZmZmZiI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2VXaWR0aD0iMCI+PC9nPjxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZUxpbmVjYXA9InJvdW5kIiBzdHJva2VMaW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHRpdGxlIGlkPSJleHRlbnNpb25JY29uVGl0bGUiPkV4dGVuc2lvbjwvdGl0bGU+PHBhdGggZD0iTTkgNEM5IDIuODk1NDMgOS44OTU0MyAyIDExIDJDMTIuMTA0NiAyIDEzIDIuODk1NDMgMTMgNFY2SDE4VjExSDIwQzIxLjEwNDYgMTEgMjIgMTEuODk1NCAyMiAxM0MyMiAxNC4xMDQ2IDIxLjEwNDYgMTUgMjAgMTVIMThWMjBIMTNWMThDMTMgMTYuODk1NCAxMi4xMDQ2IDE2IDExIDE2QzkuODk1NDMgMTYgOSAxNi44OTU0IDkgMThWMjBINFYxNUg2QzcuMTA0NTcgMTUgOCAxNC4xMDQ2IDggMTNDOCAxMS44OTU0IDcuMTA0NTcgMTEgNiAxMUg0VjZIOVY0WiI+PC9wYXRoPjwvZz48L3N2Zz4=',
                    'virtual_host': 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItMTYuOCAtMTYuOCA4MS42MCA4MS42MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZVdpZHRoPSIwLjAwMDQ4MDAwMDAwMDAwMDAwMDA3Ij48ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZVdpZHRoPSIwIiAvPjxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZUxpbmVjYXA9InJvdW5kIiBzdHJva2VMaW5lam9pbj0icm91bmQiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlV2lkdGg9IjAuNDgwMDAwMDAwMDAwMDAwMSIgLz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+IDxnIGlkPSJpbnZpc2libGVfYm94IiBkYXRhLW5hbWU9ImludmlzaWJsZSBib3giPjxyZWN0IGZpbGw9Im5vbmUiIC8+PC9nPjxnIGlkPSJRM19pY29ucyIgZGF0YS1uYW1lPSJRMyBpY29ucyI+PGc+PHBhdGggZD0iTTEwLDQwaDZhMiwyLDAsMCwwLDAtNEgxMGEyLDIsMCwwLDAsMCw0WiIgLz4gPHBhdGggZD0iTTMyLDQwaDZhMiwyLDAsMCwwLDAtNEgzMmEyLDIsMCwwLDAsMCw0WiIgLz48cmVjdCB4PSI0IiB5PSIyIiB3aWR0aD0iMTAiIGhlaWdodD0iNyIgLz4gPHBhdGggZD0iTTMuNSwxNGgxMWExLjUsMS41LDAsMCwwLDAtM0gzLjVhMS41LDEuNSwwLDAsMCwwLDNaIiAvPjxyZWN0IHg9IjE5IiB5PSIyIiB3aWR0aD0iMTAiIGhlaWdodD0iNyIgLz4gPHBhdGggZD0iTTE4LjUsMTRoMTFhMS41LDEuNSwwLDAsMCwwLTNoLTExYTEuNSwxLjUsMCwwLDAsMCwzWiIgLz48cmVjdCB4PSIzNCIgeT0iMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjciIC8+IDxwYXRoIGQ9Ik0zMy41LDE0aDExYTEuNSwxLjUsMCwwLDAsMC0zaC0xMWExLjUsMS41LDAsMCwwLDAsM1oiIC8+PHBhdGggZD0iTTQ0LDMwSDI2VjI1LjVIMzlhMiwyLDAsMCwwLDItMlYxOGEyLDIsMCwwLDAtNCwwdjMuNUgyNlYxOGEyLDIsMCwwLDAtNCwwdjMuNUgxMVYxOGEyLDIsMCwwLDAtNCwwdjUuNWEyLDIsMCwwLDAsMiwySDIyVjMwSDRhMiwyLDAsMCwwLTIsMlY0NGEyLDIsMCwwLDAsMiwySDQ0YTIsMiAwLDAsMCwyLTJWMzJBMiwyLDAsMCwwLDQ0LDMwWk00Miw0Mkg2VjM0SDQyWiIgLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+'
                };
                
                // Simple category-to-icon mapping
                const categoryMap: { [key: string]: string } = {
                    listeners: 'listener',
                    clusters: 'cluster', 
                    filters: 'filter',
                    routes: 'route',
                    endpoints: 'endpoint',
                    virtual_hosts: 'virtual_host',
                    extensions: 'extension',
                    secrets: 'secret',
                    tls: 'tls',
                    bootstrap: 'bootstrap'
                };
                
                // Get icon from category mapping
                const iconKey = categoryMap[category] || null;
                const iconUrl = iconKey ? iconSvgMap[iconKey] : null;

                if (iconUrl) {
                    const iconEl = document.createElement('img');
                    iconEl.src = iconUrl;
                    iconEl.style.cssText = `
                        width: 28px;
                        height: 28px;
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
                    // Set node background color based on category
                    const category = node.data('category');
                    const nodeStyle = getNodeStyle(category);
                    node.style({
                        'background-color': nodeStyle.bg,
                        'border-color': nodeStyle.border
                    });

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

            // Node mouseover effect with modern animations
            cy.on('mouseover', 'node', function (e) {
                const node = e.target;

                node.style({
                    'border-width': 3,
                    'border-style': 'solid',
                    'border-color': ThemeColors.edge.highlighted,
                    'transform': 'scale(1.05)',
                    'transition-duration': '200ms'
                });

                // Icon effect (smooth scale)
                const iconDiv = document.getElementById(`icon-${node.id()}`);
                if (iconDiv) {
                    const iconImg = iconDiv.querySelector('img');
                    if (iconImg) {
                        iconImg.style.transform = 'scale(1.1)';
                        iconImg.style.transition = 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                }
            });

            // Node mouseout effect
            cy.on('mouseout', 'node', function (e) {
                const node = e.target;
                if (!node.hasClass('highlighted')) {
                    node.style({
                        'border-width': 2,
                        'border-style': 'solid',
                        'border-color': function () {
                            return getNodeStyle(node.data('category')).border;
                        },
                        'transform': 'scale(1)',
                        'transition-duration': '200ms'
                    });
                }

                // Return icon to normal
                const iconDiv = document.getElementById(`icon-${node.id()}`);
                if (iconDiv) {
                    const iconImg = iconDiv.querySelector('img');
                    if (iconImg) {
                        iconImg.style.transform = 'scale(1)';
                        iconImg.style.transition = 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                }
            });

            // Edge hover effects
            cy.on('mouseover', 'edge', function (e) {
                const edge = e.target;
                edge.style({
                    'width': 6,
                    'line-color': ThemeColors.edge.hover,
                    'target-arrow-color': ThemeColors.edge.hover,
                    'opacity': 1
                });
            });

            cy.on('mouseout', 'edge', function (e) {
                const edge = e.target;
                if (!edge.hasClass('highlighted')) {
                    edge.style({
                        'width': 4,
                        'line-color': ThemeColors.edge.default,
                        'target-arrow-color': ThemeColors.edge.default,
                        'opacity': 1
                    });
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