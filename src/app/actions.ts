"use server";

export type DiagnosisData = {
    ticketId: string;
    customerName: string;
};

export type DeviceFormInput = {
    brand: string;
    model: string;
    customerName: string;
    mobileNumber: string;
    address: string;
    problemDescription: string;
};

export async function getDiagnostics(input: DeviceFormInput): Promise<DiagnosisData | null> {
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
