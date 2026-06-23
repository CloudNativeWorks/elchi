import { describe, expect, it } from 'vitest';
import { extractErrorMessage } from './notificationHandler';

const err400 = (message: string) => ({ response: { status: 400, data: { data: null, message } } });

describe('extractErrorMessage — protoc-gen-validate errors', () => {
    it('parses a chained validation error into field path + reason', () => {
        const raw =
            'Validation error: : invalid HttpConnectionManager.Http3ProtocolOptions: embedded message failed validation | caused by: invalid Http3ProtocolOptions.QuicProtocolOptions: embedded message failed validation | caused by: invalid QuicProtocolOptions.NumTimeoutsToTriggerPortMigration: value must be inside range [0, 5]';
        expect(extractErrorMessage(err400(raw))).toBe(
            'Http3 Protocol Options → Quic Protocol Options → Num Timeouts To Trigger Port Migration\nvalue must be inside range [0, 5]',
        );
    });

    it('regression: a real message containing "timeout" is NOT discarded as generic', () => {
        const raw =
            'Validation error: invalid QuicProtocolOptions.NumTimeoutsToTriggerPortMigration: value must be inside range [0, 5]';
        const out = extractErrorMessage(err400(raw));
        expect(out).toContain('value must be inside range [0, 5]');
        expect(out).not.toBe('Bad request - please check your input');
    });

    it('handles multiple top-level violations as a bulleted list', () => {
        const raw = 'Validation error: invalid A.FieldOne: must be greater than 0; invalid B.FieldTwo: value is required';
        const out = extractErrorMessage(err400(raw));
        expect(out).toContain('• Field One');
        expect(out).toContain('must be greater than 0');
        expect(out).toContain('• Field Two');
        expect(out).toContain('value is required');
    });

    it('passes through non-validation server messages unchanged', () => {
        expect(extractErrorMessage(err400('Something broke'))).toBe('Something broke');
    });

    it('does NOT reformat other messages that merely contain "invalid x.y:"', () => {
        const raw = 'Could not parse invalid config.yaml: unexpected token';
        expect(extractErrorMessage(err400(raw))).toBe(raw);
    });

    it('leaves an arbitrary server error message intact', () => {
        const raw = 'Cluster "my-cluster" already exists in this project';
        expect(extractErrorMessage(err400(raw))).toBe(raw);
    });

    it('falls back to the status message only when no server message exists', () => {
        expect(extractErrorMessage({ response: { status: 400, data: {} } })).toBe(
            'Bad request - please check your input',
        );
    });
});
