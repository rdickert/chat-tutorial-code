Messages = new Mongo.Collection("msgs");

Meteor.methods({
  sendMessage: function (message) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.insert({
      messageText: message,
      createdAt: new Date(),
      username: Meteor.user().username  // <-add real username
    });
  }
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("messages", function () {
    return Messages.find({}, {sort: {createdAt: -1}, limit: 5});
  });
}

/* scrolling code */

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("messages");

  Template.body.helpers({
    recentMessages: function () {
      return Messages.find({}, {sort: {createdAt: 1}});
    },
    /* unread message helper */
  });

  /*chat window scrolling*/

  Template.body.events({
    "submit .new-message": function (event) {
      var text = event.target.text.value;

      Meteor.call("sendMessage", text);

      event.target.text.value = "";
      event.preventDefault();
    },

    /* scroll event */

  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
