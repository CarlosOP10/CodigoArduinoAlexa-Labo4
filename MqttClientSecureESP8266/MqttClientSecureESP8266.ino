#include "FS.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include<WiFiManager.h>  
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
int pinTrig = 16;
int pinEcho = 5;
int pinYellow = 14;
int pinGreen = 13;
int pinRed = 15;
long duration;
float distance;
const long utcOffsetInSeconds = -14400;
const char* MQTT_CLIENT_ID = "MCU_NAME";
const char *SUBCRIBE_TOPIC = "ucb/esp_in"; // subscribe
const char *PUBLISH_TOPIC = "$aws/things/MCU_QUILLACOLLO/shadow/update"; // publish
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

const char *AWS_endpoint = "xxxxxxxxxxx-ats.iot.us-east-2.amazonaws.com"; //MQTT broker ip

StaticJsonDocument<JSON_OBJECT_SIZE(1)> inputDoc;
void ledOn()
{
    digitalWrite(pinYellow, HIGH);
}

void ledOff()
{
    digitalWrite(pinYellow, LOW);
}
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

void callback(char *topic, byte *payload, unsigned int length)
{
    String message = "";
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
        message = message + (char)payload[i];
    }

    if (String(topic) == SUBCRIBE_TOPIC)
    {
        Serial.println("Message from topic " + String(SUBCRIBE_TOPIC) + ":" + message);

        DeserializationError err = deserializeJson(inputDoc, payload);
        if (!err)
        {
            String action = String(inputDoc["action"].as<char *>());
            if (action == "ON_LED_YELLOW")
                digitalWrite(pinYellow, HIGH);
            if (action == "ON_LED_GREEN")
                digitalWrite(pinGreen, HIGH);
            if (action == "ON_LED_BLUE")
               digitalWrite(pinRed, HIGH);
            if (action == "OFF_LED_YELLOW")
                digitalWrite(pinYellow, LOW);
            if (action == "OFF_LED_GREEN")
                digitalWrite(pinGreen, LOW);
            if (action == "OFF_LED_BLUE")
               digitalWrite(pinRed, LOW);
            if (action == "ON_ALL_LEDS"){
              digitalWrite(pinYellow, HIGH);
              digitalWrite(pinGreen, HIGH);
              digitalWrite(pinRed, HIGH);
            }
            if (action == "OFF_ALL_LEDS"){
              digitalWrite(pinYellow, LOW);
              digitalWrite(pinGreen, LOW);
              digitalWrite(pinRed, LOW);
            }
        }
    }
}
WiFiClientSecure espClient;
PubSubClient client(AWS_endpoint, 8883, callback, espClient); 
long lastMsg = 0;
int value = 0;

void reconnect()
{
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (client.connect(MQTT_CLIENT_ID))
        {
            Serial.println("connected");
            client.subscribe("ucb/esp_in");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");

            char buf[256];
            espClient.getLastSSLError(buf, 256);
            Serial.print("WiFiClientSecure SSL error: ");
            Serial.println(buf);
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(115200);  
    WiFiManager wifiManager;  
    //wifiManager.resetSettings();
    wifiManager.autoConnect(MQTT_CLIENT_ID);  
    Serial.println("Connected.....");
    
    timeClient.begin();
    while(!timeClient.update()){
      timeClient.forceUpdate();
    }  
    espClient.setX509Time(timeClient.getEpochTime());
    
    pinMode(pinTrig, OUTPUT);
    pinMode(pinEcho, INPUT);
    pinMode(pinYellow, OUTPUT);
    pinMode(pinGreen, OUTPUT);
    pinMode(pinRed, OUTPUT);
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.setDebugOutput(true);
    pinMode(LED_BUILTIN, OUTPUT);
    dht.begin();
    if (!SPIFFS.begin())
    {
        Serial.println("Failed to mount file system");
        return;
    }

    File cert = SPIFFS.open("/cert.der", "r");
    if (!cert)
    {
        Serial.println("Failed to open cert file");
    }
    else
        Serial.println("Success to open cert file");

    delay(1000);

    if (espClient.loadCertificate(cert))
        Serial.println("cert loaded");
    else
        Serial.println("cert not loaded");

    File private_key = SPIFFS.open("/private.der", "r");
    if (!private_key)
    {
        Serial.println("Failed to open private cert file");
    }
    else
        Serial.println("Success to open private cert file");

    delay(1000);

    if (espClient.loadPrivateKey(private_key))
        Serial.println("private key loaded");
    else
        Serial.println("private key not loaded");
    File ca = SPIFFS.open("/ca.der", "r"); 
    if (!ca)
    {
        Serial.println("Failed to open ca ");
    }
    else
        Serial.println("Success to open ca");

    delay(1000);

    if (espClient.loadCACert(ca))
        Serial.println("ca loaded");
    else
        Serial.println("ca failed");

    Serial.print("Heap: ");
    Serial.println(ESP.getFreeHeap());
}

void publishMessage()
{
    readTemp();
    readDistance();
    Serial.println(outputBuffer);
    client.publish(PUBLISH_TOPIC, outputBuffer);
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    long now = millis();
    if (now - lastMsg > 1000*60*10)
    {
        lastMsg = now;
        publishMessage();
        Serial.print("Heap: ");
        Serial.println(ESP.getFreeHeap());
    }
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);                    
    digitalWrite(LED_BUILTIN, LOW); 
    delay(100);                      
}