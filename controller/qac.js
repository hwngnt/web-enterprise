const idea = require('../models/ideas');
const comment = require('../models/comments');
const staff = require('../models/staff');
const fs = require("fs");

exports.getQAC = async (req, res) => {
    res.render('qac/index', { loginName: req.session.email })
}

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
    for(let comment of last_comments){
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
    let listIdeas = await idea.find();
    let n_ideas = listIdeas.length;
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    let countViews = [];
    // console.log(listIdeas);
    for (let idea of listIdeas) {
        countViews.push(idea.like + idea.dislike + idea.comments.length);
    }
    // console.log(countViews);
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
    // console.log(top5Views);
    let mostViewedIdeas = [];
    await top5Views.forEach(async (i) => {
        console.log(i);
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time
            });
        });
    });
    res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}

exports.viewLastestIdeas = async (req, res) => {
    let listIdeas = await idea.find();
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
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comment,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time
            });
        });
    });
    res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
}

