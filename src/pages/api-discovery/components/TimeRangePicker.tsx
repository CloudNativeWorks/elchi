import React, { useMemo } from 'react';
import { Space, Button, DatePicker, Tooltip, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export interface TimeRange {
    from: string; // ISO-8601
    to: string;   // ISO-8601
}

interface Props {
    value: TimeRange;
    // eslint-disable-next-line no-unused-vars
    onChange: (next: TimeRange) => void;
    /** Hard cap in days; backend rejects > 7 with 400. */
    maxDays?: number;
}

type Preset = { label: string; minutes: number };

const PRESETS: Preset[] = [
    { label: 'Last 15m', minutes: 15 },
    { label: '1h', minutes: 60 },
    { label: '6h', minutes: 60 * 6 },
    { label: '24h', minutes: 60 * 24 },
    { label: '7d', minutes: 60 * 24 * 7 },
];

const computeRange = (minutes: number): TimeRange => {
    const to = dayjs();
    const from = to.subtract(minutes, 'minute');
    return { from: from.toISOString(), to: to.toISOString() };
};

const TimeRangePicker: React.FC<Props> = ({ value, onChange, maxDays = 7 }) => {
    const activePreset = useMemo(() => {
        if (!value?.from || !value?.to) return null;
        const diffMin = dayjs(value.to).diff(dayjs(value.from), 'minute');
        // Allow ±2-min drift since presets are computed from `now()`.
        return PRESETS.find((p) => Math.abs(p.minutes - diffMin) <= 2)?.label ?? null;
    }, [value]);

    const handlePreset = (p: Preset) => {
        onChange(computeRange(p.minutes));
    };

    const handleCustom = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (!dates || !dates[0] || !dates[1]) return;
        const [start, end] = dates;
        const diffDays = end.diff(start, 'day', true);
        if (diffDays > maxDays) {
            message.warning(`Time range capped at ${maxDays} days.`);
            return;
        }
        if (end.isBefore(start)) {
            message.warning('End must be after start.');
            return;
        }
        onChange({ from: start.toISOString(), to: end.toISOString() });
    };

    const rangeDays = value?.from && value?.to
        ? dayjs(value.to).diff(dayjs(value.from), 'day', true).toFixed(1)
        : null;

    return (
        <Space size={4} wrap>
            {PRESETS.map((p) => (
                <Button
                    key={p.label}
                    size="small"
                    type={activePreset === p.label ? 'primary' : 'default'}
                    onClick={() => handlePreset(p)}
                >
                    {p.label}
                </Button>
            ))}
            <Tooltip title={`Hard cap ${maxDays} days; longer ranges return HTTP 400.`}>
                <RangePicker
                    size="small"
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    value={value?.from && value?.to ? [dayjs(value.from), dayjs(value.to)] : null}
                    onChange={handleCustom}
                    allowClear={false}
                />
            </Tooltip>
            {rangeDays !== null && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {rangeDays}d span
                </Text>
            )}
        </Space>
    );
};

export const defaultTimeRange = (minutes = 60): TimeRange => computeRange(minutes);

export default TimeRangePicker;
