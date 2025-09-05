import { Order } from "./order.model";

export const createAutoSerial = async (): Promise<string> => {
    const last = await Order.findOne({}, { serial: 1 }).sort({ createdAt: -1 }).lean();
    let next = 1;

    if (last?.serial) {
        const parts = last.serial.split("-");
        const numStr = parts[1] || "";
        const parsed = parseInt(numStr, 10);
        if (!isNaN(parsed)) next = parsed + 1;
    }

    const padded = next.toString().padStart(4, "0");
    return `EL-${padded}`;
};