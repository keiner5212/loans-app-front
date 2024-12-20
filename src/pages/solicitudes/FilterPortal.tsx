import { FC } from "react";
import ReactDOM from "react-dom";
import { CreditType, Status } from "@/constants/credits/Credit";

export const FilterPortal: FC<{
    show: boolean; onClose: () => void;
    selectedFilter: any; onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    clearFilter: () => void
}>
    = ({ show, onClose, selectedFilter, onFilterChange, clearFilter }) => {
        if (!show) return null;

        return ReactDOM.createPortal(
            <div className="filter-portal-overlay" onClick={onClose}>
                <div className="filter-portal" onClick={(e) => e.stopPropagation()}>
                    <h4>Filtrar por:</h4>
                    <div className="filter-group">
                        <p>Tipo:</p>
                        {Object.values(CreditType).map((type) => (
                            <label key={type}>
                                <input
                                    type="radio"
                                    name="type"
                                    value={type}
                                    checked={selectedFilter.type === type}
                                    onChange={onFilterChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    <div className="filter-group">
                        <p>Estado:</p>
                        {Object.keys(Status).map((key) => (
                            <label key={key}>
                                <input
                                    type="radio"
                                    name="status"
                                    value={key}
                                    checked={selectedFilter.status === key}
                                    onChange={onFilterChange}
                                />
                                {key}
                            </label>
                        ))}
                    </div>
                    <div className="filter-buttons">
                        <button onClick={onClose} className="close-button">
                            Cerrar
                        </button>
                        <button onClick={clearFilter} className="close-button">
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };
