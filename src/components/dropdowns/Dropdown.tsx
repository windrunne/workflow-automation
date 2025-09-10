import React, { ReactNode, useEffect, useRef } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  position?: 'left' | 'right';
  width?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  position = 'left',
  width = 'w-80'
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = position === 'right' 
    ? 'absolute top-full right-0 mt-1' 
    : 'absolute top-full left-0 mt-1';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" />
      
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`
          ${positionClasses} ${width} 
          bg-white rounded-lg shadow-lg border border-gray-200 z-50
          ${className}
        `}
      >
        {children}
      </div>
    </>
  );
};

export default Dropdown;
