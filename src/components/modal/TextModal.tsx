import "./simpleModal/Modal.css";

interface TextModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    isTextArea: boolean; // Determina si es un <textarea> o <input>
    placeholder?: string; // Placeholder del campo de texto
    value?: string; // Valor inicial del campo de texto
    onChange?: (e: any) => void;
    button1Text: string;
    button1Action: (text: string) => void; // Acción del botón 1
    button2Text?: string;
    button2Action?: () => void; // Acción del botón 2 (opcional)
    closeOnOutsideClick: boolean;
    onClose: () => void;
}

/**
 * Modal con una caja de texto configurable (input o textarea).
 * @param {TextModalProps} props
 * @returns
 */
const TextModal: React.FC<TextModalProps> = ({
    isOpen,
    title,
    message,
    isTextArea,
    placeholder,
    value = "",
    onChange = () => { },
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
                <div className="modal-input-container">
                    {isTextArea ? (
                        <textarea
                            className="modal-textarea"
                            rows={3}
                            value={value}
                            placeholder={placeholder}
                            onChange={onChange}
                        />
                    ) : (
                        <input
                            className="modal-input"
                            type="text"
                            value={value}
                            placeholder={placeholder}
                            onChange={onChange}
                        />
                    )}
                </div>
                <div className="modal-buttons">
                    <button className="modal-button" onClick={() => button1Action(value)}>
                        {button1Text}
                    </button>
                    {button2Text && button2Action && (
                        <button className="modal-button" onClick={button2Action}>
                            {button2Text}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextModal;
