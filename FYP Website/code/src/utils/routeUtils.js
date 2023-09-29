import routes from './routes';

const getRoutePath = (routeName) => {
  const routeObject = routes.find((route) => route.name === routeName);
  if (!routeObject) {
    console.warn(`No route found with name: ${routeName}`);

    return null;
  }

  return routeObject.path;
};

export { getRoutePath };
