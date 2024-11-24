import { Roles } from "../../constants/permisions/Roles";

export function hasPermision(role: string | undefined, permision: string): boolean {
    if (!role) return false;
    if (role == Roles.USER_MASTER) return true; // El master tiene todos los permisos
    if (role === Roles.USER_ADMIN) return permision !== Roles.USER_MASTER; // El admin tiene todos los permisos menos el de master
    return role == permision // El usuario tiene el mismo rol que el permiso
}