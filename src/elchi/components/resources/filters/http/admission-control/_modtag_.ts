export const modtag_admission_control = [
    {
        alias: 'ac',
        relativePath: 'envoy/extensions/filters/http/admission_control/v3/admission_control',
        names: ['AdmissionControl', 'AdmissionControl_SingleFields'],
    },
];

export const modtag_admission_success_criteria = [
    {
        alias: 'acs',
        relativePath: 'envoy/extensions/filters/http/admission_control/v3/admission_control',
        names: ['AdmissionControl_SuccessCriteria'],
    },
];

export const modtag_admission_success_criteria_grpc = [
    {
        alias: 'acsg',
        relativePath: 'envoy/extensions/filters/http/admission_control/v3/admission_control',
        names: ['AdmissionControl_SuccessCriteria_GrpcCriteria', 'AdmissionControl_SuccessCriteria_GrpcCriteria_SingleFields'],
    },
];

export const modtag_admission_success_criteria_http = [
    {
        alias: 'acsh',
        relativePath: 'envoy/extensions/filters/http/admission_control/v3/admission_control',
        names: ['AdmissionControl_SuccessCriteria_HttpCriteria'],
    },
];
