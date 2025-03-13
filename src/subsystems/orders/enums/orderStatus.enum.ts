export enum OrderStatus {
    Pending = 'pending', // Cuando el usuario crea la orden pero no ha pagado
    Accepted = 'accepted',
    Cancelled = 'cancelled', // Cuando un admin cancela la orden
    Retired = 'retired', // Cuando el usuario retira la orden
    Paid = 'paid', // Cuando el usuario paga la orden
    Completed = 'completed', // Cuando se realiza la entrega
}