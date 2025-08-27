import React from 'react';

interface SVGProps {
    className: string;
}

const cls1 = { fill: 'none' };
const cls2 = { fill: '#056ccd', strokeWith: 2 };
const cls3 = { fill: '#056ccd' };
const cls6 = { fill: '#056ccd' };
const cls4 = { fill: '#056ccd' };
const cls5 = { fill: '#056ccd', stroke: '#056ccd', StrokeLinecap: 'round', StrokeLinejoin: 'round', StrokeWidth: 2 };

export const SCRTSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="-63.16 -63.16 378.96 378.96" fill="#056ccd">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path style={cls6} d="M235.143,17.081H17.5c-9.649,0-17.5,7.851-17.5,17.5v147.658c0,9.649,7.851,17.5,17.5,17.5h126.911 l-3.832,23.37c-0.721,4.399,0.734,8.384,3.893,10.658c3.158,2.274,7.396,2.396,11.341,0.317l27.381-14.412 c0.764-0.392,2.869-0.392,3.633,0l27.381,14.412c1.873,0.986,3.813,1.477,5.672,1.477c2.056,0,4.012-0.601,5.67-1.795 c3.158-2.274,4.613-6.26,3.893-10.659l-3.831-23.369h9.532c9.649,0,17.5-7.851,17.5-17.5V34.581 C252.643,24.931,244.792,17.081,235.143,17.081z M185.011,169.743c-16.817,0-30.5-13.683-30.5-30.5c0-16.817,13.683-30.5,30.5-30.5 s30.5,13.683,30.5,30.5C215.511,156.06,201.828,169.743,185.011,169.743z M193.814,206.399c-5.101-2.686-12.506-2.686-17.606,0 l-19.358,10.189l6.154-37.539c6.527,3.623,14.029,5.693,22.008,5.693s15.48-2.071,22.008-5.693l2.398,14.635 c0.006,0.024,0.008,0.05,0.013,0.074l3.743,22.831L193.814,206.399z M237.643,182.239c0,1.355-1.145,2.5-2.5,2.5h-11.991 l-2.739-16.709c-0.011-0.066-0.029-0.129-0.042-0.195c6.335-7.818,10.141-17.768,10.141-28.592c0-25.089-20.411-45.5-45.5-45.5 c-25.089,0-45.5,20.411-45.5,45.5c0,10.824,3.806,20.772,10.141,28.592c-0.013,0.065-0.031,0.129-0.042,0.194l-2.741,16.723 c-0.084-0.003-0.165-0.013-0.249-0.013H17.5c-1.355,0-2.5-1.145-2.5-2.5V34.581c0-1.355,1.145-2.5,2.5-2.5h217.643 c1.355,0,2.5,1.145,2.5,2.5V182.239z"></path>
                        <path style={cls6} d="M208.619,60.243h-170c-4.143,0-7.5,3.357-7.5,7.5c0,4.143,3.357,7.5,7.5,7.5h170 c4.143,0,7.5-3.357,7.5-7.5C216.119,63.6,212.762,60.243,208.619,60.243z"></path> <path style={cls6} d="M110.619,100.911h-72c-4.143,0-7.5,3.357-7.5,7.5c0,4.143,3.357,7.5,7.5,7.5h72 c4.143,0,7.5-3.357,7.5-7.5C118.119,104.268,114.762,100.911,110.619,100.911z">
                        </path>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const HOMESVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#000000" viewBox="-8.4 -8.4 40.80 40.80" id="dashboard" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <path id="secondary" d="M9,12H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H9a1,1,0,0,1,1,1v7A1,1,0,0,1,9,12Zm12,8V13a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1v7a1,1,0,0,0,1,1h5A1,1,0,0,0,21,20Z" style={cls2} />
                    <path style={cls5} id="primary" d="M21,7V4a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V7a1,1,0,0,0,1,1h5A1,1,0,0,0,21,7ZM10,20V17a1,1,0,0,0-1-1H4a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H9A1,1,0,0,0,10,20ZM9,12H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H9a1,1,0,0,1,1,1v7A1,1,0,0,1,9,12Zm12,8V13a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1v7a1,1,0,0,0,1,1h5A1,1,0,0,0,21,20Z" />
                </g>
            </svg>
        </div>
    );
};

