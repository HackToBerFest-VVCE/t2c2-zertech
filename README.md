RAKSHA — Personal Safety Companion
RAKSHA is a native Android safety-app prototype focused on Mysuru (Mysore), Karnataka. It brings together location-aware map tools, route awareness, digital fraud checks, and emergency-contact features in one app.
Main features
- Safety map: Interactive map centered on Mysuru, with location controls and safety-related map layers.
- Route awareness: Route options and distance/time comparisons where supported by the app's routing implementation.
- Digital fraud shield: Analyze pasted SMS messages and URLs for suspicious signals.
- SOS and contacts: Manage emergency contacts and view SOS-related information/history.
- Local persistence: Room/SQLite is used for local app data.
Technology
- Kotlin, Android, Jetpack Compose, and Material 3
- Leaflet map assets displayed in an Android WebView
- OpenStreetMap (OSM) map tiles and attribution
- Room/SQLite, Kotlin coroutines, and Android location APIs
Run the project
1. Extract the project ZIP.
2. Open the project folder in Android Studio.
3. Allow Gradle sync to complete and install any required Android SDK components.
4. Run the app on an Android emulator or a physical device, granting location permission when prompted.
5. To create a debug APK, use Build → Build Bundle(s) / APK(s) → Build APK(s). The APK is normally created under app/build/outputs/apk/debug/.
Map setup and demo notes
The intended key-free base map is the standard OSM tile layer:

https://tile.openstreetmap.org/{z}/{x}/{y}.png

Keep visible attribution to © OpenStreetMap contributors and follow the OSM tile usage policy. The public OSM tile service is not guaranteed production infrastructure; do not bulk-download tiles.

The current source also contains CARTO map-style options. Those styles may display an “API KEY REQUIRED” watermark if the provider requires a key. For a key-free demo, select the Streets (OSM) layer, or configure the app's default layer to use OSM. Changing the base tile layer does not automatically configure search or routing services.
Important limitations
- Treat RAKSHA as a student prototype, not a certified emergency-response service.
- Historical crime concentrations and route-risk scores must be backed by a verifiable dataset before being presented as real Mysuru crime statistics. A risk score is not a guarantee of safety or danger.
- Map search, routing, and nearby-place data depend on their configured external services and internet access.
- An SOS message being prepared or opened in the messaging app does not mean it was sent or delivered. Test with consent and do not contact emergency services during a demo.
- Do not commit API keys, signing credentials, private contacts, or personal datasets to version control.
Project status
This repository is a work in progress. Build and test the exact version being demonstrated, and describe only the features and data sources that have been verified.
