import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  hasTwoButtons: boolean;
  button1Text: string;
  button1Action: () => void;
  button2Text?: string;
  button2Action?: () => void;
  closeOnOutsideClick: boolean;
  onClose: () => void;
}

/**
 *
 * @param {ModalProps} props
 * @param {boolean} props.isOpen Indica si el modal está abierto
 * @param {string} props.title Título del modal
 * @param {string} props.message Mensaje del modal
 * @param {boolean} props.hasTwoButtons Indica si tiene 1 o 2 botones
 * @param {string} props.button1Text Texto del botón 1
 * @param {() => void} props.button1Action Acción del botón 1
 * @param {string} props.button2Text Texto del botón 2 (opcional)
 * @param {() => void} props.button2Action Acción del botón 2 (opcional)
 * @param {boolean} props.closeOnOutsideClick Indica si se puede cerrar tocando fuera
 * @param {() => void} props.onClose Función que se ejecuta al cerrar el modal
 * @returns
 */
const SimpleModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  hasTwoButtons,
  button1Text,
  button1Action,
  button2Text,
  button2Action,
  closeOnOutsideClick,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : "close"}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-button" onClick={button1Action}>
            {button1Text}
          </button>
          {hasTwoButtons && button2Text && button2Action && (
            <button className="modal-button" onClick={button2Action}>
              {button2Text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
