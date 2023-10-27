export const extractModules = (roles) => {
    let modulesMap = {};

    roles.forEach(role => {
        role.permissions.forEach(permission => {
            const [moduleName] = permission.name.split('.');
            modulesMap[moduleName] = moduleName;
        });
    });

    // Convierto el objeto en un array de objetos para su uso en un select
    const modulesArray = Object.entries(modulesMap).map(([name, id]) => ({ id, name }));

    return modulesArray;
}
