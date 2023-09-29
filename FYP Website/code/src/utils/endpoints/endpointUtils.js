import endpoints from './endpoints';

const getEndpointPath = (routeName) => {
  const routeObject = endpoints.find((route) => route.name === routeName);
  if (!routeObject) {
    console.warn(`No route found with name: ${routeName}`);

    return null;
  }

  return routeObject.path;
};

export { getEndpointPath };
