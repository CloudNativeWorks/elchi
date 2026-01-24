import React, { memo } from "react";
import { Col, Row, Space } from 'antd';

interface RenderLoadingProps {
    checkPage: boolean;
    isLoadingQuery: boolean;
    error?: any;
}

const RenderLoading: React.FC<RenderLoadingProps> = memo(({ checkPage, isLoadingQuery, error }) => {
    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) {
            return error.message;
        }
        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    };

    if (!checkPage) return null;
    
    if (error !== "") {
        return (
            <div>
                <strong>An error has occurred:</strong> {getErrorMessage(error)}
            </div>
        );
    }

    if (!isLoadingQuery) return null;

    return (
        <div style={{ 
            padding: '0px',
            minHeight: '80vh',
            backdropFilter: 'blur(10px)',
        }}>
            {/* Progress Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'var(--bg-hover)',
                zIndex: 1000,
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    borderRadius: '0 2px 2px 0',
                    animation: 'progressFill 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    transform: 'translateX(-100%)'
                }} />
            </div>
            
            <style>{`
                @keyframes progressFill {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(0%);
                    }
                }
                @keyframes smoothFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                        filter: blur(5px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0px);
                    }
                }

                @keyframes smoothPulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.02);
                    }
                }

                @keyframes smoothWave {
                    0% {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(300%);
                        opacity: 0;
                    }
                }

                .smooth-skeleton {
                    position: relative;
                    overflow: hidden;
                    background: var(--skeleton-gradient, linear-gradient(90deg,
                        rgba(240, 242, 247, 0.8) 0%,
                        rgba(255, 255, 255, 0.9) 50%,
                        rgba(240, 242, 247, 0.8) 100%
                    ));
                    border-radius: 8px;
                    animation: smoothPulse 2s ease-in-out infinite;
                }

                .smooth-skeleton::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--skeleton-shimmer, linear-gradient(90deg,
                        transparent 0%,
                        rgba(255,255,255,0.6) 50%,
                        transparent 100%
                    ));
                    animation: smoothWave 3s ease-in-out infinite;
                }

                .loading-card {
                    background: var(--loading-card-bg, rgba(255, 255, 255, 0.9));
                    border: 1px solid var(--loading-card-border, rgba(240, 242, 247, 0.8));
                    border-radius: 16px;
                    backdrop-filter: blur(20px);
                    box-shadow: var(--loading-card-shadow, 0 8px 32px rgba(0, 0, 0, 0.04));
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .loading-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--loading-card-shadow-hover, 0 12px 40px rgba(0, 0, 0, 0.08));
                }
            `}</style>
            
            <div className="loading-card" style={{ 
                marginBottom: 24,
                padding: 32
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div className="smooth-skeleton" style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '50%' 
                    }} />
                    <div style={{ flex: 1 }}>
                        <div className="smooth-skeleton" style={{ 
                            height: 24, 
                            marginBottom: 12,
                            width: '65%'
                        }} />
                        <div className="smooth-skeleton" style={{ 
                            height: 16,
                            width: '45%'
                        }} />
                    </div>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={6}>
                    <div className="loading-card" style={{ padding: 24 }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {Array.from({ length: 6 }, (_, i) => (
                                <div key={i} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 12,
                                    animationDelay: `${i * 0.1}s`
                                }}>
                                    <div className="smooth-skeleton" style={{ 
                                        width: 12, 
                                        height: 12, 
                                        borderRadius: '50%'
                                    }} />
                                    <div className="smooth-skeleton" style={{ 
                                        height: 16,
                                        width: `${65 + (i * 5)}%`,
                                        flex: 1
                                    }} />
                                </div>
                            ))}
                        </Space>
                    </div>
                </Col>
                <Col span={18}>
                    <div className="loading-card" style={{ padding: 32 }}>
                        <Space direction="vertical" size={32} style={{ width: '100%' }}>
                            {Array.from({ length: 4 }, (_, i) => (
                                <div key={i} style={{ 
                                    animationDelay: `${i * 0.15}s`
                                }}>
                                    <div className="smooth-skeleton" style={{ 
                                        height: 20, 
                                        marginBottom: 16,
                                        width: '25%'
                                    }} />
                                    <div className="smooth-skeleton" style={{ 
                                        height: 48, 
                                        marginBottom: 12,
                                        borderRadius: 12
                                    }} />
                                    <div className="smooth-skeleton" style={{ 
                                        height: 14,
                                        width: '80%'
                                    }} />
                                </div>
                            ))}
                        </Space>
                    </div>
                </Col>
            </Row>
        </div>
    );
});

RenderLoading.displayName = 'RenderLoading';

export default RenderLoading;