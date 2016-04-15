__meteor_runtime_config__ = {};
meteorEnv = {
    NODE_ENV: "production",
    TEST_METADATA: "{}"
};

if (typeof __meteor_runtime_config__ === "object") {
    __meteor_runtime_config__.meteorEnv = meteorEnv;
}

__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = 'http://localhost:3000/';

_FB_APP_ID = 1576930605962240;
_FB_APP_VERSION = "v2.5";

//_PAYMENT_URL = "http://payment.gymap.dev.ows.vn";
_PAYMENT_URL = "http://192.168.6.99/bkim/request.php";