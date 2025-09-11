export const ConditionalComponent: React.FC<{
    shouldRender: boolean;
    Component: React.FC<{ veri: any }>;
    componentProps: any;
}> = ({ shouldRender, Component, componentProps }) => {
    if (!shouldRender) {
        return null;
    }

    const { id, ...restProps } = componentProps;

    return (
        <div id={id}>
            <Component veri={{ ...restProps }} />
        </div>
    );
};