export const LSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-8.4 -8.4 40.80 40.80" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <g data-name="Product Icons"> <g data-name="colored-32/load-balancing">
                        <rect style={cls1} /> <g>
                            <rect style={cls2} x="18" y="12" width="2" height="4" />
                            <rect style={cls2} x="11" y="12" width="2" height="4" />
                            <rect style={cls2} x="4" y="12" width="2" height="4" />
                            <polygon id="Fill-2" style={cls3} points="13 11 11 11 11 7 13 7 13 11" />
                            <rect style={cls2} x="4" y="11" width="16" height="2" />
                            <rect style={cls4} x="6" y="2" width="12" height="5" />
                            <rect style={cls2} x="12" y="2" width="6" height="5" />
                            <rect style={cls4} x="16" y="16" width="6" height="6" />
                            <rect style={cls4} x="2" y="16" width="6" height="6" />
                            <rect style={cls2} x="5" y="16" width="3" height="6" />
                            <rect style={cls4} x="9" y="16" width="6" height="6" />
                            <rect style={cls2} x="12" y="16" width="3" height="6" />
                            <rect style={cls2} x="19" y="16" width="3" height="6" />
                        </g> </g> </g> </g>
            </svg>
        </div>
    );
};

export const RSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-8.4 -8.4 40.80 40.80" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <g data-name="Product Icons">
                        <g>
                            <g>
                                <g data-name=" 24 router"> <path style={cls2} d="M19,14v3l-5-5,5-5v3h3v4ZM5,10H2v4H5v3l5-5L5,7Zm9,7V14H10v3H7l5,5,5-5ZM14,7v3H10V7H7l5-5,5,5Z" />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const SSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg xmlns="http://www.w3.org/2000/svg" id="mdi-alpha-s" viewBox="0 0 24 24"><path d="M11,7A2,2 0 0,0 9,9V11A2,2 0 0,0 11,13H13V15H9V17H13A2,2 0 0,0 15,15V13A2,2 0 0,0 13,11H11V9H15V7H11Z" /></svg>
        </div>
    );
};

export const VSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-16.8 -16.8 81.60 81.60" xmlns="http://www.w3.org/2000/svg" fill="#056ccd" stroke="#b81919" strokeWidth="0.00048000000000000007">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.4800000000000001" />
                <g id="SVGRepo_iconCarrier">
                    <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box">
                        <rect fill="none" />
                    </g>
                        <g id="Q3_icons" data-name="Q3 icons">
                            <g>
                                <path d="M10,40h6a2,2,0,0,0,0-4H10a2,2,0,0,0,0,4Z" /> <path d="M32,40h6a2,2,0,0,0,0-4H32a2,2,0,0,0,0,4Z" />
                                <rect x="4" y="2" width="10" height="7" /> <path d="M3.5,14h11a1.5,1.5,0,0,0,0-3H3.5a1.5,1.5,0,0,0,0,3Z" />
                                <rect x="19" y="2" width="10" height="7" /> <path d="M18.5,14h11a1.5,1.5,0,0,0,0-3h-11a1.5,1.5,0,0,0,0,3Z" />
                                <rect x="34" y="2" width="10" height="7" /> <path d="M33.5,14h11a1.5,1.5,0,0,0,0-3h-11a1.5,1.5,0,0,0,0,3Z" />
                                <path d="M44,30H26V25.5H39a2,2,0,0,0,2-2V18a2,2,0,0,0-4,0v3.5H26V18a2,2,0,0,0-4,0v3.5H11V18a2,2,0,0,0-4,0v5.5a2,2,0,0,0,2,2H22V30H4a2,2,0,0,0-2,2V44a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V32A2,2,0,0,0,44,30ZM42,42H6V34H42Z" />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const ESVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#056ccd" version="1.1" id="XMLID_139_" xmlns="http://www.w3.org/2000/svg" viewBox="-8.4 -8.4 40.80 40.80" >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier"> <g id="server-cluster"> <g> <path style={cls2} d="M24,23H0V0h24V23z M2,21h20v-5H2V21z M2,14h20V9H2V14z M2,7h20V2H2V7z" /> </g> <g> <rect x="13" y="3" width="2" height="3" /> </g> <g> <rect x="16" y="3" width="2" height="3" /> </g> <g> <rect x="19" y="3" width="2" height="3" /> </g> <g> <rect x="13" y="10" width="2" height="3" /> </g> <g> <rect x="16" y="10" width="2" height="3" /> </g> <g> <rect x="19" y="10" width="2" height="3" /> </g> <g> <rect x="13" y="17" width="2" height="3" /> </g> <g> <rect x="16" y="17" width="2" height="3" /> </g> <g> <rect x="19" y="17" width="2" height="3" /> </g> </g> </g>
            </svg>
        </div>
    );
};

