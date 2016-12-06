# LostAndFoundServer

##Directions

1. git clone https://github.com/javeria2/LostAndFound {Local Folder Name}
2. cd {Local Folder Name}
3. npm install

##Items Schema
```javascript
{
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    locationLat: Number,
    locationLon: Number,
    postDate: { type: Date, default: Date.now },
    date: Date,
    img: { data: Buffer, contentType: String },
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String,
		img: String
	}
}
```

##Users Schema
```javascript
{
	username: String,
	password: String,
	about: String,
	img: String,
	followers: [{id: String}],
	following: [{id: String}]
}
```

##Comments Schema
```javascript
{
    message: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    item:   {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        img: String
    }
}
```

###Lets get this done bois