BUILDTOOLPATH="./../Android/Sdk/build-tools/21.1.2"
rm ./build/*
ionic build android --release
echo "Build for x86"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./keys/trip-app-release-key.keystore ./platforms/android/build/outputs/apk/android-release-unsigned.apk trip-app-key
jarsigner -verify -verbose -certs ./platforms/android/build/outputs/apk/android-release-unsigned.apk
mkdir -p ./build/
$BUILDTOOLPATH/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./build/trip-app.apk
