export const validateBus = (req, res, next) => {
    const { busName } = req.body;
    if (!busName) return res.status(400).send("Bus name is required"); // stops request
    next(); // passes request to controller if valid
};