import { faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { Room } from "livekit-client";
import React, { useCallback, useEffect, useState } from "react";
import { ControlButton, MenuItem } from "./ControlButton";

export interface VideoSelectButtonProps {
  isEnabled: boolean;
  onClick?: () => void;
  onSourceSelected?: (device: MediaDeviceInfo) => void;
}

export const VideoSelectButton = ({
  isEnabled,
  onClick,
  onSourceSelected,
}: VideoSelectButtonProps) => {
  const [sources, setSources] = useState<MediaDeviceInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const listVideoDevices = useCallback(async () => {
    const devices = await Room.getLocalDevices("videoinput");
    setSources(devices);
    setMenuItems(
      devices.map((item) => {
        return { label: item.label };
      })
    );
  }, []);

  useEffect(() => {
    listVideoDevices();
    navigator.mediaDevices.addEventListener("devicechange", listVideoDevices);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        listVideoDevices
      );
    };
  }, []);

  const handleMenuItem = (item: MenuItem) => {
    const device = sources.find((d) => d.label === item.label);
    if (device && onSourceSelected) {
      onSourceSelected(device);
    }
  };

  return (
    <ControlButton
      label={isEnabled ? "Disable Video" : "Enable Video"}
      icon={isEnabled ? faVideo : faVideoSlash}
      onClick={onClick}
      menuItems={menuItems}
      onMenuItemClick={handleMenuItem}
    />
  );
};
