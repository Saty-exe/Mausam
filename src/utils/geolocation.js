import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

function getBrowserPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not available on this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function getCurrentPosition() {
  if (!Capacitor.isNativePlatform()) {
    return getBrowserPosition({ enableHighAccuracy: false, timeout: 15000 });
  }
  

  let permissions = await Geolocation.checkPermissions();
  if (permissions.location !== "granted") {
    permissions = await Geolocation.requestPermissions();
  }

  if (permissions.location !== "granted") {
    throw new Error("Location permission was denied.");
  }

  return Geolocation.getCurrentPosition({
    enableHighAccuracy: false,
    timeout: 15000,
  });
}