export const CSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-5.6 -5.6 27.20 27.20" xmlns="http://www.w3.org/2000/svg" fill="#056ccd">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <path style={cls2} fillRule="evenodd" d="M8 0a2.25 2.25 0 00-.75 4.372v.465a3.25 3.25 0 00-1.797 1.144l-.625-.366a2.25 2.25 0 10-1.038 1.13l1.026.602a3.261 3.261 0 000 1.306l-1.026.601a2.25 2.25 0 101.038 1.13l.625-.366a3.25 3.25 0 001.797 1.145v.465a2.25 2.25 0 101.5 0v-.465a3.25 3.25 0 001.797-1.145l.625.366a2.25 2.25 0 101.038-1.13l-1.026-.6a3.26 3.26 0 000-1.307l1.026-.601a2.25 2.25 0 10-1.038-1.13l-.625.365A3.251 3.251 0 008.75 4.837v-.465A2.25 2.25 0 008 0zm-.75 2.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM2.75 4a.75.75 0 100 1.5.75.75 0 000-1.5zm0 6.5a.75.75 0 100 1.5.75.75 0 000-1.5zm4.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm6-3.25a.75.75 0 100 1.5.75.75 0 000-1.5zm0-6.5a.75.75 0 100 1.5.75.75 0 000-1.5zM6.395 7.3a1.75 1.75 0 113.21 1.4 1.75 1.75 0 01-3.21-1.4z" clipRule="evenodd" />
                </g>
            </svg>
        </div>
    );
};

export const FSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#056ccd" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-128.86 -128.86 625.89 625.89">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <g>
                            <g>
                                <path d="M248.084,96.684h12c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8h-12c-4.4,0-8,3.6-8,8C240.084,93.084,243.684,96.684,248.084,96.684 z"></path>
                                <path d="M366.484,25.484c-2.8-5.6-8.4-8.8-14.4-8.8h-336c-6,0-11.6,3.6-14.4,8.8c-2.8,5.6-2,12,1.6,16.8l141.2,177.6v115.6 c0,6,3.2,11.2,8.4,14c2.4,1.2,4.8,2,7.6,2c3.2,0,6.4-0.8,9.2-2.8l44.4-30.8c6.4-4.8,10-12,10-19.6v-78.8l140.8-177.2 C368.484,37.484,369.284,31.084,366.484,25.484z M209.684,211.884c-0.8,1.2-1.6,2.8-1.6,4.8v81.2c0,2.8-1.2,5.2-3.2,6.8 l-44.4,30.8v-118.8c0-2.8-1.2-5.2-3.2-6.4l-90.4-113.6h145.2c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8h-156c-0.4,0-1.2,0-1.6,0l-38.4-48 h336L209.684,211.884z">
                                </path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const BSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg
                fill="#056ccd"
                viewBox="-3.6 -3.6 31.20 31.20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <polygon
                        id="secondary"
                        points="9 8 9 16 15 12 9 8"
                        style={{
                            fill: "none",
                            stroke: "#056ccd",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                        }}
                    ></polygon>
                    <rect
                        id="primary"
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="1"
                        style={{
                            fill: "none",
                            stroke: "#000000",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                        }}
                    ></rect>
                </g>
            </svg>
        </div>
    );
};

