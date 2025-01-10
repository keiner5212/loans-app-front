import { FC } from "react";
import ReactDOM from "react-dom";
import { PaymentStatus } from "./Pagos";

export const PaymentFilterPortal: FC<{
    show: boolean;
    onClose: () => void;
    selectedFilter: PaymentStatus | null;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearFilter: () => void;
}> = ({ show, onClose, selectedFilter, onFilterChange, clearFilter }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="filter-portal-overlay" onClick={onClose}>
            <div className="filter-portal" onClick={(e) => e.stopPropagation()}>
                <h4>Filtrar por estado de pago:</h4>
                <div className="filter-group">
                    {Object.values(PaymentStatus).map((status) => (
                        <label key={status}>
                            <input
                                type="radio"
                                name="paymentStatus"
                                value={status}
                                checked={selectedFilter === status}
                                onChange={onFilterChange}
                            />
                            {status}
                        </label>
                    ))}
                </div>
                <div className="filter-buttons">
                    <button onClick={onClose} className="close-button">
                        Cerrar
                    </button>
                    <button onClick={clearFilter} className="clear-button">
                        Limpiar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
