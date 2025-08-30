import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import FilterMain from '@/pages/FilterMain';
import Resources from "@/pages/Resources";
import Resource from "@/pages/Resource";
import User from "@/pages/settings/User";
import Users from "@/pages/settings/users";
import Groups from "@/pages/settings/Groups";
import Group from "@/pages/settings/Group";
import Projects from "@/pages/settings/Projects";
import Project from "@/pages/settings/Project";
import Err403 from "@/pages/403";
import QuickStart from "@/pages/QuickStart";

import ProtectedRoute from '@/ProtectedRoute';
import Main from "@/components/layout/Main";
import Settings from "@/pages/settings/settings";
import RegistryInfo from "@/pages/RegistryInfo";
import ExtensionsMain from "@/pages/ExtensionsMain";
import SnapshotDump from '@/pages/SnapshotDump';
import Scenario from '@/elchi/components/scenario_old/Scenario';
import ScenarioDashboard from '@/elchi/components/scenarios/ScenarioDashboard';
import DynamicScenarioWizard from '@/elchi/components/scenarios/DynamicScenarioWizard';
import DynamicScenarioExecutionRedux from '@/elchi/components/scenarios/DynamicScenarioExecutionRedux';
import Demo from '@/pages/auth/Demo';
import Clients from './pages/operations/clients';
import Services from './pages/operations/services';
import Client from './pages/operations/client';
import Service from './pages/operations/service';
import Metrics from './pages/metrics/metrics';
import Logs from './pages/logs/Logs';
import AIConfigGenerator from './ai/AIConfigGenerator';
import NewAIConfigGenerator from './components/ai/AIConfigGenerator';
import Discovery from './pages/discovery/Discovery';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';


const AppRoutes: React.FC = () => (
    <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        {window.APP_CONFIG?.ENABLE_DEMO && <Route path="/demo" element={<Demo />} />}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Main />}>
                <Route index element={<Dashboard />} />
                <Route path="/quick_start" element={<QuickStart />} />
                {/* Scenarios */}
                <Route path="/scenarios" element={<ScenarioDashboard />} />
                <Route path="/scenarios/create" element={<DynamicScenarioWizard />} />
                <Route path="/scenarios/:scenarioId/execute" element={<DynamicScenarioExecutionRedux />} />
                <Route path="/scenarios/:scenarioId/edit" element={<DynamicScenarioWizard />} />
                {/* Legacy scenario route - for backward compatibility during transition */}
                <Route path="/scenario/:scenarioid" element={<Scenario />} />
                <Route path="/403" element={<Err403 />} />
                <Route path="/snapshot_dump/:listenerName" element={<SnapshotDump />} />
                {/* Resource Routes */}
                <Route path="/create/:resource" element={<Resource />} />
                <Route path="/resource/:resource" element={<Resources />} />
                <Route path="/resource/:resource/*" element={<Resource />} />

                {/* Filter Routes */}
                <Route path="/filters" element={<FilterMain />} />
                <Route path="/filters/network/:resource" element={<Resources />} />
                <Route path="/filters/network/:resource/*" element={<Resource />} />
                <Route path="/filters/http/:resource" element={<Resources />} />
                <Route path="/filters/http/:resource/*" element={<Resource />} />
                <Route path="/filters/listener/:resource" element={<Resources />} />
                <Route path="/filters/listener/:resource/*" element={<Resource />} />
                <Route path="/filters/udp/:resource" element={<Resources />} />
                <Route path="/filters/udp/:resource/*" element={<Resource />} />

                {/* Extension Routes */}
                <Route path="/extensions" element={<ExtensionsMain />} />
                <Route path="/extensions/:resource" element={<Resources />} />
                <Route path="/extensions/:resource/*" element={<Resource />} />

                {/* Registry Info Route */}
                <Route path="/registry" element={<RegistryInfo />} />

                {/* Settings Routes */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/create/user" element={<User />} />
                <Route path="/settings/create/group" element={<Group />} />
                <Route path="/settings/create/project" element={<Project />} />
                <Route path="/settings/users" element={<Users />} />
                <Route path="/settings/users/:username" element={<User />} />
                <Route path="/settings/groups" element={<Groups />} />
                <Route path="/settings/groups/:groupname" element={<Group />} />
                <Route path="/settings/projects" element={<Projects />} />
                <Route path="/settings/projects/:projectname" element={<Project />} />

                {/* Operations Routes */}
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:client_id" element={<Client />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:service_id" element={<Service />} />

                {/* Metrics Routes */}
                <Route path="/observability/metrics" element={<Metrics />} />

                {/* Logs Routes */}
                <Route path="/observability/logs" element={<Logs />} />

                {/* AI Config Generator Routes */}
                <Route path="/ai-analyzer" element={<AIConfigGenerator />} />
                <Route path="/ai-config-generator" element={<NewAIConfigGenerator />} />

                {/* Discovery Route */}
                <Route path="/discovery" element={<Discovery />} />

                {/* Jobs Routes */}
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:jobId" element={<JobDetail />} />

                {/* Catch-All Route */}
                <Route path="*" element={<Dashboard />} />
            </Route>
        </Route>
    </Routes>
);


export default AppRoutes;