export const TSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill={"#056ccd"} viewBox="-6.4 -6.4 44.80 44.80" xmlns="http://www.w3.org/2000/svg">
                <title>Tls</title>
                <path d="M15.986 21.652c0.004-0 0.009-0 0.014-0 0.883 0 1.599 0.716 1.599 1.599 0 0.594-0.323 1.112-0.804 1.387l-0.008 0.004v1.556c-0.003 0.432-0.354 0.781-0.787 0.781s-0.784-0.349-0.787-0.781v-1.556c-0.488-0.28-0.812-0.798-0.812-1.391 0-0.878 0.708-1.591 1.584-1.598h0.001zM2.915 13.187c-0.573 0.044-1.021 0.52-1.021 1.1s0.448 1.056 1.017 1.1l0.004 0h3.747c0.573-0.044 1.021-0.52 1.021-1.1s-0.448-1.056-1.017-1.1l-0.004-0zM25.214 13.184c-0.608 0.002-1.1 0.495-1.1 1.103 0 0.609 0.494 1.103 1.103 1.103 0.030 0 0.059-0.001 0.088-0.003l-0.004 0h3.782c0.573-0.044 1.021-0.52 1.021-1.1s-0.448-1.056-1.017-1.1l-0.004-0h-3.782q-0.044-0.003-0.088-0.003zM15.991 12.555c0.003 0 0.006 0 0.009 0 1.485 0 2.689 1.204 2.689 2.689 0 0 0 0 0 0v0 1.859h-5.379v-1.859c0 0 0-0 0-0 0-1.482 1.199-2.684 2.68-2.689h0.001zM15.975 8.939c-3.472 0.014-6.281 2.831-6.281 6.305v0 1.859h-1.458c-0.665 0.002-1.203 0.54-1.206 1.205v11.483c0.002 0.665 0.541 1.203 1.205 1.205h15.528c0.665-0.002 1.203-0.54 1.205-1.205v-11.485c-0.003-0.664-0.541-1.2-1.205-1.203h-1.46v-1.859c-0-3.482-2.823-6.305-6.305-6.305-0.008 0-0.017 0-0.025 0h0.001zM6.403 4.906c-0 0-0 0-0 0-0.609 0-1.103 0.494-1.103 1.103 0 0.313 0.13 0.596 0.34 0.797l0 0 2.962 2.437c0.188 0.156 0.431 0.25 0.696 0.25 0.002 0 0.003 0 0.004 0h-0v-0.002c0 0 0 0 0 0 0.608 0 1.1-0.493 1.1-1.1 0-0.341-0.155-0.646-0.399-0.848l-0.002-0.001-2.964-2.435c-0.177-0.126-0.397-0.201-0.635-0.201h-0zM25.617 4.889c-0.246 0.001-0.472 0.083-0.654 0.22l0.003-0.002-2.967 2.434c-0.247 0.203-0.402 0.509-0.402 0.851 0 0.608 0.493 1.101 1.101 1.101 0.266 0 0.51-0.094 0.701-0.252l-0.002 0.002 2.963-2.438c0.223-0.202 0.363-0.493 0.363-0.817 0-0.608-0.493-1.1-1.1-1.1-0.002 0-0.004 0-0.006 0h0zM15.989 1.004c-0.576 0.006-1.046 0.452-1.089 1.017l-0 0.004v3.775c0.004 0.605 0.495 1.094 1.1 1.094 0.604 0 1.095-0.487 1.1-1.090v-3.779c-0.044-0.573-0.52-1.021-1.1-1.021-0.004 0-0.007 0-0.011 0h0.001z"></path>
            </svg>
        </div>
    );
};

export const EXSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-4.8 -4.8 33.60 33.60" fill="#056ccd" xmlns="http://www.w3.org/2000/svg" aria-labelledby="extensionIconTitle" stroke="#056ccd" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" color="#056ccd">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title id="extensionIconTitle">Extension</title>
                    <path d="M9 4C9 2.89543 9.89543 2 11 2C12.1046 2 13 2.89543 13 4V6H18V11H20C21.1046 11 22 11.8954 22 13C22 14.1046 21.1046 15 20 15H18V20H13V18C13 16.8954 12.1046 16 11 16C9.89543 16 9 16.8954 9 18V20H4V15H6C7.10457 15 8 14.1046 8 13C8 11.8954 7.10457 11 6 11H4V6H9V4Z"></path>
                </g>
            </svg>
        </div>
    );
};

