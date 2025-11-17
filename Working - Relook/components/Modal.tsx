
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content bg-[#1a1b1e] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;