import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    appearance: 'Light',
    language: 'English',
    twoFactorAuth: true,
    mobileNotifications: true,
    desktopNotifications: true,
    emailNotifications: true
  });

  const appearanceOptions = [
    { id: 1, name: 'Light' },
    { id: 2, name: 'Dark' },
    { id: 3, name: 'System' }
  ];

  const languageOptions = [
    { id: 1, name: 'English' },
    { id: 2, name: 'French' },
    { id: 3, name: 'Kinyarwanda' },
    { id: 4, name: 'Swahili' }
  ];

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:ring-offset-2 ${
        enabled ? 'bg-[#7152F3]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Settings Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="space-y-8">
            {/* Appearance */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Appearance</h3>
                <p className="text-sm text-[#A2A1A8]">Customize your theme focus on your device</p>
              </div>
              <div className="w-48">
                <Listbox value={settings.appearance} onChange={(value) => handleSelectChange('appearance', value)}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-[#7152F3] focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#7152F3] sm:text-sm">
                      <span className="block truncate">{settings.appearance}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {appearanceOptions.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          value={option.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-[#F5F3FF] text-[#7152F3]' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7152F3]">
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Language</h3>
                <p className="text-sm text-[#A2A1A8]">Select your language</p>
              </div>
              <div className="w-48">
                <Listbox value={settings.language} onChange={(value) => handleSelectChange('language', value)}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-[#7152F3] focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#7152F3] sm:text-sm">
                      <span className="block truncate">{settings.language}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                      {languageOptions.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          value={option.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-[#F5F3FF] text-[#7152F3]' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {option.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7152F3]">
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>

            {/* Two-factor Authentication */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Two-factor Authentication</h3>
                <p className="text-sm text-[#A2A1A8]">Keep your account secure by enabling 2FA via email</p>
              </div>
              <ToggleSwitch
                enabled={settings.twoFactorAuth}
                onToggle={() => handleToggle('twoFactorAuth')}
              />
            </div>

            {/* Mobile Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Mobile Push Notifications</h3>
                <p className="text-sm text-[#A2A1A8]">Receive push notification</p>
              </div>
              <ToggleSwitch
                enabled={settings.mobileNotifications}
                onToggle={() => handleToggle('mobileNotifications')}
              />
            </div>

            {/* Desktop Notification */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Desktop Notification</h3>
                <p className="text-sm text-[#A2A1A8]">Receive push notification on desktop</p>
              </div>
              <ToggleSwitch
                enabled={settings.desktopNotifications}
                onToggle={() => handleToggle('desktopNotifications')}
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#16151C]">Email Notifications</h3>
                <p className="text-sm text-[#A2A1A8]">Receive email notification</p>
              </div>
              <ToggleSwitch
                enabled={settings.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
