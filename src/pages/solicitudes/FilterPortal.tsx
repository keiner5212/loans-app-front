import { FC } from "react";
import ReactDOM from "react-dom";
import { CreditType, Status } from "../../constants/credits/Credit";

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
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value={CreditType.CREDIT}
                                checked={selectedFilter.type === CreditType.CREDIT}
                                onChange={onFilterChange}
                            />
                            Crédito
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value={CreditType.FINANCING}
                                checked={selectedFilter.type === CreditType.FINANCING}
                                onChange={onFilterChange}
                            />
                            Financiamiento
                        </label>
                    </div>
                    <div className="filter-group">
                        <p>Estado:</p>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.APPROVED}
                                checked={selectedFilter.status === Status.APPROVED}
                                onChange={onFilterChange}
                            />
                            APPROVED
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.REJECTED}
                                checked={selectedFilter.status === Status.REJECTED}
                                onChange={onFilterChange}
                            />
                            REJECTED
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.PENDING}
                                checked={selectedFilter.status === Status.PENDING}
                                onChange={onFilterChange}
                            />
                            PENDING
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.FINISHED}
                                checked={selectedFilter.status === Status.FINISHED}
                                onChange={onFilterChange}
                            />
                            FINISHED
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.RELEASED}
                                checked={selectedFilter.status === Status.RELEASED}
                                onChange={onFilterChange}
                            />
                            RELEASED
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value={Status.LATE}
                                checked={selectedFilter.status === Status.LATE}
                                onChange={onFilterChange}
                            />
                            LATE
                        </label>
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
