const withMiddleware = (middleware) => (handler) => async (req, res) => {
    await new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });

    return handler(req, res);
};

export default withMiddleware;
