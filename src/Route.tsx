import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { PageLoadingFallback } from '@/components/common/PageLoadingFallback';
import { LazyLoadErrorBoundary } from '@/components/common/LazyLoadErrorBoundary';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

// Eager imports (critical path - always needed)
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import Main from "@/components/layout/Main";
import Err403 from "@/pages/403";
import ProtectedRoute from '@/ProtectedRoute';

// Lazy imports with retry - Heavy pages (ECharts, Monaco, XYFlow)
const RegistryInfo = lazyWithRetry(() => import("@/pages/RegistryInfo"));
const JobDetail = lazyWithRetry(() => import('./pages/jobs/JobDetail'));
const AuditDetail = lazyWithRetry(() => import('./pages/audit/AuditDetail'));
const Metrics = lazyWithRetry(() => import('./pages/metrics/metrics'));
const Logs = lazyWithRetry(() => import('./pages/logs/Logs'));
const GslbStatistics = lazyWithRetry(() => import('./pages/gslb/GslbStatistics'));
const DependencyGraphPage = lazyWithRetry(() => import('./pages/DependencyGraphPage'));
const RouteMapPage = lazyWithRetry(() => import('./pages/RouteMapPage'));
const AIConfigGenerator = lazyWithRetry(() => import('./ai/AIConfigGenerator'));

// Lazy imports with retry - Resource pages
const Resources = lazyWithRetry(() => import("@/pages/Resources"));
const Resource = lazyWithRetry(() => import("@/pages/Resource"));
const FilterMain = lazyWithRetry(() => import('@/pages/FilterMain'));
const ExtensionsMain = lazyWithRetry(() => import("@/pages/ExtensionsMain"));
const SnapshotDump = lazyWithRetry(() => import('@/pages/SnapshotDump'));
const QuickStart = lazyWithRetry(() => import("@/pages/QuickStart"));

// Lazy imports with retry - Scenarios
const ScenarioDashboard = lazyWithRetry(() => import('@/elchi/components/scenarios/ScenarioDashboard'));
const DynamicScenarioWizard = lazyWithRetry(() => import('@/elchi/components/scenarios/DynamicScenarioWizard'));
const DynamicScenarioExecutionRedux = lazyWithRetry(() => import('@/elchi/components/scenarios/DynamicScenarioExecutionRedux'));

// Lazy imports with retry - Operations
const Clients = lazyWithRetry(() => import('./pages/operations/clients'));
const Services = lazyWithRetry(() => import('./pages/operations/services'));
const Client = lazyWithRetry(() => import('./pages/operations/client'));
const Service = lazyWithRetry(() => import('./pages/operations/service'));

// Lazy imports with retry - Settings
const Settings = lazyWithRetry(() => import("@/pages/settings/settings"));
const User = lazyWithRetry(() => import("@/pages/settings/User"));
const Users = lazyWithRetry(() => import("@/pages/settings/users"));
const Groups = lazyWithRetry(() => import("@/pages/settings/Groups"));
const Group = lazyWithRetry(() => import("@/pages/settings/Group"));
const Projects = lazyWithRetry(() => import("@/pages/settings/Projects"));
const Project = lazyWithRetry(() => import("@/pages/settings/Project"));

// Lazy imports with retry - Jobs & Audit
const JobList = lazyWithRetry(() => import('./pages/jobs/JobList'));
const AuditList = lazyWithRetry(() => import('./pages/audit/AuditList'));

// Lazy imports with retry - WAF
const WafList = lazyWithRetry(() => import('./pages/waf/WafList'));
const WafDetail = lazyWithRetry(() => import('./pages/waf/WafDetail'));

// Lazy imports with retry - GSLB
const GslbList = lazyWithRetry(() => import('./pages/gslb/GslbList'));
const GslbDetail = lazyWithRetry(() => import('./pages/gslb/GslbDetail'));

// Lazy imports with retry - ACME
const CertificateList = lazyWithRetry(() => import('./pages/acme/CertificateList'));
const CertificateDetail = lazyWithRetry(() => import('./pages/acme/CertificateDetail'));
const DnsCredentialDetail = lazyWithRetry(() => import('./pages/acme/DnsCredentialDetail'));
const AcmeAccountDetail = lazyWithRetry(() => import('./pages/acme/AcmeAccountDetail'));

// Lazy imports with retry - Other pages
const Discovery = lazyWithRetry(() => import('./pages/discovery/Discovery'));
const Search = lazyWithRetry(() => import('./pages/Search'));
const Profile = lazyWithRetry(() => import('./pages/profile/Profile'));

// Wrapper component for lazy-loaded routes
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <LazyLoadErrorBoundary>
        <Suspense fallback={<PageLoadingFallback />}>
            {children}
        </Suspense>
    </LazyLoadErrorBoundary>
);

