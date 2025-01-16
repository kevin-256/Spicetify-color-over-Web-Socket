import React, { useEffect, useState } from "react";
import { getSettings, WsSettings, LOCAL_STORAGE_KEY } from "./app";

const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const SettingsModal: React.FC = () => {
    const [settings, setSettings] = useState<WsSettings>({
        enabled: true,
        serverIp: "127.0.0.1",
        serverPort: 8080,
    });

    const [ipError, setIpError] = useState<string>("");
    const [portError, setPortError] = useState<string>("");

    useEffect(() => {
        const savedSettings = getSettings();
        if (savedSettings) {
            setSettings(savedSettings);
        }
    }, []);

    const validateIp = (ip: string): boolean => {
        return ipPattern.test(ip);
    };
    const validatePort = (port: number): boolean => {
        return 0 <= port && port <=65535;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: newValue,
        }));
    }
    const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        if (name === "serverIp" && value && !validateIp(value)) {
            setIpError("Ip must be x.y.z.w");
        } else {
            setIpError("");
        }
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: newValue,
        }));
    };

    const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = Number(e.target.value);
        const type = e.target.type;
        const checked = e.target.checked;
        const newValue = type === "checkbox" ? checked : value;
        if (name === "serverPort" && value && !validatePort(value)) {
            setPortError("Port must be from 0 to 65535");
        } else {
            setPortError("");
        }
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateIp(settings.serverIp)) {
            setIpError("Ip must be x.y.z.w");
            Spicetify.showNotification("Ip must be x.y.z.w", true);
            return;
        }
        if (!validatePort(settings.serverPort)) {
            setPortError("Port must be from 0 to 65535");
            Spicetify.showNotification("Port must be from 0 to 65535", true);
            return;
        }

        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            Spicetify.showNotification("Settings saved successfully", false);
            Spicetify.PopupModal.hide();
        } catch (error) {
            console.error("Error saving settings:", error);
            Spicetify.showNotification("Failed to save settings", true);
        }
    };

    return (
        <div className="ws-settings">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="setting-row">
                        <div className="setting-content">
                            <label htmlFor="enabled">Enable Color over Web Socket Extension</label>
                            <label className="switch">
                                <input type="checkbox" id="enabled" name="enabled" checked={settings.enabled}
                                    onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="description">Turn the extension on or off</div>
                    </div>

                    {/* <div className="setting-row">
                        <div className="setting-content">
                            <label htmlFor="serverIp">Web Socket server IP</label>
                            <input type="text" placeholder="127.0.0.1" id="serverIp" name="serverIp"
                                value={settings.serverIp} onChange={handleIpChange} required className={ipError ? "error" : ""
                                } />
                        </div>
                        <div className="description">
                            {ipError && <div className="error-message">{ipError}</div>}
                            Enter the ip address of your Web Socket server (e.g.,
                            127.0.0.1).
                        </div>
                    </div> */}

                    <div className="setting-row">
                        <div className="setting-content">
                            <label htmlFor="serverPort">Web Socket server port</label>
                            <input type="text" placeholder="8080" id="serverPort" name="serverPort"
                                value={settings.serverPort} onChange={handlePortChange} required className={portError ? "error" : ""} />
                        </div>
                        <div className="description">
                            {portError && <div className="error-message">{portError}</div>}
                            Enter the port of your Web Socket server (e.g.,
                            8080).
                        </div>
                    </div>
                    <div className="button-row">
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;