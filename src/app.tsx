import React from "react";
import SettingsModal from "./modal";
export const LOCAL_STORAGE_KEY = `ws-settings`;
let currentColor: string;
import "./styles.scss";

export interface WsSettings {
  enabled: boolean;
  serverIp: string;
  serverPort: number;
}
export function getSettings(): WsSettings | null {
  const settings = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (settings !== null) {
    return JSON.parse(settings);
  }
  return null;
}

//TO FIX
function openSettingsModal(): void {
  Spicetify.PopupModal.display({
    title: "Set up Web Socket connection",
    // `content:` expects a string or HTMLElement, but we are providing a React.JSX.Element. I dont know how to fix that.
    // @ts-ignore
    content: <SettingsModal/>,
    isLarge: true,
  });
};

async function sendWsRgbColor( serverIp: string, serverPort: number, color: [number, number, number]): Promise<void> {
  try {
    // const socket = new WebSocket(`ws://${serverIp}:${serverPort}`);
    const socket = new WebSocket(`ws://127.0.0.1:${serverPort}`);
    socket.onopen = () => {
      const message = {
        red: color[0],
        green: color[1],
        blue: color[2]
      };
      // Convert the JavaScript object to a JSON string and send it
      socket.send(JSON.stringify(message));
      socket.close();
    };
    console.debug(`Set lights to ${color}`);
  } catch (error) {
    console.error("Failed to send message to the server:", error);
    Spicetify.showNotification(`Failed to send message to the server`, true);
  }
};

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

async function handleSongChange(): Promise<void> {
  const settings = getSettings();
  if (!settings) {
    Spicetify.showNotification("No Web Socket Server settings found", false, 3000);
    return;
  }
  if (!settings.enabled) {
    return;
  }
  if (!settings.serverIp || !settings.serverPort) {
    Spicetify.showNotification(
      "Web Socket Server settings incomplete",
      false,
      3000
    );
    return;
  }
  try {
    // Get color from current track
    const currentTrack = Spicetify.Player.data.item;
    const colors = await Spicetify.colorExtractor(currentTrack.uri);
    const selectedColor = colors.DESATURATED;

    // Check if color is the same
    if (currentColor === selectedColor) {
      console.debug("Same color, not changing");
      return;
    }
    currentColor = selectedColor;

    await sendWsRgbColor(
      settings.serverIp,
      settings.serverPort,
      hexToRgb(selectedColor)
    );
  } catch (error) {
    console.error("Error changing lights:", error);
    Spicetify.showNotification("Failed to change lights", true);
  }
};

function main(): void {
  Spicetify.Player.addEventListener("songchange", handleSongChange);
  Spicetify.Player.addEventListener("onplaypause", (event) => {
    if (!event?.data.isPaused) {
      handleSongChange();
    }
  });

  new Spicetify.Menu.Item(
    "Web Socket Settings",
    false,
    openSettingsModal,
    `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="16" height="16" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M21.25,4.0020191 C21.6296958,4.0020191 21.943491,4.28417298 21.9931534,4.65024855 L22,4.7520191 L22,19.2520191 C22,19.6317149 21.7178461,19.9455101 21.3517706,19.9951725 L21.25,20.0020191 L2.75,20.0020191 C2.37030423,20.0020191 2.05650904,19.7198652 2.00684662,19.3537897 L2,19.2520191 L2,4.7520191 C2,4.37232334 2.28215388,4.05852814 2.64822944,4.00886572 L2.75,4.0020191 L21.25,4.0020191 Z M6,12.5010191 L3.5,12.5010191 L3.5,18.502 L20.5,18.502 L20.5,12.5010191 L18,12.5010191 L18,16.25 C18,16.6642136 17.6642136,17 17.25,17 C16.8703042,17 16.556509,16.7178461 16.5068466,16.3517706 L16.5,16.25 L16.5,12.5010191 L14.5,12.5010191 L14.5,16.25 C14.5,16.6642136 14.1642136,17 13.75,17 C13.3703042,17 13.056509,16.7178461 13.0068466,16.3517706 L13,16.25 L13,12.5010191 L11,12.5010191 L11,16.25 C11,16.6642136 10.6642136,17 10.25,17 C9.87030423,17 9.55650904,16.7178461 9.50684662,16.3517706 L9.5,16.25 L9.5,12.5010191 L7.5,12.5010191 L7.5,16.25 C7.5,16.6642136 7.16421356,17 6.75,17 C6.37030423,17 6.05650904,16.7178461 6.00684662,16.3517706 L6,16.25 L6,12.5010191 Z M20.5,5.502 L3.5,5.502 L3.5,11.001 L20.5,11.001 L20.5,5.502 Z M9.25,7.50193212 C9.66421356,7.50193212 10,7.83771856 10,8.25193212 C10,8.66614568 9.66421356,9.00193212 9.25,9.00193212 C8.83578644,9.00193212 8.5,8.66614568 8.5,8.25193212 C8.5,7.83771856 8.83578644,7.50193212 9.25,7.50193212 Z M17.25,7.50092257 C17.6642136,7.50092257 18,7.836709 18,8.25092257 C18,8.63061833 17.7178461,8.94441353 17.3517706,8.99407595 L17.25,9.00092257 L14.75,9.00092257 C14.3357864,9.00092257 14,8.66513613 14,8.25092257 C14,7.8712268 14.2821539,7.55743161 14.6482294,7.50776918 L14.75,7.50092257 L17.25,7.50092257 Z M6.25,7.5 C6.66421356,7.5 7,7.83578644 7,8.25 C7,8.66421356 6.66421356,9 6.25,9 C5.83578644,9 5.5,8.66421356 5.5,8.25 C5.5,7.83578644 5.83578644,7.5 6.25,7.5 Z" id="🎨-Color"></path>
      </svg>
    `
  ).register();
}
  
  export default main;