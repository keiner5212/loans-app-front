
export enum Status {
    //pendiente
    PENDING = "Pendiente",
    //aprobado
    APPROVED = "Aprovado",
    //rechazado
    REJECTED = "Rechazado",
    //desembolsado
    RELEASED = "Desembolsado",
    //atrasado
    LATE = "Atrasado",
    //terminado
    FINISHED = "Terminado",
    //cancelado
    CANCELED = "Cancelado",
}

export const StatusObjectValues: { [key: string]: string } = {
    [Status.PENDING]: "Pendiente",
    [Status.APPROVED]: "Aprovado",
    [Status.REJECTED]: "Rechazado",
    [Status.RELEASED]: "Desembolsado",
    [Status.LATE]: "Atrasado",
    [Status.FINISHED]: "Terminado",
    [Status.CANCELED]: "Cancelado",
}


export enum CreditType {
    CREDIT = "Credito",
    FINANCING = "Financiamiento",
}