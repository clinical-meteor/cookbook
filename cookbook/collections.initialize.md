## Defining a Collection 



````js
Posts = new Mongo.Collection("posts");

var schemas = new SimpleSchema({
    title: {
        type: String,
        label: "Title",
    },
    content: {
        type: String,
        label: "Content",
    },
    imageId: {
        type: String,
        label: "Image",
        optional: true,
    },
    /* AUTOVALUE */
    appId: {
        type: String,
        label: "App Id",
        autoValue: function() {
            if (this.isInsert)
                return App.id;
        },
    },
    createdDate: {
        type: Date,
        label: "Created Date",
        autoValue: function() {
            if (this.isInsert)
                return new Date;
        },
        denyUpdate: true,
        optional: true
    },
    updatedDate: {
        type: Date,
        label: "Updated Date",
        autoValue: function() {
            if (this.isUpdate || this.isInsert)
                return new Date();
        },
        optional: true
    },
    createdUserId: {
        type: String,
        label: "Created by",
        autoValue: function() {
            if (this.isInsert)
                return this.userId;
        },
        denyUpdate: true,
        optional: true
    },
    updatedUserId: {
        type: String,
        label: "Updated by",
        autoValue: function() {
            if (this.isUpdate || this.isInsert)
                return this.userId;
        },
        optional: true
    },
});

Posts.attachSchema(schemas);

Posts.allow({
    insert: function(userId, doc) {
        return userId ? true : false;
    },
    update: function(userId, doc) {
        return doc && doc.createdUserId === userId;
    },
    remove: function(userId, doc) {
        return doc && doc.createdUserId === userId;
    },
});

//activate groundDB for posts collection to work offline
GroundDB(Posts);

/* register helper for default relations */
UI.registerHelper('post', function() {
    return Posts.findOne(this.postId);
});
````
