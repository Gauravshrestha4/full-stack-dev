var express=require('express'),
	app=express(),
	bodyParser=require('body-parser'),
	mongoose=require('mongoose'),
	passport=require('passport');
	LocalStrategy=require('passport-local');
	Campground=require('./models/campground')
	seedDb=require('./seed'),
	Comment=require('./models/comments'),
	User=require('./models/user'),
	flash=require('connect-flash'),
	methodOverride=require('method-override');

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(express.static(__dirname+'/public'));
app.set("view engine","ejs");
app.get('/',function(req,res){
	res.render('landing');
});

//passport config
app.use(require('express-session')({
	secret:'no one can do it better',
	resave:false,
	saveUninitialised:false
}));

app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDb();
/*campground.create({
	name:"manali",
	url:"https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"
},function(err,campground)
{
	if(err){console.log(err);}
	else{
		console.log("campground added");
		console.log(campground);
	}
});
*/
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');
	next();
});
app.get('/campgrounds',function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err)console.log(err);
		else{
			res.render('campground/index',{campgrounds:allcampgrounds})
		}
	});
	
});

app.post('/campgrounds',isLoggedIn,function(req,res){
	var name=req.body.name;
	var url=req.body.image;
	var desc=req.body.description;
	var author={id:req.user._id,username:req.user.username};
	var newCamp={name:name,url:url,description:desc,author:author};
	Campground.create(newCamp,function(err,newCampGround){
		if(err) console.log(err);
		else{
			console.log(newCampGround);
		}
	})
	res.redirect('/campgrounds');
});

app.get('/campgrounds/new',isLoggedIn,function(req,res){
	res.render('campground/new');
});

app.get('/campgrounds/:id',function(req,res){
	Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
		if(err) console.log(err)
		else{
			res.render("campground/show",{campground:foundCampground});
		}
	});
	
});
app.get('/campgrounds/:id/edit',checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground)
	{
		res.render('campground/edit',{campground:foundCampground});
	});
		
});

app.put('/campgrounds/:id',function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		}
		else{
			console.log(updatedCampground);
			res.redirect('/campgrounds/'+req.params.id);
		}
	})
});

app.delete('/campgrounds/:id',checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)res.redirect('/campgrounds');
		else res.redirect('/campgrounds');
	});
});
//comments routes
app.get('/campgrounds/:id/comment/new',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)console.log(err);
		else{
			res.render('comments/new',{campground:foundCampground});
		}
	});
	
})

app.post('/campgrounds/:id/comment',isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)console.log(err);
		else{
			console.log(campground);
			Comment.create(req.body.comment,function(err,comment){
				if(err)console.log(err);
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id);
				}

			});
		}
	});
});

app.get('/campgrounds/:id/comment/:commentid/edit',checkCommentOwnership,function(req,res){
	var campground_id=req.params.id;
	Comment.findById(req.params.commentid,function(err,foundComment){
		if(err)
		{
			res.redirect("back");
		}
		else{
			res.render('comments/edit',{campground_id:campground_id,comment:foundComment});
		}
	});
	
});

app.put('/campgrounds/:id/comment/:commentid',checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.commentid,req.body.comment,function(err,comment){
		if(err) 
			{
				res.redirect("back");
			}
		else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
	
});

app.delete('/campgrounds/:id/comment/:commentid',checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.commentid,function(err){
		if(err) 
			{
				res.redirect("back");
			}
		else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
})
// auth routes
app.get('/register',function(req,res){
	res.render('register');
});

app.post('/register',function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err) 
		{ 
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req,res,function(){
			res.redirect('/campgrounds');
		});
	
	});
});

app.get('/login',function(req,res){
	res.render('login');
});

app.post('/login',passport.authenticate("local",
{
	successRedirect:'/campgrounds',
	failureRedirect:'/login'
}),function(req,res){

});

app.get('/logout',function(req,res){
	req.logout();
	req.flash('success','you are logged out');
	res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash('error','please login First!!');
		res.redirect('/login')
	}
}
function checkCampgroundOwnership(req,res,next)
{
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			if(req.user._id.equals(foundCampground.author.id))
			{
				next();
			}
			else
			{
				res.redirect("back");
			}
		}
		});
		
	}
	else{
		res.redirect("back");
	}
}
function checkCommentOwnership(req,res,next)
{
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentid,function(err,foundComment){
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			if(req.user._id.equals(foundComment.author.id))
			{
				next();
			}
			else
			{
				res.redirect("back");
			}
		}
		});
		
	}
	else{
		res.redirect("back");
	}
}
app.listen(8000,function(){
console.log("server started");
});