const idea = require('../models/ideas');
const comment = require('../models/comments');
const staff = require('../models/staff');
const fs = require("fs");

exports.getQAC = async (req, res) => {
    res.render('qac/index', { loginName: req.session.email })
}

// Done
exports.viewLastestComment = async (req, res) => {
    let listComments = await comment.find()
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
    let lastComments_detail = [];
    for (let comment of last_comments) {
        // console.log(comment.ideaID);
        let objIdea = await idea.findOne(comment.ideadID);
        // console.log(objIdea);
        let objAuthor = await staff.findOne(comment.author);
        fs.readdir(objIdea.url, (err, files) => {
            lastComments_detail.push({
                value: files,
                linkValue: objIdea.url.slice(7),
                name: objIdea.name,
                comment_len: objIdea.comments.length,
                comment_content: comment.comment,
                n_likes: objIdea.like,
                n_dislikes: objIdea.dislike,
                author: objAuthor.name,
                time: comment.time.toString().slice(0, -25)
            })
        });
    }
    res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email })
}

// Done
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
    let lastComments_detail = [];
    for (let comment of last_comments) {
        // console.log(comment.ideaID);
        let objIdea = await idea.findOne(comment.ideadID);
        // console.log(objIdea);
        let objAuthor = await staff.findOne(comment.author);
        fs.readdir(objIdea.url, (err, files) => {
            lastComments_detail.push({
                value: files,
                linkValue: objIdea.url.slice(7),
                name: objIdea.name,
                comment_len: objIdea.comments.length,
                comment_content: comment.comment,
                n_likes: objIdea.like,
                n_dislikes: objIdea.dislike,
                author: objAuthor.name,
                time: comment.time.toString().slice(0, -25)
            })
        });
    }
    res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email })
}


exports.mostViewIdeas = async (req, res) => {
    let listIdeas = await idea.find().populate('comments');
    let n_ideas = listIdeas.length;
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
    let top5Views = [];
    let i = 0;
    while (i < 5) {
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
        top5Views.push(listIdeas[idx_max]);
        i++;
    }
    let mostViewedIdeas = [];
    let counter = 0;
    for(let i of top5Views) {
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
        counter = counter + 1;
    };
    console.log(mostViewedIdeas.length);
    res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}


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

