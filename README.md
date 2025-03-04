# OPS Windtunnel Project

### Architecture

* Esp32 microcontroller
  * connects to a local wifi network 
  * spins up a WebSocket server 
  * reads out sensor data from a weigh cell and a differential pressure sensor
  * broadcasts sensor data to all connected devices

* NextJs web app 
  * connects to the same local wifi network 
  * spins up a WebSocket client connected to the server on the ESP32
  * interprets the data 
  * shows a live graph

### How to make it work

* Wire up the esp32 to the sensors (hardest part because I am bad at wiring)
* In `/microcontroller/wind-tunnel-exp32.ino`, enter your wifi network credentials at the placeholder `your_ssid_here` and `your_pass_here`
* Find the local IP of the Esp32 and enter it in `dashboard/src/app/page` at the placeholder `esp32_local_ip_here`
* Boot up the Esp32
* Start the webapp with `cd dashboard` and `npm install && npm run dev`


### Questions and help
sven.torfs@tmc.nl