export const SETSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-6 -6 42.00 42.00" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#056ccd">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>settings</title>
                    <defs> </defs>
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="#056ccd" fillRule="evenodd">
                        <g id="Icon-Set" transform="translate(-101.000000, -360.000000)" fill="#056ccd">
                            <path d="M128.52,381.134 L127.528,382.866 C127.254,383.345 126.648,383.508 126.173,383.232 L123.418,381.628 C122.02,383.219 120.129,384.359 117.983,384.799 L117.983,387 C117.983,387.553 117.54,388 116.992,388 L115.008,388 C114.46,388 114.017,387.553 114.017,387 L114.017,384.799 C111.871,384.359 109.98,383.219 108.582,381.628 L105.827,383.232 C105.352,383.508 104.746,383.345 104.472,382.866 L103.48,381.134 C103.206,380.656 103.369,380.044 103.843,379.769 L106.609,378.157 C106.28,377.163 106.083,376.106 106.083,375 C106.083,373.894 106.28,372.838 106.609,371.843 L103.843,370.232 C103.369,369.956 103.206,369.345 103.48,368.866 L104.472,367.134 C104.746,366.656 105.352,366.492 105.827,366.768 L108.582,368.372 C109.98,366.781 111.871,365.641 114.017,365.201 L114.017,363 C114.017,362.447 114.46,362 115.008,362 L116.992,362 C117.54,362 117.983,362.447 117.983,363 L117.983,365.201 C120.129,365.641 122.02,366.781 123.418,368.372 L126.173,366.768 C126.648,366.492 127.254,366.656 127.528,367.134 L128.52,368.866 C128.794,369.345 128.631,369.956 128.157,370.232 L125.391,371.843 C125.72,372.838 125.917,373.894 125.917,375 C125.917,376.106 125.72,377.163 125.391,378.157 L128.157,379.769 C128.631,380.044 128.794,380.656 128.52,381.134 L128.52,381.134 Z M130.008,378.536 L127.685,377.184 C127.815,376.474 127.901,375.749 127.901,375 C127.901,374.252 127.815,373.526 127.685,372.816 L130.008,371.464 C130.957,370.912 131.281,369.688 130.733,368.732 L128.75,365.268 C128.203,364.312 126.989,363.983 126.041,364.536 L123.694,365.901 C122.598,364.961 121.352,364.192 119.967,363.697 L119.967,362 C119.967,360.896 119.079,360 117.983,360 L114.017,360 C112.921,360 112.033,360.896 112.033,362 L112.033,363.697 C110.648,364.192 109.402,364.961 108.306,365.901 L105.959,364.536 C105.011,363.983 103.797,364.312 103.25,365.268 L101.267,368.732 C100.719,369.688 101.044,370.912 101.992,371.464 L104.315,372.816 C104.185,373.526 104.099,374.252 104.099,375 C104.099,375.749 104.185,376.474 104.315,377.184 L101.992,378.536 C101.044,379.088 100.719,380.312 101.267,381.268 L103.25,384.732 C103.797,385.688 105.011,386.017 105.959,385.464 L108.306,384.099 C109.402,385.039 110.648,385.809 112.033,386.303 L112.033,388 C112.033,389.104 112.921,390 114.017,390 L117.983,390 C119.079,390 119.967,389.104 119.967,388 L119.967,386.303 C121.352,385.809 122.598,385.039 123.694,384.099 L126.041,385.464 C126.989,386.017 128.203,385.688 128.75,384.732 L130.733,381.268 C131.281,380.312 130.957,379.088 130.008,378.536 L130.008,378.536 Z M116,378 C114.357,378 113.025,376.657 113.025,375 C113.025,373.344 114.357,372 116,372 C117.643,372 118.975,373.344 118.975,375 C118.975,376.657 117.643,378 116,378 L116,378 Z M116,370 C113.261,370 111.042,372.238 111.042,375 C111.042,377.762 113.261,380 116,380 C118.739,380 120.959,377.762 120.959,375 C120.959,372.238 118.739,370 116,370 L116,370 Z" id="settings">
                            </path>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const QSSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#056ccd" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="-65.49 -65.49 349.27 349.27" >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M216.097,2.196c-1.479-1.479-3.5-2.267-5.598-2.191c-1.342,0.053-33.14,1.567-56.863,25.29l-27.593,27.593 c-5.931,1.709-23.265,7.25-34.005,16.362C79.934,79.52,68.1,94.507,67.602,95.14c-2.246,2.855-2.105,6.881,0.261,9.577 c-7.31,2.992-16.498,7.691-23.099,14.292c-11.651,11.651-21.036,27.14-21.43,27.794c-1.712,2.843-1.353,6.473,0.883,8.925 c0.269,0.294,0.557,0.563,0.861,0.806c-4.515,6.597-9.257,14.002-12.726,20.434C5.54,189.601,0.476,208.042,0.264,208.821 c-0.708,2.596,0.03,5.373,1.933,7.275c1.425,1.426,3.341,2.197,5.304,2.197c0.657,0,1.32-0.086,1.972-0.264 c0.779-0.212,19.22-5.277,31.853-12.089c6.432-3.468,13.836-8.21,20.434-12.726c0.243,0.304,0.512,0.592,0.806,0.861 c2.453,2.236,6.082,2.596,8.925,0.883c0.654-0.394,16.143-9.778,27.794-21.429c6.602-6.602,11.3-15.792,14.293-23.102 c1.405,1.233,3.167,1.868,4.941,1.868c1.63,0,3.268-0.53,4.635-1.605c0.633-0.498,15.62-12.332,25.89-24.436 c9.113-10.74,14.653-28.073,16.362-34.004l27.593-27.593c23.723-23.723,25.237-55.521,25.29-56.863 C218.37,5.705,217.576,3.675,216.097,2.196z M88.678,162.923c-2.569,2.569-5.393,5.042-8.189,7.308 c-0.453-0.637-1.012-1.212-1.669-1.697c-2.907-2.142-6.937-1.9-9.576,0.562c-2.333,2.177-21.23,16.197-35.037,23.641 c-4.531,2.443-10.112,4.687-15.142,6.489c1.801-5.024,4.043-10.601,6.491-15.14c7.445-13.807,21.464-32.703,23.64-35.035 c2.476-2.635,2.72-6.662,0.58-9.576c-0.487-0.663-1.065-1.225-1.707-1.68c2.265-2.793,4.735-5.615,7.302-8.181 c6.797-6.797,18.139-11.228,24.135-13.223l22.41,22.41C99.674,145.526,95.075,156.526,88.678,162.923z M143.457,91.852 c-2.272,2.271-5.293,3.523-8.508,3.523c-3.214,0-6.235-1.252-8.508-3.524c-2.272-2.271-3.524-5.293-3.524-8.508 s1.252-6.236,3.524-8.508s5.294-3.524,8.508-3.524c3.214,0,6.236,1.252,8.508,3.524s3.524,5.294,3.524,8.508 S145.73,89.58,143.457,91.852z M183.484,52.487l-8.631,8.631c-2.361,2.361-5.5,3.661-8.839,3.661s-6.478-1.3-8.839-3.661 c-4.874-4.874-4.874-12.804,0-17.677l8.631-8.631c2.361-2.361,5.5-3.661,8.839-3.661s6.478,1.3,8.839,3.661s3.661,5.5,3.661,8.838 C187.145,46.987,185.845,50.126,183.484,52.487z"></path>
                </g>
            </svg>
        </div>
    );
};

