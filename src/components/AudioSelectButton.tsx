import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Room } from "livekit-client";
import React, { useCallback, useEffect, useState } from "react";
import { ControlButton, MenuItem } from "./ControlButton";

export interface AudioSelectButtonProps {
  isMuted: boolean;
  onClick?: () => void;
  onSourceSelected?: (device: MediaDeviceInfo) => void;
  isButtonDisabled?: boolean;
  muteText?: string;
  unmuteText?: string;
  className?: string;
  popoverContainerClassName?: string;
  popoverTriggerBtnClassName?: string;
  popoverTriggerBtnSeparatorClassName?: string;
}

export const AudioSelectButton = ({
  isMuted,
  onClick,
  onSourceSelected,
  isButtonDisabled,
  muteText = "Mute",
  unmuteText = "Unmute",
  className,
  popoverContainerClassName,
  popoverTriggerBtnClassName,
  popoverTriggerBtnSeparatorClassName,
}: AudioSelectButtonProps) => {
  const [sources, setSources] = useState<MediaDeviceInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const listAudioDevices = useCallback(async () => {
    const devices = await Room.getLocalDevices("audioinput");
    setSources(devices);
    setMenuItems(
      devices.map((item) => {
        return { label: item.label };
      })
    );
  }, []);

  useEffect(() => {
    listAudioDevices();
    navigator.mediaDevices.addEventListener("devicechange", listAudioDevices);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        listAudioDevices
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
      label={isMuted ? unmuteText : muteText}
      icon={isMuted ? faMicrophoneSlash : faMicrophone}
      disabled={isButtonDisabled}
      onClick={onClick}
      menuItems={menuItems}
      onMenuItemClick={handleMenuItem}
      className={className}
      popoverContainerClassName={popoverContainerClassName}
      popoverTriggerBtnClassName={popoverTriggerBtnClassName}
      popoverTriggerBtnSeparatorClassName={popoverTriggerBtnSeparatorClassName}
    />
  );
};
