import "dotenv/config"

export default{
    "name": "MyRideLink",
    "slug": "MyRideLink",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo.png",
    "scheme": "myridelink",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.abescottent.myridelink"
    },
    "android": {
        "adaptiveIcon": {
            "foregroundImage": "./assets/images/logo.png",
            "backgroundColor": "#ffffff"
        },
        "package": "com.abescottent.myridelink"
    },
    "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/logo.png"
    },
    "plugins": [
        "expo-router",
        [
            "expo-splash-screen",
            {
                "image": "./assets/images/logo.png",
                "imageWidth": 200,
                "resizeMode": "contain",
                "backgroundColor": "#ffffff"
            }
        ]
    ],
    "experiments": {
        "typedRoutes": true
    },
    extra: {
        //googleAndroidClientId: process.env.GOOGLE_OAUTH_CLIENT_ID_ANDROID,
        googleIOSClientId: process.env.GOOGLE_OAUTH_CLIENT_ID_IOS,
        googleWebClientId: process.env.GOOGLE_OAUTH_CLIENT_ID_WEB,
    },
}