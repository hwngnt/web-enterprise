const idea = require('../models/ideas');
const comment = require('../models/comments');
const staff = require('../models/staff');
const fs = require("fs");

// ================================================================== //
// ================================================================= //
// ======================== QAC Controller ========================== //

exports.getQAC = async (req, res) => {
    res.render('qac/index', { loginName: req.session.email })
}

// ======================== View Lastest Comments ========================== //
exports.viewLastestComment = async (req, res) => {
    try {
        let listComments = await comment.find();
        let len_comments = listComments.length;
        let last_comments = [];
        if (len_comments == 0) {
            last_comments = [];
        }
        else if (len_comments < 5) {
            last_comments = listComments.reverse();
        }
        else {
            last_comments = listComments.slice(-5, len_comments).reverse();
        }

        console.log(last_comments.length);
        let lastComments_detail = [];
        for (let comment of last_comments) {
            let objIdea = await idea.findOne({_id: comment.ideaID});
            let objAuthor = await staff.findOne({_id: comment.author});
            if(objIdea === null || objAuthor===null) {
                if(objIdea === null)
                console.log('Idea lost: ', comment.ideaID);
                else if(objAuthor===null)
                console.log('Author lost: ', comment.author);
                continue;
            }
            fs.readdir(objIdea.url, (err, files) => {
                lastComments_detail.push({
                    idea: objIdea,
                    value: files,
                    linkValue: objIdea.url.slice(7),
                    name: objIdea.name,
                    comment_len: objIdea.comments.length,
                    comment_content: comment.comment,
                    n_likes: objIdea.like,
                    n_dislikes: objIdea.dislike,
                    author: objAuthor,
                    time: comment.time.toString().slice(0, -25)
                })
            });
        }
        res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email });
    }
    catch (err) {
        console.log(err);
        // res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email });
    }
}

// ======================== Filter Lastest Comments ========================== //
exports.filterLastestComment = async (req, res) => {
    let n_last = Number(req.body.last);
    let listComments = await comment.find()
    let len_comments = listComments.length;
    let last_comments = [];
    if (len_comments < n_last) {
        n_last = len_comments;
    }
    if (len_comments == 0) {
        last_comments = [];
    }
    else if (len_comments < 5) {
        last_comments = listComments.reverse();
    }
    else {
        last_comments = listComments.slice(-n_last, len_comments).reverse();
    }
    console.log(last_comments.length);
    let lastComments_detail = [];
    for (let comment of last_comments) {
        let objIdea = await idea.findOne({ _id: comment.ideaID });
        let objAuthor = await staff.findOne({ _id: comment.author });
        if(objIdea === null || objAuthor === null) {
            console.log(comment.ideaID);
            continue;
        }
        fs.readdir(objIdea.url, (err, files) => {
            lastComments_detail.push({
                idea: objIdea,
                value: files,
                linkValue: objIdea.url.slice(7),
                name: objIdea.name,
                comment_len: objIdea.comments.length,
                comment_content: comment.comment,
                n_likes: objIdea.like,
                n_dislikes: objIdea.dislike,
                author: objAuthor,
                time: comment.time.toString().slice(0, -25)
            })
        });
    }
    res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email })
}

// ======================== Most View Ideas ========================== //
exports.mostViewIdeas = async (req, res) => {
    let listIdeas = await idea.find().populate({ path: 'comments', populate: { path: 'author' } }).populate('author');
    let n_ideas = listIdeas.length;
    let default_ideas = 5;
    if (n_ideas < default_ideas) default_ideas = n_ideas;
    // check if idea was added
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    // count total 'view = like+dis_like+comment'
    let countViews = [];
    for (let idea of listIdeas) {
        countViews.push(idea.like + idea.dislike + idea.comments.length);
    }
    // Find 5 most viewed ideas or <= 5 ideas
    let topViews = [];
    let i = 0;
    while (i < default_ideas) {
        let fake_max = -1;
        let idx_max = -1;
        let j = 0;
        while (j < n_ideas) {
            if (visited_max[j] == 0 && countViews[j] >= fake_max) {
                fake_max = countViews[j];
                idx_max = j;
            }
            j++;
        }
        visited_max[idx_max] = 1;
        topViews.push(listIdeas[idx_max]);
        i++;
    }
    //
    let mostViewedIdeas = [];
    for (let i of topViews) {
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time.toString().slice(0, -25)
            });
        });
    };
    try{
        res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
    }
    catch (e){
        console.log(e);
        res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
    }
    return mostViewedIdeas;
}