export const SVCSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#056ccd" viewBox="-3.6 -3.6 31.20 31.20" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g id="service-start">
                        <g>
                            <path d="M6,4.5c0.1,0,0,6,0,6l5-3L6,4.5z"></path>
                        </g>
                        <g>
                            <path d="M9.7,23c-3.6,0-6.5-2.9-6.5-6.5c0-1.2,0.3-2.4,1-3.4C2.3,12,1,9.8,1,7.5C1,3.9,3.9,1,7.5,1c2.3,0,4.3,1.2,5.5,3 c1-0.7,2.2-1,3.5-1C20.1,3,23,5.9,23,9.5S20.1,16,16.5,16c-0.1,0-0.2,0-0.3,0c0,0.2,0,0.4,0,0.6C16.2,20.2,13.3,23,9.7,23z M6.1,13.8c-0.6,0.8-0.9,1.7-0.9,2.7c0,2.5,2,4.5,4.5,4.5s4.5-1.9,4.5-4.4c0-0.3,0-0.5,0-0.7L14,15.3c0-0.1,0-0.1-0.1-0.2V15 c-0.4-1.2-1.1-2-2.3-2.5C10.5,13.5,9,14,7.5,14C7,14,6.5,13.9,6.1,13.8z M15.6,13.9c0.3,0.1,0.6,0.1,0.9,0.1C19,14,21,12,21,9.5 S19,5,16.5,5c-1,0-1.9,0.3-2.7,0.9c0.1,0.5,0.2,1,0.2,1.6c0,1.3-0.4,2.5-1,3.5C14.2,11.6,15.1,12.6,15.6,13.9z M7.5,3 C5,3,3,5,3,7.5c0,1.9,1.2,3.6,3,4.3c1.5,0.6,3.4,0.1,4.6-1l0,0c0.8-0.8,1.3-2,1.3-3.2c0-0.6-0.1-1.1-0.3-1.6l0,0 C11.1,4.2,9.4,3,7.5,3z"></path>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const CLNTSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg fill="#056ccd" viewBox="-5.4 -5.4 46.80 46.80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>thin-client-line</title>
                    <path d="M13,30H5a1,1,0,0,1-1-1V4A2,2,0,0,1,6,2h6a2,2,0,0,1,2,2V29A1,1,0,0,1,13,30ZM6,28h6V4H6Z"></path>
                    <circle cx="9" cy="7.42" r="1.5"></circle>
                    <path d="M15,34H3a1,1,0,0,1,0-2H15a1,1,0,0,1,0,2Z"></path>
                    <rect x="7.55" y="12.2" width="3" height="1.6"></rect>
                    <rect x="7.55" y="15.2" width="3" height="1.6"></rect>
                    <rect x="7.55" y="18.2" width="3" height="1.6"></rect>
                    <rect x="16" y="8" width="2" height="1.6"></rect>
                    <rect x="20" y="8" width="2" height="1.6"></rect>
                    <path d="M33,11.8H25a.8.8,0,0,1-.8-.8V5a.8.8,0,0,1,.8-.8h8a.8.8,0,0,1,.8.8v6A.8.8,0,0,1,33,11.8Zm-7.2-1.6h6.4V5.8H25.8Z"></path>
                    <rect x="16" y="20" width="2" height="1.6"></rect>
                    <rect x="20" y="20" width="2" height="1.6"></rect>
                    <path d="M33,23.8H25a.8.8,0,0,1-.8-.8V17a.8.8,0,0,1,.8-.8h8a.8.8,0,0,1,.8.8v6A.8.8,0,0,1,33,23.8Zm-7.2-1.6h6.4V17.8H25.8Z"></path>
                    <rect width="36" height="36" fillOpacity="0"></rect>
                </g>
            </svg>
        </div>
    );
};

