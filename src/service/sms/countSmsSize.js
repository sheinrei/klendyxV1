

export function countSmsSize(title, content){

    const countTitle = title.length;
    const countContent = content.length;
    const totalCount = countContent+countTitle

    if(!totalCount < 160){
        return {success : false, count : totalCount, message: "Trop de caractère pour l'envois de ce message"};
    }
    return {success : true, count : totalCount, message: "Message pas trop volumineux"};

}

