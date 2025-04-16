import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-info" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
  };

  const bgColors = {
    success: 'bg-success/10',
    error: 'bg-error/10',
    info: 'bg-info/10',
    warning: 'bg-warning/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={`fixed top-4 right-4 flex items-center gap-3 p-4 rounded-lg shadow-lg 
        ${bgColors[type]} border border-border z-50`}
    >
      {icons[type]}
      <span className="text-text-1">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-surface-3 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-text-2" />
      </button>
    </motion.div>
  );
};

export default Notification; 