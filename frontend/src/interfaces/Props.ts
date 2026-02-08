
export interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
}

export interface Props_DateRangeFilter {
        from: Date | null;
        to: Date | null;
        onChange: (from: Date | null, to: Date | null) => void;
    
}