// ======================== Filter View Ideas ========================== //
exports.filterMostViewIdeas = async function (req, res) {
    let listIdeas = await idea.find().populate('comments');
    let n_ideas = listIdeas.length;
    let n_last = Number(req.body.last);
    let n_times = n_last;
    if (n_last > n_ideas) {
        n_times = n_ideas;
    }
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    let countViews = [];
    for (let idea of listIdeas) {
        countViews.push(idea.like + idea.dislike + idea.comments.length);
    }
    let topViews = [];
    let i = 0;
    while (i < n_times) {
        let fake_max = -1;
        let idx_max = -1;
        let j = 0;
        while (j < n_ideas) {
            if (visited_max[j] == 0 && countViews[j] >= fake_max) {
                fake_max = countViews[j];
                idx_max = j;
            }
            j++;
        }
        visited_max[idx_max] = 1;
        topViews.push(listIdeas[idx_max]);
        i++;
    }

    let mostViewedIdeas = [];
    await topViews.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time.toString().slice(0, -25)
            });
        });
    });
    res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}

// ======================== Most Comments in Idea ========================== //
exports.viewMostComments = async (req, res) => {
    let listIdeas = await idea.find().populate('comments');
    let n_ideas = listIdeas.length;
    let default_ideas = 5;
    if (n_ideas < default_ideas) default_ideas = n_ideas;
    // check if idea was added
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    // count total 'view = like+dis_like+comment'
    let countViews = [];
    for (let idea of listIdeas) {
        countViews.push(idea.comments.length);
    }
    let topViews = [];
    let i = 0;
    while (i < default_ideas) {
        let fake_max = -1;
        let idx_max = -1;
        let j = 0;
        while (j < n_ideas) {
            if (visited_max[j] == 0 && countViews[j] >= fake_max) {
                fake_max = countViews[j];
                idx_max = j;
            }
            j++;
        }
        visited_max[idx_max] = 1;
        topViews.push(listIdeas[idx_max]);
        i++;
    }
    console.log(topViews);
    let mostViewedIdeas = [];
    let counter = 0;
    for (let j = 0; j < topViews.length; j++) {
        let i = topViews[j];
        // let authors_name = [];
        // let comments_contents = [];
        // let time_comments = [];
        // for (let commentID of i.comments) {
        //     let objComment = await comment.findOne(commentID);
        //     time_comments.push(objComment.time.toString().slice(0, -25));
        //     comments_contents.push(objComment.comment);
        //     let objAuthor = await staff.findOne(objComment.author);
        //     authors_name.push(objAuthor.name);
        // }
        // console.log(comments_contents);
        // console.log("----");
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                // comment_content: comments_contents,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                // authors: authors_name,
                time: i.time.toString().slice(0, -25),
                // time_comment: time_comments
            });
        });

    };
    res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}

exports.filterMostComments = async function (req, res) {
    let listIdeas = await idea.find().populate('comments');
    let n_ideas = listIdeas.length;
    let n_last = Number(req.body.last);
    let n_times = n_last;
    if (n_last > n_ideas) {
        n_times = n_ideas;
    }
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    let countViews = [];
    for (let idea of listIdeas) {
        countViews.push(idea.comments.length);
    }
    let topViews = [];
    let i = 0;
    while (i < n_times) {
        let fake_max = -1;
        let idx_max = -1;
        let j = 0;
        while (j < n_ideas) {
            if (visited_max[j] == 0 && countViews[j] >= fake_max) {
                fake_max = countViews[j];
                idx_max = j;
            }
            j++;
        }
        visited_max[idx_max] = 1;
        topViews.push(listIdeas[idx_max]);
        i++;
    }

    let mostViewedIdeas = [];
    await topViews.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time.toString().slice(0, -25)
            });
        });
    });
    res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}

exports.viewLastestIdeas = async (req, res) => {
    let listIdeas = await idea.find().populate('comments');
    let len_ideas = listIdeas.length;
    let last_ideas = [];
    if (len_ideas == 0) {
        last_ideas = [];
    }
    else if (len_ideas < 5) {
        last_ideas = listIdeas.reverse();
    }
    else {
        last_ideas = listIdeas.slice(-5, len_ideas).reverse();
    }
    let lastestIdeas = [];
    await last_ideas.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            lastestIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comment,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time.toString().slice(0, -25)
            });
        });
    });
    res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
}

exports.filterLastestIdeas = async (req, res) => {
    let n_last = Number(req.body.last);
    let listIdeas = await idea.find().populate('comments');
    let len_ideas = listIdeas.length;
    if (len_ideas < n_last) {
        n_last = len_ideas;
    }
    let last_ideas = [];
    if (len_ideas == 0) {
        last_ideas = [];
    }
    else if (len_ideas < 5) {
        last_ideas = listIdeas.reverse();
    }
    else {
        last_ideas = listIdeas.slice(-n_last, len_ideas).reverse();
    }
    let lastestIdeas = [];
    await last_ideas.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            lastestIdeas.push({
                idea: i,
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comment,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time.toString().slice(0, -25)
            });
        });
    });
    res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
}
