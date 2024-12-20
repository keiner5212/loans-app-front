import { FC } from "react";
import ReactDOM from "react-dom";
import { Roles } from "@/constants/permisions/Roles";

export const FilterPortal: FC<{
    show: boolean;
    onClose: () => void;
    selectedFilter: { role: Roles | string };
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearFilter: () => void;
}> = ({ show, onClose, selectedFilter, onFilterChange, clearFilter }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="filter-portal-overlay" onClick={onClose}>
            <div className="filter-portal" onClick={(e) => e.stopPropagation()}>
                <h4>Filtrar por Rol:</h4>
                <div className="filter-group">
                    <p>Rol:</p>
                    {Object.values(Roles).map((role) => (
                        <label key={role}>
                            <input
                                type="radio"
                                name="role"
                                value={role}
                                checked={selectedFilter.role === role}
                                onChange={onFilterChange}
                            />
                            {role.replace('USER_', '').replace('_', ' ')}
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
