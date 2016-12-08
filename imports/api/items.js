import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Items = new Mongo.Collection('items');

if (Meteor.isServer) {
    Meteor.publish('items', function(){
        return Items.find();
    });
}

Meteor.methods({
    'updateBought'(id) {
        Items.update(id, {
            $addToSet: {bought: {user_id: Meteor.user()._id, timestamp: new Date()}},
            $set: {'missing': false},
        });
    },
})
