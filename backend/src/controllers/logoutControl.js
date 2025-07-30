const logoutController = {}

//Este es para borrar la sesión del usuario

logoutController.logout = async (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
}

export default logoutController;