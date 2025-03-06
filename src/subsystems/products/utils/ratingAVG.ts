export function ratingAVG(ratings: any[]){
    if(!ratings || ratings.length === 0) return undefined;

    if (ratings.length === 1) return ratings[0].rate;

    let rating = 0;

    for (const rating1 of ratings) {
        rating = rating1.rate;
    }

    return rating / ratings.length;
}