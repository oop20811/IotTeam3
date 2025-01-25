const { Client } = require("ssh2");
const mqtt = require("mqtt");
const express = require("express");

const app = express();
const conn = new Client();

// 라즈베리파이 SSH 연결 정보
const sshConfig = {
  host: "192.168.0.7", // 라즈베리파이 IP 주소
  port: 22,
  username: "pi", // 라즈베리파이 사용자 이름
  password: "1234", // 라즈베리파이 비밀번호
};

// 실행할 Python 스크립트 경로
const pythonScriptPath = "/home/pi/test1.py";

// MQTT 브로커 연결
const brokerUrl = "mqtt://192.168.0.7";
const client = mqtt.connect(brokerUrl);

let executing = false; // Python 스크립트 실행 상태 플래그

console.log("Connecting to MQTT broker...");

client.on("connect", () => {
  console.log("Connected to MQTT Broker");

  // `bluetooth/trigger` 토픽 구독
  client.subscribe("bluetooth/trigger", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to topic: bluetooth/trigger");
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "bluetooth/trigger" && message.toString() === "start") {
    if (executing) {
      console.log("Script already running. Ignoring trigger.");
      return;
    }

    executing = true; // 실행 중 상태 설정
    console.log(
      "Bluetooth trigger received, executing Python script on Raspberry Pi..."
    );

    conn
      .on("ready", () => {
        console.log("SSH Connection established.");
        conn.exec(`python3 ${pythonScriptPath}`, (err, stream) => {
          if (err) {
            console.error("Error executing Python script:", err);
            executing = false; // 실행 완료 상태 설정
            conn.end();
            return;
          }

          stream
            .on("close", (code, signal) => {
              console.log(
                `Python script finished with code ${code} and signal ${signal}`
              );
              executing = false; // 실행 완료 상태 설정
              conn.end();
            })
            .on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              console.error(`STDERR: ${data}`);
            });
        });
      })
      .connect(sshConfig);
  }
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

// HTTP API 설정
app.get("/trigger", (req, res) => {
  client.publish("bluetooth/trigger", "start", (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
      res.status(500).send("Trigger failed");
    } else {
      console.log("Published 'start' to bluetooth/trigger");
      res.send("Trigger sent");
    }
  });
});

// HTTP 서버 시작
app.listen(3000, () => {
  console.log("HTTP server listening on port 3000");
});