const AppRoutes: React.FC = () => (
    <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Main />}>
                <Route index element={<Dashboard />} />
                <Route path="/profile" element={<LazyRoute><Profile /></LazyRoute>} />
                <Route path="/quick_start" element={<LazyRoute><QuickStart /></LazyRoute>} />

                {/* Scenarios */}
                <Route path="/scenarios" element={<LazyRoute><ScenarioDashboard /></LazyRoute>} />
                <Route path="/scenarios/create" element={<LazyRoute><DynamicScenarioWizard /></LazyRoute>} />
                <Route path="/scenarios/:scenarioId/execute" element={<LazyRoute><DynamicScenarioExecutionRedux /></LazyRoute>} />
                <Route path="/scenarios/:scenarioId/edit" element={<LazyRoute><DynamicScenarioWizard /></LazyRoute>} />
                <Route path="/403" element={<Err403 />} />
                <Route path="/snapshot_dump/:listenerName" element={<LazyRoute><SnapshotDump /></LazyRoute>} />

                {/* Resource Routes */}
                <Route path="/create/:resource" element={<LazyRoute><Resource /></LazyRoute>} />
                <Route path="/resource/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/resource/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />

                {/* Filter Routes */}
                <Route path="/filters" element={<LazyRoute><FilterMain /></LazyRoute>} />
                <Route path="/filters/network/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/filters/network/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />
                <Route path="/filters/http/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/filters/http/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />
                <Route path="/filters/listener/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/filters/listener/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />
                <Route path="/filters/udp/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/filters/udp/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />

                {/* Extension Routes */}
                <Route path="/extensions" element={<LazyRoute><ExtensionsMain /></LazyRoute>} />
                <Route path="/extensions/:resource" element={<LazyRoute><Resources /></LazyRoute>} />
                <Route path="/extensions/:resource/*" element={<LazyRoute><Resource /></LazyRoute>} />

                {/* Registry Info Route */}
                <Route path="/registry" element={<LazyRoute><RegistryInfo /></LazyRoute>} />

                {/* Settings Routes */}
                <Route path="/settings" element={<LazyRoute><Settings /></LazyRoute>} />
                {!window.APP_CONFIG?.ENABLE_DEMO && <Route path="/settings/create/user" element={<LazyRoute><User /></LazyRoute>} />}
                <Route path="/settings/create/group" element={<LazyRoute><Group /></LazyRoute>} />
                <Route path="/settings/create/project" element={<LazyRoute><Project /></LazyRoute>} />
                {!window.APP_CONFIG?.ENABLE_DEMO && <Route path="/settings/users" element={<LazyRoute><Users /></LazyRoute>} />}
                {!window.APP_CONFIG?.ENABLE_DEMO && <Route path="/settings/users/:username" element={<LazyRoute><User /></LazyRoute>} />}
                <Route path="/settings/groups" element={<LazyRoute><Groups /></LazyRoute>} />
                <Route path="/settings/groups/:groupname" element={<LazyRoute><Group /></LazyRoute>} />
                <Route path="/settings/projects" element={<LazyRoute><Projects /></LazyRoute>} />
                <Route path="/settings/projects/:projectname" element={<LazyRoute><Project /></LazyRoute>} />

                {/* Operations Routes */}
                <Route path="/clients" element={<LazyRoute><Clients /></LazyRoute>} />
                <Route path="/clients/:client_id" element={<LazyRoute><Client /></LazyRoute>} />
                <Route path="/services" element={<LazyRoute><Services /></LazyRoute>} />
                <Route path="/services/:service_id" element={<LazyRoute><Service /></LazyRoute>} />

                {/* Metrics Routes */}
                <Route path="/observability/metrics" element={<LazyRoute><Metrics /></LazyRoute>} />

                {/* Logs Routes */}
                <Route path="/observability/logs" element={<LazyRoute><Logs /></LazyRoute>} />

                {/* AI Config Generator Routes */}
                <Route path="/ai-analyzer" element={<LazyRoute><AIConfigGenerator /></LazyRoute>} />

                {/* Search Route */}
                <Route path="/search" element={<LazyRoute><Search /></LazyRoute>} />

                {/* Discovery Route */}
                <Route path="/discovery" element={<LazyRoute><Discovery /></LazyRoute>} />

                {/* Jobs Routes */}
                <Route path="/jobs" element={<LazyRoute><JobList /></LazyRoute>} />
                <Route path="/jobs/:jobId" element={<LazyRoute><JobDetail /></LazyRoute>} />

                {/* Audit Routes */}
                <Route path="/audit" element={<LazyRoute><AuditList /></LazyRoute>} />
                <Route path="/audit/:auditId" element={<LazyRoute><AuditDetail /></LazyRoute>} />

                {/* WAF Routes */}
                <Route path="/waf" element={<LazyRoute><WafList /></LazyRoute>} />
                <Route path="/waf/:id" element={<LazyRoute><WafDetail /></LazyRoute>} />

                {/* GSLB Routes */}
                <Route path="/gslb" element={<LazyRoute><GslbList /></LazyRoute>} />
                <Route path="/gslb/statistics" element={<LazyRoute><GslbStatistics /></LazyRoute>} />
                <Route path="/gslb/create" element={<LazyRoute><GslbDetail /></LazyRoute>} />
                <Route path="/gslb/:id" element={<LazyRoute><GslbDetail /></LazyRoute>} />

                {/* ACME Certificate Routes */}
                <Route path="/acme" element={<LazyRoute><CertificateList /></LazyRoute>} />
                <Route path="/acme/create" element={<LazyRoute><CertificateDetail /></LazyRoute>} />
                <Route path="/acme/:id" element={<LazyRoute><CertificateDetail /></LazyRoute>} />
                <Route path="/acme/acme-accounts/create" element={<LazyRoute><AcmeAccountDetail /></LazyRoute>} />
                <Route path="/acme/acme-accounts/:id" element={<LazyRoute><AcmeAccountDetail /></LazyRoute>} />
                <Route path="/acme/dns-credentials/create" element={<LazyRoute><DnsCredentialDetail /></LazyRoute>} />
                <Route path="/acme/dns-credentials/:id" element={<LazyRoute><DnsCredentialDetail /></LazyRoute>} />

                {/* Dependency Graph Route */}
                <Route path="/dependency/:name" element={<LazyRoute><DependencyGraphPage /></LazyRoute>} />

                {/* Route Map Route */}
                <Route path="/routemap/:name" element={<LazyRoute><RouteMapPage /></LazyRoute>} />

                {/* Catch-All Route */}
                <Route path="*" element={<Dashboard />} />
            </Route>
        </Route>
    </Routes>
);


export default AppRoutes;
