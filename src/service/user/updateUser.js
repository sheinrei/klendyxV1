import user from "../../models/utilisateurTable.js"

export async function updateUserData(db, id, data) {
    const User = user(db);

    const updated = await User.update(data, { where: { id } })
    
    if (!updated)
        return { success: false, message: "Une erreur est survenue, veuillez rééssayer plus tard ou contacter notre support" }

    return { success: true, message: "Vos données ont été mises à jours avec succès" }
}
