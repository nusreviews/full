export class User {
    id: number;
    fid: number;
    username: string;
    email: string;

    constructor(
        userId,
        fbId,
        displayName,
        email,
    ) {
        this.id = userId;
        this.fid = fbId;
        this.username = displayName;
        this.email = email;
    }

    public static deserialiseJson(jsonObject: JSON) {
        let review = new User(
            jsonObject['userId'],
            jsonObject['fid'],
            jsonObject['displayName'],
            jsonObject['email'],
        ) 
        return review;
    }
}