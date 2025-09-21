type toJsonProps = {
    resourceType: any;
    resource: any;
}

export const toJSON = (data: toJsonProps) => {
    let resource
    if (data.resource) {
        if (Array.isArray(data.resource)) {
            resource = data.resource.map((item: any) =>
                data.resourceType.toJSON(item)
            );
        } else {
            resource = data.resourceType.toJSON(data.resource);
        }
    }

    return resource
}