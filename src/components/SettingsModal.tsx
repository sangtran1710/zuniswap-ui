import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-[#191B1F] border border-[#2E2F32] p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Transaction Settings
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2C2D31] rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Slippage Tolerance
              </label>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-xl bg-[#2C2D31] text-white hover:bg-[#34353A] transition">
                  Auto
                </button>
                <input
                  type="text"
                  placeholder="0.50"
                  className="flex-1 bg-[#2C2D31] rounded-xl px-3 py-1 text-white placeholder-gray-500 outline-none"
                />
                <span className="flex items-center text-white">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Transaction Deadline
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="30"
                  className="w-20 bg-[#2C2D31] rounded-xl px-3 py-1 text-white placeholder-gray-500 outline-none"
                />
                <span className="flex items-center text-white">minutes</span>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SettingsModal; 