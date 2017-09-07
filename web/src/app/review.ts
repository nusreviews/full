export class Review {
    id: number;
    moduleId: string;
    userId: number;
    author: string;
    comments: string;
    dateCreated: Date;
    dateLastEdited: Date;
    teachingTeamRating: number; 
    enjoyabilityRating: number;
    workloadRating: number;
    difficultyRating: number;
    isRecommend: boolean;
    numLikes: number;
    hasUserLiked: boolean;
    
    constructor(
        id: number,
        moduleId: string,
        userId: number,
        author: string,
        comments: string,
        dateCreated: Date,
        dateLastEdited: Date,
        teachingTeamRating: number,
        enjoyabilityRating: number,
        workloadRating: number,
        difficultyRating: number,
        isRecommend: boolean,
        numLikes: number,
        hasUserLiked: boolean,
    ) {
        this.id = id;
        this.moduleId = moduleId;
        this.userId = userId;
        this.author = author;
        this.comments = comments;
        this.dateCreated = dateCreated;
        this.dateLastEdited = dateLastEdited;
        this.teachingTeamRating = teachingTeamRating;
        this.enjoyabilityRating = enjoyabilityRating;
        this.workloadRating = workloadRating;
        this.difficultyRating = difficultyRating;
        this.isRecommend = isRecommend;
        this.numLikes = numLikes;
        this.hasUserLiked = hasUserLiked;
    }

    public static deserialiseJson(jsonObject: JSON) {
        let review = new Review(
            jsonObject['reviewId'],
            jsonObject['modId'],
            jsonObject['reviewBy'],
            jsonObject['reviewer'],
            jsonObject['comments'],
            jsonObject['createdAt'],
            jsonObject['updatedAt'],
            jsonObject['teaching'],
            jsonObject['enjoyability'],
            jsonObject['workload'],
            jsonObject['difficulty'],
            jsonObject['recommend'],
            jsonObject['totalLikes'],
            jsonObject['hasUserLike']
        ) 
        return review;
    }
}
    
    