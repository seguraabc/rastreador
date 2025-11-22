import { BleClient, numberToUUID } from '@capacitor-community/bluetooth-le';
import { TARGET_SERVICE_UUID } from '../constants';
import { BeaconData } from '../types';

export class BLEService {
    private static isInitialized = false;

    static async initialize(): Promise<void> {
        if (!this.isInitialized) {
            await BleClient.initialize();
            this.isInitialized = true;
        }
    }

    static async requestPermissions(): Promise<boolean> {
        try {
            await this.initialize();
            // requestDevice is often used to trigger the permission dialog if not already granted,
            // but strict permission requests can be done via the plugin if needed.
            // For scanning, we usually need Location (on older Android) and Bluetooth Scan/Connect (Android 12+).
            // The plugin handles some of this, but we might need to be explicit.

            // Note: BleClient.initialize() usually checks for basic availability.
            // We can try a dummy scan or just proceed.
            return true;
        } catch (error) {
            console.error('Error requesting BLE permissions:', error);
            return false;
        }
    }

    static async startScanning(
        onDeviceFound: (beacon: BeaconData) => void
    ): Promise<void> {
        try {
            await this.initialize();

            // Stop any existing scan to be safe
            try {
                await BleClient.stopLEScan();
            } catch (e) {
                // Ignore if not scanning
            }

            console.log('Starting BLE Scan for service:', TARGET_SERVICE_UUID);

            await BleClient.requestLEScan(
                {
                    services: [TARGET_SERVICE_UUID],
                },
                (result) => {
                    console.log('Received BLE Scan Result:', result);

                    // Parse RSSI and other data
                    // Note: The plugin returns 'device' and 'rssi' and 'txPower' etc.
                    // We need to map this to our BeaconData structure.
                    // 'minor' is usually part of the manufacturer data or specific characteristic,
                    // but for this generic detector, we might just use the device ID or a hash of it if 'minor' isn't available.
                    // If the ESP32 is advertising iBeacon format, we'd need to parse manufacturerData.
                    // For simplicity, we'll assume the ESP32 advertises a service and we use the device ID as a proxy for 'minor' or just generate one.

                    // In a real iBeacon scenario, we would parse `result.manufacturerData`.
                    // Here we will just use the device ID and RSSI.

                    const mockMinor = parseInt(result.device.deviceId.replace(/\D/g, '').slice(-4) || '0000');

                    const beaconData: BeaconData = {
                        uuid: TARGET_SERVICE_UUID,
                        minor: mockMinor, // Simplified for this generic BLE scan
                        rssi: result.rssi,
                        timestamp: Date.now()
                    };

                    onDeviceFound(beaconData);
                }
            );
        } catch (error) {
            console.error('Error starting BLE scan:', error);
            throw error;
        }
    }

    static async stopScanning(): Promise<void> {
        try {
            await BleClient.stopLEScan();
            console.log('BLE Scan stopped');
        } catch (error) {
            console.error('Error stopping BLE scan:', error);
        }
    }
}