export const OMSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-288 -288 2496.00 2496.00" xmlns="http://www.w3.org/2000/svg" fill="#056ccd">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g fillRule="evenodd" clipRule="evenodd" stroke="none" strokeWidth="1">
                        <path fillRule="evenodd" clipRule="evenodd" d="M746.667 106.667V1493.33H1173.33V106.667H746.667ZM1056 224H864V1376H1056V224ZM106.667 533.333H533.333V1493.33H106.667V533.333ZM224 650.667H416V1376H224V650.667Z"></path>
                        <path d="M1920 1706.67H0V1824H1920V1706.67Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M1386.67 746.667H1813.33V1493.33H1386.67V746.667ZM1504 864H1696V1376H1504V864Z"></path>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export const OLSVG: React.FC<SVGProps> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="-2.4 -2.4 20.80 20.80" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g fill="#056ccd">
                        <path d="M5.314 1.256a.75.75 0 01-.07 1.058L3.889 3.5l1.355 1.186a.75.75 0 11-.988 1.128l-2-1.75a.75.75 0 010-1.128l2-1.75a.75.75 0 011.058.07zM7.186 1.256a.75.75 0 00.07 1.058L8.611 3.5 7.256 4.686a.75.75 0 10.988 1.128l2-1.75a.75.75 0 000-1.128l-2-1.75a.75.75 0 00-1.058.07zM2.75 7.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H2.75zM2 11.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2.75 13.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"></path>
                    </g>
                </g>
            </svg>
        </div>
    );
};

