import React, { useState, useEffect } from "react";
import { Steps, Card, Result } from "antd";
import { useNavigate, useParams } from "react-router";
import { useCustomGetQuery, useScenarioMutation } from "@/common/api";
import DynamicComponent from "./DynamicComponent";
import useFormRegistry from "./useFormRegistry";
import ComponentRedux from "./ComponentRedux";
import { AxiosError } from "axios";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import SelectVersion from "./SelectVersion";
import ElchiButton from "../common/ElchiButton";


type ResultType = {
    status: number;
    message: string;
};

const Scenario: React.FC = () => {
    const { project } = useProjectVariable();
    const { scenarioid } = useParams();
    const [version, setVersion] = useState<string>(null);
    const [managed, setManaged] = useState<boolean>(true);
    const [steps, setSteps] = useState<any[]>([]);
    const [bootstrapId, setBootstrapId] = useState<string>(null);
    const [serviceId, setServiceId] = useState<string>(null);
    const [result, setResult] = useState<ResultType>({ status: 0, message: null });
    const [currentStep, setCurrentStep] = useState(0);
    const mutate = useScenarioMutation(`api/v3/scenario/scenario?metadata_scenario_id=${scenarioid}&project=${project}&version=${version}`);
    const { registerForm, unregisterForm, validateAllForms } = useFormRegistry();
    const { reduxStore, handleChangeRedux, handleDeleteRedux } = ComponentRedux({ version: version });
    const navigate = useNavigate();

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `scenario_${scenarioid}`,
        enabled: true,
        path: `scenario/scenario?metadata_scenario_id=${scenarioid}`,
    });

    useEffect(() => {
        if (dataQuery?.components) {
            setSteps(dataQuery.components);
        }
    }, [dataQuery]);

    useEffect(() => {
        if (version && managed !== undefined) {
            handleChangeRedux('managed', managed);
        }
    }, [version, managed, handleChangeRedux]);

    const clearResult = () => {
        setResult({ status: 0, message: null });
    }

    const next = async () => {
        const isValid = await validateAllForms();
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            console.error("Validation failed. Please complete the required fields.");
        }
    };

    const prev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const sendScenario = async () => {
        const isValid = await validateAllForms();
        if (isValid) {
            try {
                await mutate.mutateAsync(reduxStore, {
                    onSuccess: (response: any) => {
                        setResult({ status: response?.status, message: response?.data?.message });
                        setBootstrapId(response?.data?.data?.bootstrap_id);
                        setServiceId(response?.data?.data?.service_id);
                    }
                })
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error?.code === "ERR_NETWORK") {
                        setResult({ status: 500, message: "Backend connection error!" });
                    } else {
                        setResult({ status: error?.response?.status, message: error?.response?.data?.message });
                    }
                }
            }
        } else {
            console.error("Validation failed. Please complete the required fields.");
        }
    }

    const navigateBootstrap = () => {
        navigate(`/resource/bootstrap/${reduxStore?.listener?.name}?resource_id=${bootstrapId}`);
    }

    const navigateService = () => {
        navigate(`/service/${reduxStore?.listener?.name}?resource_id=${serviceId}`);
    }

    const renderSuccessCard = () => (
        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
            <Result
                status="success"
                title="Resources Successfully Created!"
                subTitle={
                    <>
                        Go to Bootstrap and download the configuration.
                        <br />
                        or
                        <br />
                        Go to Service and Deploy it
                    </>
                }
                extra={[
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <ElchiButton key="gobootstrap" onlyText onClick={navigateBootstrap}>
                            Go To Bootstrap
                        </ElchiButton>
                        <ElchiButton key="goservice" onlyText onClick={navigateService}>
                            Go To Service
                        </ElchiButton>
                    </div>
                ]}
            />
        </Card>
    );

    const renderErrorCard = () => (
        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
            <Result
                status="error"
                title="An error was received!"
                subTitle={result.message}
                extra={[
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <ElchiButton key="goback" onlyText onClick={clearResult}>
                            Go Back
                        </ElchiButton>
                    </div>
                ]}
            />
        </Card>
    );

    const renderSteps = () => (
        <>
            <h2>{`${dataQuery?.name} (${version} - ${managed ? 'Managed' : 'Unmanaged'})` || "Scenario"}</h2>
            <Steps
                className="custom-steps"
                current={currentStep}
                items={steps.map((step, index) => ({
                    title: step.title || `Step ${index + 1}`,
                    description: step.description || "",

                }))}
            />
            <div style={{ marginTop: 20 }}>
                {steps.length > 0 && (
                    <DynamicComponent
                        componentKey={steps[currentStep].name}
                        reduxStore={reduxStore}
                        handleChangeRedux={handleChangeRedux}
                        handleDeleteRedux={handleDeleteRedux}
                        registerForm={registerForm}
                        unregisterForm={unregisterForm}
                    />
                )}
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start', gap: 10 }}>
                {currentStep > 0 && (
                    <ElchiButton onlyText onClick={prev}>
                        Previous
                    </ElchiButton>
                )}
                {currentStep < steps.length - 1 && (
                    <ElchiButton onlyText onClick={next}>
                        Next
                    </ElchiButton>
                )}
                {currentStep === steps.length - 1 && (
                    <ElchiButton onlyText onClick={sendScenario}>
                        Done
                    </ElchiButton>
                )}

            </div>
        </>
    );

    const renderContent = () => {
        if (!version) {
            return <SelectVersion setState={setVersion} setManaged={setManaged} managed={managed} />;
        }

        if (result.status > 0 && result.status < 399) {
            return renderSuccessCard();
        }

        if (result.status > 399) {
            return renderErrorCard();
        }

        return renderSteps();
    };

    return <>{renderContent()}</>;
};

export default Scenario;