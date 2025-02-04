// mqttClient.js
const mqtt = require("mqtt");

const brokerUrl = "mqtt://192.168.0.7"; // EMQX 브로커 IP
const mqttClient = mqtt.connect(brokerUrl);

// MQTT 연결 이벤트 핸들러
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

// MQTT 에러 이벤트 핸들러
mqttClient.on("error", (err) => {
  console.error("Failed to connect to MQTT broker:", err);
});

// MQTT 메시지 발행 함수
const publishMqttMessage = (topic, message) => {
  console.log(
    `Attempting to publish to topic: ${topic} with message: ${message}`
  );
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error(`Failed to publish to ${topic}:`, err);
    } else {
      console.log(`Published to ${topic}: ${message}`);
    }
  });
};

module.exports = {
  mqttClient,
  publishMqttMessage,
};
