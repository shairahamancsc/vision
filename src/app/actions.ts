"use server";

export type DeviceFormInput = {
    customerName: string;
};

export async function getDiagnostics(input: DeviceFormInput) {
    try {
        const ticketId = `DRX-${Math.floor(100000 + Math.random() * 900000)}`;
        
        return {
            ticketId,
            customerName: input.customerName,
        };
    } catch (error) {
        console.error("Error getting diagnostics:", error);
        return null;
    }
}
