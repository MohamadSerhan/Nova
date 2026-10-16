# NOVA (prototype)

Clickable prototype of the NOVA V1 shell: Home (people row + posts), Chats (1:1 with sending), Rooms (join/leave/request), Profile (interests, privacy toggles, Nearby OFF by default). All data is sample data on the device; there is no backend yet.

## Get the APK

1. Create a GitHub repo and upload everything in this folder, including the hidden `.github` folder.
2. Open **Actions** → **Build NOVA APK** and wait for the green check (about 10 minutes).
3. Download the `NOVA-debug-apk` artifact, unzip it, install `app-debug.apk` on your phone.

If the build fails, the workflow log shows where; send it to Claude to fix.

## Run locally

`npm install` then `npx expo start`, and open it in Expo Go.
