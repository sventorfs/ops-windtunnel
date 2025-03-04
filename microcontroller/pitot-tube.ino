
// the loop routine runs over and over again forever:
void read_pitot_tube() {
    
  int avg_size = 10;
  int avg_total = 0;
  for (int ii = 0; ii < avg_size; ii++) {
    // read the input on analog pin 0:
    avg_total += analogRead(33);
    delay(50);
  }

  float sensorValue = avg_total / avg_size;

  // print out the value you read:

  float offset_voltage = 0.09;

  float Vout = sensorValue * (3.3/ 4096) - offset_voltage;
  float Vs = 3.3;
  float pressure = (((Vout / Vs) - 0.5) / 0.2) * 1000.0; // Pa

  float airDensity = 1.293;
  float velocity = sqrt(2.0 * pressure / airDensity);
  float velocityPerHour = velocity * 3.6;

  Serial.print("Output voltage: ");
  Serial.print(Vout);
  Serial.print(" | Calculated pressure: ");
  Serial.print(pressure / 1000);
  Serial.print(" | Velocity: ");
  Serial.print(velocity);
  Serial.print(" m/s (");
  Serial.print(velocityPerHour);
  Serial.println(" km/h)");

  String message = "wind: " + String(velocityPerHour);
  ws.textAll(message);

  delay(200);  // delay in between reads for stability
}