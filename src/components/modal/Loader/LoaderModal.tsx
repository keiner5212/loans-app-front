import React from "react";
import "../simpleModal/Modal.css";
import { Loader } from "../../Loader";

interface ModalProps {
    isOpen: boolean;
}

/**
 *
 * @param {ModalProps} props
 * @param {boolean} props.isOpen Indica si el modal está abierto
 */
const LoaderModal: React.FC<ModalProps> = ({
    isOpen
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={`modal-overlay ${isOpen ? "open" : "close"}`}
        >
            <Loader size="70px" />
        </div>
    );
};

export default LoaderModal;
