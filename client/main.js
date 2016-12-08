import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Items } from '/imports/api/items.js';

import './main.html';

Template.body.helpers({
    items: function() {
        return Items.find();
    }
});

Template.addItem.events({
  'click #add-item'(event, instance) {
    $('#item-input').show();
    $('#item-input').animate({'width': '100%'});
  },
  'submit #item-form'(event, instance) {
    event.preventDefault();

    let itemName = $('input[name="item-name"]').val();

    if (itemName) {
        Items.insert({
            itemName: toPascalCase(itemName),
            missing: false,
            bought: [],
        });
        $('#item-input').animate({'width': '0%'}, function() {
            $('#item-input').hide();
        });
    }
  }
});

Template.itemList.helpers({
    items: function() {
        return Items.find();
    }
});

Template.itemList.events({
    'click #removeFromList'(event, instance) {
        Items.remove(this._id);
    },
    'click #markMissing'(event, instance) {
        Items.update(this._id, {
            $set: {'missing': true},
        });
    },
});

Template.missingItem.helpers({

});

Template.missingItemList.helpers({
    user: function() {
        return Meteor.user();
    },
    missingItems: function() {
        return Items.find({'missing': true});
    },
});

Template.missingItemList.events({
    'click #markBought'(event, instance) {
        Meteor.call('updateBought', this._id);
    },
});

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var usernameVar = event.target.loginUsername.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(usernameVar, passwordVar);
    }
});

function toPascalCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}