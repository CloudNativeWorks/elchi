import React from 'react';
import { Tag, Tooltip } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { useApiCollectorSampleRate } from '@/hooks/useApiDiscovery';

// Shown on distribution / posture panels when the collector samples raw
// events (policy.raw_sample_rate ≥ 2). Renders nothing when sampling is
// off. The panel's shape is still meaningful — only benign-2xx raw rows
// are thinned; risky events and seen_count volume stay exact.
const SamplingBadge: React.FC = () => {
    const rate = useApiCollectorSampleRate();
    if (rate < 2) return null;
    return (
        <Tooltip
            title={
                `Raw-event sampling is on — only ~1/${rate} of benign 2xx events are stored. ` +
                `This panel is a distribution / posture, not a full census. Request volume is ` +
                `still exact (read from seen_count).`
            }
        >
            <Tag
                icon={<ExperimentOutlined />}
                color="gold"
                style={{ margin: 0, cursor: 'help' }}
            >
                Sampled 1/{rate}
            </Tag>
        </Tooltip>
    );
};

export default SamplingBadge;
