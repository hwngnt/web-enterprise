const idea = require('../models/ideas');
const comment = require('../models/comments');
const staff = require('../models/staff');
const fs = require("fs");

// ================================================================== //
// ================================================================= //
// ======================== QAC Controller ========================== //

// DONE: 
// 1. Lastest comments (98%)
// 2. Most viewed ideas (98%)
// 3. Most comments (98%)
// 4. Lastest comments (98%) 

// ======================== View Lastest Comments ========================== //
exports.getQAC = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        res.render('qac/index', { loginName: req.session.email });
    }

}

// ======================== View Lastest Comments ========================== //
exports.viewLastestComment = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
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
            let lastComments_detail = [];
            let counter = 0;
            function callBack() {
                if (last_comments.length === counter) {
                    lastComments_detail.sort((a, b) => {
                        const A = new Date(a.time)
                        const B = new Date(b.time)
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
            for (let comment of last_comments) {
                let objIdea = await idea.findOne({_id: comment.ideaID});
                let objAuthor = await staff.findOne({_id: comment.author});
                if (objIdea === null || objAuthor === null) {
                    if (objIdea === null)
                        console.log('Idea lost: ', comment.ideaID);
                    else if (objAuthor === null)
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
                    });
                    counter += 1;
                    callBack(); 
                });
            }
            res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email });
        }
        catch (err) {
            console.log(err);
            res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email });
        }
    }
}

// ======================== Filter Lastest Comments ========================== //
exports.filterLastestComment = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
            let n_last = Number(req.body.last);
            let listComments = await comment.find();
            let len_comments = listComments.length;
            let last_comments = [];
            if (len_comments < n_last) n_last = len_comments;
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
            let counter = 0;
            function callBack() {
                if (last_comments.length === counter) {
                    lastComments_detail.sort((a, b) => {
                        const A = new Date(a.time)
                        const B = new Date(b.time)
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
            for (let comment of last_comments) {
                let objIdea = await idea.findOne({ _id: comment.ideaID });
                let objAuthor = await staff.findOne({ _id: comment.author });
                if (objIdea === null || objAuthor === null) {
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
                    });
                    counter += 1;
                    callBack(); 
                });
            }
            res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email })
        }
        catch (err) {
            console.log(err);
            res.render('qac/viewLastestComment', { lastComments_detail: lastComments_detail, loginName: req.session.email })
        }
    }
}

// ======================== Most View Ideas ========================== //
exports.mostViewIdeas = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
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
            // Find most viewed ideas by default
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
            // From topViews, get detail information
            let counter = 0;
            function callBack() {
                if (topViews.length === counter) {
                    mostViewedIdeas.sort((a, b) => {
                        let A = a.n_likes + a.n_dislikes + a.comment;
                        let B = b.n_likes + b.n_dislikes + b.comment;
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
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
                    counter += 1;
                    callBack();
                });
            };
            res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
        catch (e) {
            console.log(e);
            res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
    }
}

// ======================== Filter Most View Ideas ========================== //
exports.filterMostViewIdeas = async function (req, res) {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
            let listIdeas = await idea.find().populate({ path: 'comments', populate: { path: 'author' } }).populate('author');
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
            let counter = 0;
            function callBack() {
                if (topViews.length === counter) {
                    mostViewedIdeas.sort((a, b) => {
                        let A = a.n_likes + a.n_dislikes + a.comment;
                        let B = b.n_likes + b.n_dislikes + b.comment;
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
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
                    counter += 1;
                    callBack();
                });
            });
            res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
        catch (error) {
            console.log(error);
            res.render('qac/mostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
    }
}

// ======================== Most Comments in Idea ========================== //
exports.viewMostComments = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
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
            let mostViewedIdeas = [];
            let counter = 0;
            function callBack() {
                if (topViews.length === counter) {
                    mostViewedIdeas.sort((a, b) => {
                        let A = a.comment;
                        let B = b.comment;
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
            for (let j = 0; j < topViews.length; j++) {
                let i = topViews[j];
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
                        time: i.time.toString().slice(0, -25),
                    });
                    counter += 1;
                    callBack();
                });

            };
            res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        } catch (e) {
            console.error(e);
            res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
    }
}

// ======================== Filter Most Comments in Idea ========================== //
exports.filterMostComments = async function (req, res) {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
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
            let counter = 0;
            function callBack() {
                if (topViews.length === counter) {
                    mostViewedIdeas.sort((a, b) => {
                        let A = a.comment;
                        let B = b.comment;
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a._id < b._id) {
                                return -1;
                            }
                            if (a._id > b._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
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
                    counter += 1;
                    callBack();
                });
            });
            res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        } catch (e) {
            console.error(e);
            res.render('qac/mostComments', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
        }
    }
}

// ======================== View Lastest Ideas ========================== //
exports.viewLastestIdeas = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
            let listIdeas = await idea.find().populate({ path: 'comments', populate: { path: 'author' } }).populate('author');
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
            let counter = 0;
            function callBack() {
                if (last_ideas.length === counter) {
                    lastestIdeas.sort((a, b) => {
                        const A = new Date(a.idea.time)
                        const B = new Date(b.idea.time)
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
            last_ideas.forEach(async (i) => {
                fs.readdir(i.url, (err, files) => {
                    lastestIdeas.push({
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
                    counter += 1;
                    callBack(); 
                });

            });
            res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
        }
        catch (e) {
            console.log(e);
            res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
        }
    }
}

// ======================== Filter Lastest Ideas ========================== //
exports.filterLastestIdeas = async (req, res) => {
    if (req.session.email === undefined) {
        res.redirect('/');
    } else {
        try {
            let n_last = Number(req.body.last);
            let listIdeas = await idea.find().populate({ path: 'comments', populate: { path: 'author' } }).populate('author');
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
            let counter = 0;
            function callBack() {
                if (last_ideas.length === counter) {
                    lastestIdeas.sort((a, b) => {
                        const A = new Date(a.idea.time)
                        const B = new Date(b.idea.time)
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else {
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                }
            }
            await last_ideas.forEach(async (i) => {
                fs.readdir(i.url, (err, files) => {
                    lastestIdeas.push({
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
                    counter += 1;
                    callBack(); 
                });
            });
            res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
        }
        catch (err) {
            console.error(err);
            res.render('qac/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
        }
    }
}
