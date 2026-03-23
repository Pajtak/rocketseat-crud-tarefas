export function buildRoutePath (routePath) {
    const routeParamsRegex = /:([a-zA-Z]+)/g
    const pathWithParams = routePath.replaceAll(routeParamsRegex, '(?<$1>[a-zA-Z0-9\\-_]+)')
    console.log(pathWithParams)
    return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
}
