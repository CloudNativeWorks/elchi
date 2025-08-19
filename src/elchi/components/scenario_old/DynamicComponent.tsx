import React from "react";
import ComponentMap from "./ComponentMap";


const DynamicComponent: React.FC<{
    componentKey: string;
    reduxStore: any;
    handleChangeRedux: any;
    handleDeleteRedux: any;
    registerForm: any;
    unregisterForm: any;
}> = ({ componentKey, reduxStore, handleChangeRedux, handleDeleteRedux, registerForm, unregisterForm }) => {
    const Component = ComponentMap[componentKey];

    if (!Component) {
        console.error(`Component ${componentKey} not found`);
        return <div>Component not found</div>;
    }

    return (
        <Component
            reduxStore={reduxStore}
            handleChangeRedux={handleChangeRedux}
            handleDeleteRedux={handleDeleteRedux}
            registerForm={registerForm}
            unregisterForm={unregisterForm}
        />
    );
};

export default DynamicComponent;