import styled from 'styled-components';
import { Select, Space, Button, Badge } from 'antd';

interface ThemeProps {
    background: string;
}

export const ToolbarContainer = styled.div<{ $theme: ThemeProps }>`
    background: ${props => props.$theme.background};
    border-radius: 12px;
    padding: 6px 8px;
    margin-bottom: 24px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    display: flex;
    border: 1px solid rgba(32, 181, 227, 0.3);
    align-items: flex-start;
    gap: 16px;
    position: sticky;
    top: 16px;
    z-index: 100;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
    flex-wrap: wrap;

    &:hover {
        box-shadow: 0 4px 12px rgba(32, 181, 227, 0.3);
    }

    @media (max-width: 1200px) {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        
        > * {
            flex: none;
        }
        
        .time-controls-container {
            margin-left: 0 !important;
        }
    }

    @media (max-width: 768px) {
        padding: 12px 16px;
        gap: 8px;
    }

    .ant-select {
        border-radius: 8px;
        height: 38px !important;
        
        .ant-select-selector {
            border-radius: 8px !important;
            height: 38px !important;
            padding: 0 16px !important;
            display: flex !important;
            align-items: center !important;
            
            .ant-select-selection-placeholder {
                line-height: 38px !important;
                height: 38px !important;
                display: flex !important;
                align-items: center !important;
            }

            .ant-select-selection-search {
                display: flex !important;
                align-items: center !important;
                margin-inline-start: 0 !important;
                height: 38px !important;
                
                .ant-select-selection-search-input {
                    height: 38px !important;
                    padding: 0 !important;
                }
            }
            
            .ant-select-selection-item {
                padding: 0 !important;
                margin: 0 !important;
                line-height: 38px !important;
                height: 38px !important;
                display: flex !important;
                align-items: center !important;
            }
        }

        .ant-select-arrow {
            margin-top: 0 !important;
            top: 15px !important;
            right: 11px !important;
        }
    }

    .ant-picker {
        border-radius: 8px;
        height: 38px;
        
        input {
            font-size: 13px;
        }
    }

    .ant-btn {
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        height: 38px;
        padding: 0 16px;
        font-weight: 500;
        transition: all 0.2s ease;

        &:not(:disabled):hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .anticon {
            font-size: 16px;
        }
    }
`;

export const TimeControls = styled(Space.Compact)`
    background: ${props => props.theme.antd?.colorBgContainer};
    border-radius: 8px;
    padding: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    flex-wrap: nowrap;
    flex-shrink: 0;

    .ant-picker {
        &:hover {
            border-color: #4096ff;
        }
        
        &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        
        &:nth-child(2) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        @media (max-width: 1200px) {
            width: 160px !important;
        }

        @media (max-width: 768px) {
            width: 140px !important;
        }
    }

    .ant-btn {
        &:last-child {
            margin-right: -1px;
        }

        @media (max-width: 768px) {
            min-width: 50px;
            padding: 0 8px;
            
            .btn-text {
                display: none;
            }
        }
    }
`;

export const QuickRangeSelect = styled(Select)`
    min-width: 160px;
    max-width: 220px;
    flex-shrink: 0;
    
    .ant-select-selector {
        border-radius: 8px !important;
    }

    @media (max-width: 1200px) {
        min-width: 150px;
        max-width: 180px;
    }

    @media (max-width: 768px) {
        min-width: 120px;
        max-width: 150px;
        
        .ant-select-selection-item {
            font-size: 12px;
        }
    }
`;

export const ServiceSelect = styled(Select)`
    min-width: 230px;
    max-width: 300px;
    width: 35%;
    flex-shrink: 0;
    
    .ant-select-selector {
        background: rgba(0, 0, 0, 0.02) !important;
    }

    @media (max-width: 1200px) {
        width: 100%;
        min-width: unset;
        max-width: unset;
    }

    @media (max-width: 768px) {
        min-width: unset;
    }
`;

export const RefreshButton = styled(Button) <{ $success?: boolean }>`
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    ${props => props.$success && `
        &:hover, &:focus {
            background: ${props.theme.antd?.colorSuccess}!important;
            border-color: ${props.theme.antd?.colorSuccess}!important;
            opacity: 0.85;
        }
    `}

    .anticon {
        color: inherit;
    }
`;


export const NavigatorContainer = styled.div`
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
`;

export const FloatingButton = styled(Button) <{ $isOpen: boolean }>`
    width: 16px;
    height: 120px;
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    background: ${props => props.$isOpen ? '#1890ff' : 'white'};
    border-color: ${props => props.$isOpen ? '#1890ff' : '#d9d9d9'};
    color: ${props => props.$isOpen ? 'white' : '#1890ff'};
    border-right: none;
    padding: 0;
    
    &:hover {
        background: ${props => props.$isOpen ? '#096dd9' : '#f0f7ff'};
        border-color: ${props => props.$isOpen ? '#096dd9' : '#1890ff'};
        color: ${props => props.$isOpen ? 'white' : '#1890ff'};
        width: 20px;
    }
    
    transition: all 0.3s ease;
    
    .anticon {
        transform: rotate(90deg);
        font-size: 12px;
    }
`;

export const SearchContainer = styled.div`
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
`;

export const SectionHeader = styled.div`
    padding: 12px 16px 8px;
    background: #f8f9fa;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .ant-typography {
        margin: 0;
        color: #1890ff;
        font-weight: 600;
    }
`;

export const MetricItem = styled.div<{ $isHighlighted: boolean }>`
    padding: 8px 16px;
    margin: 0;
    cursor: pointer;
    border-left: 3px solid transparent;
    background: ${props => props.$isHighlighted ? 'rgba(24, 144, 255, 0.05)' : 'transparent'};
    border-left-color: ${props => props.$isHighlighted ? '#1890ff' : 'transparent'};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    &:hover {
        background: rgba(24, 144, 255, 0.08);
        border-left-color: #1890ff;
    }
    
    transition: all 0.2s ease;
    
    .metric-title {
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .metric-meta {
        color: #666;
        font-size: 12px;
    }
`;

export const CountBadge = styled(Badge)`
    .ant-badge-count {
        background: #1890ff;
        font-size: 10px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        border-radius: 8px;
    }
`;