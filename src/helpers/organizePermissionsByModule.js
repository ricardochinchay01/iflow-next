export const organizePermissionsByModule = (permissions) => {
    const organized = {};

    permissions.forEach(permission => {
        const match = permission.name.match(/^[A-Z][a-zA-Z]+\./);

        if (match) {
            const moduleName = match[0];

            if (!organized[moduleName]) {
                organized[moduleName] = [];
            }

            // Aquí conservamos toda la información del permiso
            const permissionDetail = {
                ...permission,
                name: permission.name.replace(moduleName, "")
            };
            organized[moduleName].push(permissionDetail);
        }
    });

    return organized;
};
