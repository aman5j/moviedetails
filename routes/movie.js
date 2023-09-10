var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');
var fs = require("fs");

router.get("/movie_interface", function(req,res){
    try{
        var admin = localStorage.getItem("ADMIN")
        if(admin==null)
        { res.render("loginpage",{message:''})}
        else 
        {
        res.render("movieinterface", { message : ''})
        }
    }
    catch(e)
    {
        res.render("loginpage",{message:''})
    }
    
})

router.post('/movie_submit',upload.single('poster'), function(req,res,next){
    try{
        console.log("DATA:",req.body);
        console.log("FILE:",req.file);
        pool.query("insert into movies (stateid, cityid, cinemaid, screenid, moviename, description, status, poster) values(?,?,?,?,?,?,?,?) ",[req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status, req.file.filename], function(error,result){
            if(error)
            {
                console.log("D Error",error);
                res.render("movieinterface",{ message : 'Database Error'})
            }
            else 
            {
                res.render("movieinterface", { message : 'Movie Submitted Successfully '});
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e);
        res.render("movieinterface", { message : 'Server Error'});
    }
});

router.get("/fetch_all_states", function(req,res,next){
    try{
        pool.query("select * from states", function(error, result){
            if(error)
            {   console.log("D Error:",e);
                res.status(200).json([])
            }
            else 
            {
                res.status(200).json({result:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e);
        res.render("movieinterface",{ message : 'Server Error'});
    }
});

router.get("/fetch_all_cities", function(req,res,next){
    try{
        pool.query("select * from cities where stateid=?",[req.query.stateid], function(error, result){
            if(error)
            {   console.log("D Error:",e);
                res.status(200).json([])
            }
            else 
            {
                res.status(200).json({result:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e);
        res.render("movieinterface",{ message : 'Server Error'});
    }
});

router.get("/fetch_all_cinemas", function(req,res,next){
    try{
        pool.query("select * from cinema",function(error, result){
            if(error)
            {
                console.log("D Error:",error);
                res.status(200).json([]);
            }
            else 
            {
                res.status(200).json({result:result});
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e);
        res.render("movieinterface",{ message : 'Server Error'});
    }
});

router.get("/fetch_all_screens", function(req,res,next){
    try{
        console.log("screens data:",req.query);
        pool.query("select * from screen where cinemaid=?",[req.query.cinemaid],function(error,result){
            if(error)
            {
                console.log("D Error:",error);
                res.status(200).json([]);
            }
            else 
            {
                res.status(200).json({result:result});
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e);
        res.render("movieinterface",{ message : 'Server Error'});
    }
})

router.get("/fetch_all_movies", function(req,res,next){
    try{
        var admin=localStorage.getItem("ADMIN")
        if(admin==null)
        { res.render("loginpage",{message:''})}
        pool.query("select M.*,(select S.statename from states S where S.stateid=M.stateid) as state,(select C.cityname from cities C where C.cityid=M.cityid) as city,(select CM.cinemaname from cinema CM where CM.cinemaid=M.cinemaid) as cinemaname,(select SN.screenname from screen SN where SN.screenid=M.screenid) as screenname from movies M",function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.render("displayallmovies",{ message : 'Database Error', data:[]})
            }
            else 
            {
                res.render("displayallmovies",{ message : 'Success', data:result})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.render("loginpage",{ message : ''})
    }
})

router.get("/displayforedit", function(req,res,next){
    try{
        console.log("Request:",req.query)
        pool.query("select M.*,(select S.statename from states S where S.stateid=M.stateid) as state,(select C.cityname from cities C where C.cityid=M.cityid) as city,(select CM.cinemaname from cinema CM where CM.cinemaid=M.cinemaid) as cinemaname,(select SN.screenname from screen SN where SN.screenid=M.screenid) as screenname from movies M where M.movieid=?",[req.query.movieid],function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.render("displayforedit",{ message : 'Database Error', data:[]})
            }
            else 
            {
                res.render("displayforedit",{ message : 'Success', data:result[0]})
            }
        })
    }
    catch(e)
    {
        console.log("Error",e)
        res.render("displayforedit",{ message : 'Server Error', data:[]})
    }
})

router.post("/edit_movie", function(req, res){
    try{
       if(req.body.btn=="Edit")
       {
        pool.query("update movies set stateid=?, cityid=?, cinemaid=?, screenid=?, moviename=?, status=?, description=? where movieid=?",[req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.status, req.body.description, req.body.movieid], function(error, result){
            if(error)
            {
                console.log("D Error:",error)
                res.redirect("/movie/fetch_all_movies")
            }
            else
            {
                res.redirect("/movie/fetch_all_movies")
            }
        })
    }
    else 
    {
        pool.query("delete from movies where movieid=?",[req.body.movieid], function(error, result){
            if(error)
            {
                console.log("D Error:",error)
                res.redirect("/movie/fetch_all_movies")
            }
            else
            {
                res.redirect("/movie/fetch_all_movies")
            }
        })
    }
    }
    catch(e)
    {
        console.log("Error:",e)
        res.redirect("/movie/fetch_all_movies")
    }
});

router.get("/displayposterforedit", function(req,res){
    res.render("displayposterforedit",{data:req.query})
})

router.post("/edit_poster",upload.single('poster'),function(req,res){
    try{
        pool.query("update movies set poster=? where movieid=?",[req.file.filename, req.body.movieid],function(error,result){
            if(error)
            {
                console.log("D Error:",error)
                res.redirect("/movie/fetch_all_movies")
            }
            else 
            {
                fs.unlinkSync(`D:/Mern/moviedetails/public/images/${req.body.oldfilename}`)
                res.redirect("/movie/fetch_all_movies")
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.redirect("/movie/fetch_all_movies")
    }
})

module.exports = router;

