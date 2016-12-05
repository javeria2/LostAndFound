# LostAndFoundServer

##Directions

1. git clone git@github.com:arahoomam/LostAndFoundServer {Local Folder Name}
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
    img: { data: Buffer, contentType: String }
}
```

##Users Schema
```javascript
{
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    items: [String]
}
```

###Lets get this done bois