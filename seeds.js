const Mask = require("./models/mask")
const Comment = require("./models/comment")
const data = [
	{
		name:"surgical mask",
		image:"https://www.fda.gov/files/surgical-mask.jpg", 
		description:"Fluid resistant and provides the wearer protection against large droplets, splashes, or sprays of 	 bodily or other hazardous fluids. Protects the patient from the wearer’s respiratory emissions."
	},
	
	{
		name:"Cotton Face Mask",
		image:"https://cdn.shopify.com/s/files/1/0085/6850/4391/products/Facemask-Frontview-FadedDenimFlannel-SDH-021D-USA_Cotton_256x.jpg?v=1594913860", 
		description:"Reusable non-medical fitted face mask, designed to filter airborne particles"
	},
	
	{
		name:"N95 respirators",
	    image:"https://www.whitecap.com/globalassets/imports/entries/damhdsmarketingto_be_taxonomized1218511_hero_a2.jpg? v=1D5836FC52D8180&width=470", 
		description:"Reduces wearer’s exposure to particles including small particle aerosols and large droplets (only non-oil aerosols)."
	},
	
	{
		name:"Cute Kitty Faces",
	    image:"https://cdn.shopify.com/s/files/1/0078/9348/3601/products/cute-cat-face-reusable-cotton-masks-4_300x300.jpg?v=1594282228",
		description:"Designed particularly with children in mind, to encourage them to keep their little paws away from their noses and mouths, but also a great way for adults to spread some cheer and joy whilst out running those essential errands!"
	},
]

function seedDB(){
	Mask.deleteMany({}, function(err){
		if (err) return console.error(err);
		console.log('removed masks');
		data.forEach(function(seed){
			Mask.create(seed, function(err, mask){
				if (err) return console.error(err);
				Comment.create({author:'james',text:'really good mask, loved it!'}, function(err, comment){
					if (err) return console.error(err);
					mask.comments.push(comment);
					mask.save();
					console.log('created mask');
				})
			})
		})
		
	})
}

module.exports = seedDB;