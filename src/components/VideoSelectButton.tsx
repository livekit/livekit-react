import { faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (item) => item.kind === "videoinput" && item.deviceId
      );
      setSources(videoDevices);
      setMenuItems(
        videoDevices.map((item) => {
          return { label: item.label };
        })
      );
    });
  }, [isEnabled]);

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
