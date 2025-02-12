#!/usr/bin/env python3
import bluetooth
import paho.mqtt.client as mqtt
import time

# Bluetooth (Arduino) configuration 98:D3:51:F9:83:CC    98:D3:51:F9:85:50
target_address = "98:D3:51:F9:85:50"  # MAC address of the Arduino Bluetooth module
port = 1                             # RFCOMM typically uses port 1

# MQTT configuration
broker_address = "192.168.0.7"       # MQTT broker address
mqtt_client = mqtt.Client()

def send_to_bluetooth(command):
    """
    Sends a single command to the Arduino via Bluetooth.
    """
    try:
        # Create and connect the Bluetooth socket
        sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        print(f"[Bluetooth] Connecting to {target_address} on port {port}...")
        sock.connect((target_address, port))
        print("[Bluetooth] Connected to Arduino")
       
        # Prepare the command by stripping whitespace and appending a newline character
        full_command = command.strip() + "\n"
        print(f"[Bluetooth] Sending command: {full_command.strip()}")
        sock.send(full_command)
        print("[Bluetooth] Command sent successfully")
    except Exception as e:
        print(f"[Bluetooth] Error sending command: {e}")
    finally:
        try:
            #sock.close()
            print("[Bluetooth] Bluetooth socket closed")
        except Exception as e:
            print(f"[Bluetooth] Error closing socket: {e}")

def on_connect(client, userdata, flags, rc):
    """
    Callback when the MQTT client connects to the broker.
    """
    if rc == 0:
        print("[MQTT] Connected to broker successfully")
        # Subscribe to the inbound/# and release/# topics
        client.subscribe("inbound/#")
        client.subscribe("release/#")
        print("[MQTT] Subscribed to topics: inbound/#, release/#")
    else:
        print(f"[MQTT] Failed to connect with result code {rc}")

def on_message(client, userdata, msg):
    """
    Callback when an MQTT message is received.
    Processes one command at a time using 12 explicit conditional statements.
    """
    payload = msg.payload.decode().strip()
    print(f"[MQTT] Received message - Topic: {msg.topic}, Payload: {payload}")
   
    # Check for each valid command using explicit conditional statements
    if payload == "inbound1":
        send_to_bluetooth("((0, 1))\n")
    elif payload == "inbound2":
        send_to_bluetooth("((0, 2))\n")
    elif payload == "inbound3":
        send_to_bluetooth("((0, 3))\n")
    elif payload == "inbound4":
        send_to_bluetooth("((0, 4))\n")
    elif payload == "inbound5":
        send_to_bluetooth("((0, 5))\n")
    elif payload == "inbound6":
        send_to_bluetooth("((0, 6))\n")
    elif payload == "release1":
        send_to_bluetooth("((1, 1))\n")
    elif payload == "release2":
        send_to_bluetooth("((1, 2))\n")
    elif payload == "release3":
        send_to_bluetooth("((1, 3))\n")
    elif payload == "release4":
        send_to_bluetooth("((1, 4))\n")
    elif payload == "release5":
        send_to_bluetooth("((1, 5))\n")
    elif payload == "release6":
        send_to_bluetooth("((1, 6))\n")
    else:
        print(f"[MQTT] Invalid command received: {payload}")

def main():
    # Set up MQTT client callbacks
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    try:
        print(f"[MQTT] Connecting to broker at {broker_address}...")
        mqtt_client.connect(broker_address, 1883, 60)
    except Exception as e:
        print(f"[MQTT] Error connecting to broker: {e}")
        return

    # Start the MQTT loop to process messages continuously
    mqtt_client.loop_forever()

if __name__ == "__main__":
    main()