import { creditTable } from "../../models/creditTable.js";

export async function getCredit(db, userId) {
    const Credit = creditTable(db);

    const data = await Credit.findOne({ where: { userId: userId } })

    return data
}