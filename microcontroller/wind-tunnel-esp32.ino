#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// Replace with your network credentials
const char* ssid = "your_ssid_here";
const char* password = "your_pass_here";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Variables for sensor reading and time tracking
unsigned long lastSensorReadTime = 0; // Tracks the last time the sensor was read
const unsigned long sensorInterval = 500; // 500 milliseconds interval
unsigned long lastCleanupTime = 0; // Tracks the last time clients were cleaned up
const unsigned long cleanupInterval = 5000; // Cleanup every 5 seconds
float sensorValue = 0.0;  // Mock sensor value

// Function to read and broadcast sensor value to all connected WebSocket clients
void broadcastSensorValue() {

  read_pitot_tube();
  read_load_cell();

}

void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, 
                      AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.println("Client connected");
    client->text("Hello Client");
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.println("Client disconnected");
  } else if (type == WS_EVT_DATA) {
    Serial.print("Received data: ");
    for (size_t i = 0; i < len; i++) {
      Serial.print((char) data[i]);
    }
    Serial.println();

    // Echo the message back to the client
    client->text("Message received: " + String((char*)data));
  }
}

void setup() {
  // Start the Serial Monitor
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Add WebSocket handler
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);

  // Start server
  server.begin();
  Serial.println("Server started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  setup_load_cell();

}

void loop() {
  // Get the current time
  unsigned long currentMillis = millis();

  // Check if 500 milliseconds have passed for sensor reading
  if (currentMillis - lastSensorReadTime >= sensorInterval) {
    lastSensorReadTime = currentMillis;  // Update the time stamp

    // Read sensor and broadcast the value
    broadcastSensorValue();
  }

  // Check if it's time to clean up clients (every 5 seconds)
  if (currentMillis - lastCleanupTime >= cleanupInterval) {
    lastCleanupTime = currentMillis;  // Update the time stamp

    // Clean up disconnected or inactive WebSocket clients
    ws.cleanupClients();
    Serial.println("Cleaned up WebSocket clients");
  }
}
