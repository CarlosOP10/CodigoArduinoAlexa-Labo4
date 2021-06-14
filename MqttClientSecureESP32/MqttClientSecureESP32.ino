#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "DNSServer.h"
#include <WiFiManager.h>

#define DHTPIN 5
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int pinTrig = 12;
int pinEcho = 14 ;
int pinYellow = 4;
int pinGreen = 2;
int pinBlue = 15;
long duration;
float distance;
const char* AWS_ENDPOINT = "xxxxxxxxxxxxx-ats.iot.us-east-2.amazonaws.com";
const int AWS_ENDPOINT_PORT = 8883;

const char* MQTT_CLIENT_ID = "MCU_SACABA";
const char* SUBCRIBE_TOPIC = "ucb/esp_in"; // subscribe
const char *PUBLISH_TOPIC = "$aws/things/MCU_SACABA/shadow/update"; // publish

const char AMAZON_ROOT_CA1[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
)EOF";

const char CERTIFICATE[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
)KEY";

const char PRIVATE_KEY[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----
)KEY";

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

void ledsOn() {
  Serial.println("LEDS ON\n");
  digitalWrite(pinYellow, HIGH);
  digitalWrite(pinGreen, HIGH);
  digitalWrite(pinBlue, HIGH);
}

void ledsOff() {
  Serial.println("LEDS OFF\n");
  digitalWrite(pinYellow, LOW);
  digitalWrite(pinGreen, LOW);
  digitalWrite(pinBlue, LOW);
}

StaticJsonDocument<JSON_OBJECT_SIZE(1)> inputDoc;

// PubSubClient callback function
void callback(const char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += String((char) payload[i]);
  }
  if (String(topic) == SUBCRIBE_TOPIC) {
    Serial.println("Message from topic " + String(SUBCRIBE_TOPIC) + ":" + message);

    DeserializationError err = deserializeJson(inputDoc, payload);
    if (!err) {
      String action = String(inputDoc["action"].as<char*>());
      if (action == "ON_LED_YELLOW")
          digitalWrite(pinYellow, HIGH);
      if (action == "ON_LED_GREEN")
          digitalWrite(pinGreen, HIGH);
      if (action == "ON_LED_BLUE")
         digitalWrite(pinBlue, HIGH);
      if (action == "OFF_LED_YELLOW")
          digitalWrite(pinYellow, LOW);
      if (action == "OFF_LED_GREEN")
          digitalWrite(pinGreen, LOW);
      if (action == "OFF_LED_BLUE")
         digitalWrite(pinBlue, LOW);
      if (action == "ON_ALL_LEDS"){
        digitalWrite(pinYellow, HIGH);
        digitalWrite(pinGreen, HIGH);
        digitalWrite(pinBlue, HIGH);
      }
      if (action == "OFF_ALL_LEDS"){
        digitalWrite(pinYellow, LOW);
        digitalWrite(pinGreen, LOW);
        digitalWrite(pinBlue, LOW);
      }
    }
  }
}

boolean mqttClientConnect() {
  Serial.println("Connecting to AWS " + String(AWS_ENDPOINT));
  if (mqttClient.connect(MQTT_CLIENT_ID)) {
    Serial.println("Connected to " + String(AWS_ENDPOINT));

    mqttClient.subscribe(SUBCRIBE_TOPIC);

    Serial.println("Subscribed to " + String(SUBCRIBE_TOPIC));
  } else {
    Serial.println("Can't connect to " + String(AWS_ENDPOINT));
  }
  return mqttClient.connected();
}

void setup() {
  Serial.begin(115200);
  WiFiManager wifiManager;
  wifiManager.resetSettings();
  wifiManager.autoConnect(MQTT_CLIENT_ID,"12345678");
  
  Serial.println("Connected.....");
  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(pinTrig, OUTPUT); 
  pinMode(pinEcho, INPUT);
  pinMode(pinYellow,OUTPUT);
  pinMode(pinGreen,OUTPUT);
  pinMode(pinBlue,OUTPUT);

  wifiClient.setCACert(AMAZON_ROOT_CA1);
  wifiClient.setCertificate(CERTIFICATE);
  wifiClient.setPrivateKey(PRIVATE_KEY);

  mqttClient.setServer(AWS_ENDPOINT, AWS_ENDPOINT_PORT);
  mqttClient.setCallback(callback);
  dht.begin();
}

unsigned long previousConnectMillis = 0;
unsigned long previousPublishMillis = 0;

unsigned char counter = 0;

StaticJsonDocument<JSON_OBJECT_SIZE(11)> outputDoc;
char outputBuffer[512];

void readDistance()
{
    digitalWrite(pinTrig, LOW);
    delayMicroseconds(2);
    digitalWrite(pinTrig, HIGH);
    delayMicroseconds(10);
    digitalWrite(pinTrig, LOW);
    duration = pulseIn(pinEcho, HIGH);
    distance = duration * 0.034 / 2;
    long disResult = round(distance*10)/10.0;
    outputDoc["state"]["desired"]["ultrasonic"] = disResult;
    serializeJson(outputDoc, outputBuffer);
}

void readTemp()
{
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    float f = dht.readTemperature(true);
    if (isnan(h) || isnan(t) || isnan(f))
    {
        Serial.println("Error obteniendo los datos del sensor DHT11");
    }
    float hif = dht.computeHeatIndex(f, h);
    float hic = dht.computeHeatIndex(t, h, false);
    float hicResult = round(hic*10)/10.0;
    float fResult = round(f*10)/10.0;
    float tResult = round(t*10)/10.0;
    outputDoc["state"]["desired"]["temp"] = tResult;
    outputDoc["state"]["desired"]["hum"] = fResult;
    outputDoc["state"]["desired"]["indCalor"] = hicResult;
    serializeJson(outputDoc, outputBuffer);
}

void publishMessage() {
  readTemp();
  readDistance();
  Serial.println(outputBuffer);
  mqttClient.publish(PUBLISH_TOPIC, outputBuffer);
}

void loop() {
  unsigned long now = millis();
  if (!mqttClient.connected()) {
    // Connect to MQTT broker
    if (now - previousConnectMillis >= 4000) {
      previousConnectMillis = now;
      if (mqttClientConnect()) {
        previousConnectMillis = 0;
      } else delay(1000);
    }
  } else {
    // This should be called regularly to allow the client to process incoming messages and maintain its connection to the server.
    mqttClient.loop();
    delay(20);

    if (now - previousPublishMillis >= 1000*60*10) {
      previousPublishMillis = now;
      // Publish message
      publishMessage();
    }
  }
}