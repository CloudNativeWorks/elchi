
export interface CustomCardProps {
    name: string;
    collection: string;
    gtype: string;
    visible: boolean;
    version: string;
    onClose: () => void;
}

export interface PopoverContentProps {
    nodeLabel: string;
    category: string;
    gtype: string;
    link: string;
    id: string;
}

export interface StyleOptions {
    selector: string;
    style: Record<string, any>;
} 