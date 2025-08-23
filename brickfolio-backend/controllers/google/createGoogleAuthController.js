const createGoogleAuthController = async (req, res) => {
  const { email } = req.query;
  try {
    const statePayload = Buffer.from(JSON.stringify({ email })).toString(
      "base64"
    );
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    console.log("google credential in auth", googleClientId);
    const redirect_uri = `${process.env.HOST}${process.env.SITE_PREFIX}${process.env.GOOGLE_REDIRECT_URL_PATH}`;
    const googleAuthURL = `${process.env.GOOGLE_AUTH_URL}?client_id=${googleClientId}&redirect_uri=${redirect_uri}&response_type=code&scope=openid%20email%20profile&state=${statePayload}`;
    res.redirect(googleAuthURL);
  } catch (error) {
    console.log(error, "Error while google auth");
  }
};

export default createGoogleAuthController;
