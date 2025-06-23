"use server";

import { diagnoseDevice } from "@/ai/flows/diagnose-device-flow";
import type { DiagnoseDeviceInput } from "@/ai/flows/diagnose-device-flow";

export async function getDiagnostics(input: DiagnoseDeviceInput) {
    try {
        const diagnosisResult = await diagnoseDevice(input);
        
        const ticketId = `DRX-${Math.floor(100000 + Math.random() * 900000)}`;
        
        return {
            ...diagnosisResult,
            ticketId,
            customerName: input.customerName,
        };
    } catch (error) {
        console.error("Error getting diagnostics:", error);
        return null;
    }
}
