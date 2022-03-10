const idea = require('../models/ideas');

exports.getQAC = async (req, res) => {
    res.render('qac/index')
}

exports.mostPopularIdeas = async (req, res) => {
    res.render('qac/most_popular_ideas')
}

exports.mostViewIdeas = async (req, res) => {
    res.render('qac/most_view_ideas')
}

exports.viewLastestIdeas = async (req, res) => {
    let listIdeas = await idea.find();
    let len_ideas = listIdeas.length;
    let last_ideas = [];
    if(len_ideas == 0){
        last_ideas = [];
    }
    else if(len_ideas < 5){
        last_ideas = listIdeas.reverse();
    }
    else{
        last_ideas = listIdeas.slice(-5, len_ideas).reverse();
    }
    res.render('qac/viewLastestIdeas',{listIdeas: last_ideas});
}

