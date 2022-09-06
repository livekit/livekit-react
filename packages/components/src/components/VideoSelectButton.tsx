import { faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { Room } from 'livekit-client';
import React, { useCallback, useEffect, useState } from 'react';
import { ControlButton, MenuItem } from './ControlButton';

export interface VideoSelectButtonProps {
  isEnabled: boolean;
  onClick?: () => void;
  onSourceSelected?: (device: MediaDeviceInfo) => void;
  disableText?: string;
  enableText?: string;
  requestPermissions?: boolean;
  className?: string;
  isButtonDisabled?: boolean;
  popoverContainerClassName?: string;
  popoverTriggerBtnClassName?: string;
  popoverTriggerBtnSeparatorClassName?: string;
}

export const VideoSelectButton = ({
  isEnabled,
  onClick,
  onSourceSelected,
  disableText = 'Disable Video',
  enableText = 'Enable Video',
  requestPermissions = true,
  className,
  isButtonDisabled,
  popoverContainerClassName,
  popoverTriggerBtnClassName,
  popoverTriggerBtnSeparatorClassName,
}: VideoSelectButtonProps) => {
  const [sources, setSources] = useState<MediaDeviceInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const listVideoDevices = useCallback(async () => {
    const devices = await Room.getLocalDevices('videoinput', requestPermissions);
    setSources(devices);
    setMenuItems(
      devices.map((item) => {
        return { label: item.label };
      }),
    );
  }, []);

  useEffect(() => {
    listVideoDevices();
    navigator.mediaDevices.addEventListener('devicechange', listVideoDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', listVideoDevices);
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
      label={isEnabled ? disableText : enableText}
      icon={isEnabled ? faVideo : faVideoSlash}
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
