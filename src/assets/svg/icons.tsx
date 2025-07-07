import { Button } from 'antd';
import React from 'react';

interface SVGProps {
    onClick?: any;
}

export const AddSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.336" />
                <g id="SVGRepo_iconCarrier">
                    <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#056ccd" strokeWidth="1.5" />
                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#056ccd" strokeWidth="1.5" strokeLinecap="round" /> </g>
            </svg>
        </Button>
    );
};

export const AddIpSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button title='Add IPs' className='ADDSVGContainer' onClick={onClick}>
            <svg height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.336" />
                <g id="SVGRepo_iconCarrier">
                    <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#06c876" strokeWidth="1.5" />
                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#06c876" strokeWidth="1.5" strokeLinecap="round" /> </g>
            </svg>
        </Button>
    );
};

export const ActionsSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg
                viewBox="-2.64 -2.64 29.28 29.28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M20 7L4 7" stroke="#056ccd" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path opacity="0.5" d="M20 12L4 12" stroke="#056ccd" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M20 17L4 17" stroke="#056ccd" strokeWidth="1.5" strokeLinecap="round"></path>
                </g>
            </svg>
        </Button>
    );
};


export const CopySVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg viewBox="-9.6 -9.6 43.20 43.20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#ffffff" strokeWidth="1.5">
                    </path>
                    <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#ffffff" strokeWidth="1.5"></path>
                </g></svg>
        </Button>
    );
};

export const CollapseSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg
                viewBox="-204.8 -204.8 1433.60 1433.60"
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)"
            >
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#056ccd" />
                        <stop offset="100%" stopColor="#00c6fb" />
                    </linearGradient>
                </defs>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M106.666667 659.2L172.8 725.333333 512 386.133333 851.2 725.333333l66.133333-66.133333L512 256z" fill="#FFFFFF"></path>
                </g>
            </svg>
        </Button>
    );
};

export const ExpandSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg
                viewBox="-204.8 -204.8 1433.60 1433.60"
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)"
            >
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#056ccd" />
                        <stop offset="100%" stopColor="#00c6fb" />
                    </linearGradient>
                </defs>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M917.333333 364.8L851.2 298.666667 512 637.866667 172.8 298.666667 106.666667 364.8 512 768z" fill="#FFFFFF"></path>
                </g>
            </svg>
        </Button>
    );
};

export const Copy2SVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg viewBox="-16.8 -16.8 57.60 57.60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                </g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                </g><g id="SVGRepo_iconCarrier">
                    <rect width="24" height="24" fill="white"></rect> <rect x="4" y="8" width="12" height="12" rx="1" stroke="#056ccd" strokeLinecap="round" strokeLinejoin="round"></rect>
                    <path d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18" stroke="#056ccd" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"></path>
                </g></svg>
        </Button>
    );
};

export const PasteSVG: React.FC<SVGProps> = ({ onClick }) => {
    return (
        <Button className='ADDSVGContainer' onClick={onClick}>
            <svg fill="#056ccd" viewBox="-25.2 -25.2 86.40 86.40" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M30,12H26v2h4v2h2V14A2,2,0,0,0,30,12Z" className="clr-i-outline clr-i-outline-path-1">
                    </path>
                    <rect x="30" y="18" width="2" height="6" className="clr-i-outline clr-i-outline-path-2">
                    </rect>
                    <path d="M30,30H28v2h2a2,2,0,0,0,2-2V26H30Z" className="clr-i-outline clr-i-outline-path-3">
                    </path>
                    <path d="M24,22V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V22a2,2,0,0,0,2,2H22A2,2,0,0,0,24,22ZM6,6H22V22H6Z" className="clr-i-outline clr-i-outline-path-4"></path>
                    <rect x="20" y="30" width="6" height="2" className="clr-i-outline clr-i-outline-path-5"></rect>
                    <path d="M14,26H12v4a2,2,0,0,0,2,2h4V30H14Z" className="clr-i-outline clr-i-outline-path-6"></path>
                    <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
                </g>
            </svg>
        </Button>
    );
};

export const CloudPlusBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="2.1em" height="2.1em" viewBox="0 0 36 32" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22.5 26a6.5 6.5 0 0 0 0-13c-1.1 0-2.16.21-3.15.6A8 8 0 1 0 9.5 26H22.5z" />
        <path d="M28 3v8" stroke="#52c41a" strokeWidth={4.5} strokeLinecap="round" />
        <path d="M24 7h8" stroke="#52c41a" strokeWidth={4.5} strokeLinecap="round" />
    </svg>
);

export const CloudMinusBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="2.1em" height="2.1em" viewBox="0 0 36 32" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22.5 26a6.5 6.5 0 0 0 0-13c-1.1 0-2.16.21-3.15.6A8 8 0 1 0 9.5 26H22.5z" />
        <path d="M23 7h10" stroke="#ff4d4f" strokeWidth={4.5} strokeLinecap="round" />
    </svg>
);

export const DeployLineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        fill="#056ccd" 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <defs>
                <style>{`.cls-1 { fill: none; }`}</style>
            </defs>
            <polygon points="19 16 19 14 26.171 14 23.878 11.707 25.292 10.293 30 15 25.292 19.707 23.878 18.293 26.171 16 19 16" />
            <polygon points="17 12 15 12 15 5.828 12.707 8.121 11.293 6.707 16 2 20.707 6.707 19.293 8.121 17 5.828 17 12" />
            <path d="M17,20.1011V18a4.0045,4.0045,0,0,0-4-4H5.8281l2.293-2.293L6.707,10.293,2,15l4.707,4.707,1.4141-1.414L5.8281,16H13a2.0025,2.0025,0,0,1,2,2v2.1011a5,5,0,1,0,2,0ZM16,28a3,3,0,1,1,3-3A3.0033,3.0033,0,0,1,16,28Z" />
            <rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" className="cls-1" width="32" height="32" />
        </g>
    </svg>
);