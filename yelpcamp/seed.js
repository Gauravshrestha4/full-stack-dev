var mongoose=require('mongoose'),
	Campground=require('./models/campground'),
	Comment=require('./models/comments');

data=[
	{
		name:'Shimla',
		url:'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
		description:'this is a cool place.this is a cool place.this is a cool place.this is a cool place.this is a cool place.'
	},
	{
		name:'manali',
		url:'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
		description:'this is a cool place.this is a cool place.this is a cool place.this is a cool place.this is a cool place.'
	},
	{
		name:'dharamshala',
		url:'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
		description:'this is a cool place.this is a cool place.this is a cool place.this is a cool place.this is a cool place.'
	},
	{
		name:'goa',
		url:'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
		description:'this is a cool place.this is a cool place.this is a cool place.this is a cool place.this is a cool place.'
	}
]
function seedDb(){
	Campground.remove({},function(err){
		/*if(err) console.log(err);
		else{
			console.log('removed all');
		}
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
				if(err)console.log(err);
					else
					{
						console.log('camp is added');
						Comment.create(
						{
							text:'this looks cool',
							author:'gaurav'
						},function(err,comment)
						{
							if(err)console.log(err);
							else{
								
								campground.comments.push(comment);
								campground.save();
								console.log('created new comment');
							}
						});
					}
			});
		});*/
	});
}

module.exports=seedDb;