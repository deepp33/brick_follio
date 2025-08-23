import axios from 'axios';
import { User } from '../../models/index.js';
import crypto from 'crypto';

const callbackGoogleAuthController = async (req, res) => {
    const { code, state } = req.query;
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        console.log('google credential in callback', googleClientId, googleClientSecret);
        const { data } = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL, {
            code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: `${process.env.HOST}${process.env.SITE_PREFIX}${process.env.GOOGLE_REDIRECT_URL_PATH}`,
            grant_type: 'authorization_code'
        });
        const { access_token } = data;
        const userInfo = await axios.get(process.env.GOOGLE_USER_INFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const randomPassword = crypto.randomBytes(16).toString('hex');
        
        let user = await User.findOne({ email: userInfo?.data?.email });
        
        if (!user) {
            user = new User({
                name: `${userInfo?.data?.given_name} ${userInfo?.data?.family_name}`.trim(),
                email: userInfo?.data?.email,
                password: randomPassword,
                role: 'Investor',
                country: 'unknown',
                city: 'unknown'
            });
            await user.save();
            console.log('New user created via Google OAuth:', userInfo?.data?.email);
        }
        
        res.redirect(`https://${shop}/?data=${Buffer.from(JSON.stringify({
            email: userInfo?.data?.email,
            firstName: userInfo?.data?.given_name,
            lastName: userInfo?.data?.family_name
        })).toString('base64')}`);
    } catch (error) {
        console.error('OAuth error', error.response?.data || error.message);
        res.status(500).send('Auth Failed');
    }
};

export default callbackGoogleAuthController;