Template['mainNav'].helpers({
	show_dropdown : function() {
		return clientHandler.clientDropdownShouldBeShown();
	},
	user_picture : function() {
		return userHandler.getPicture();
	},
	signed_in : function() {
		return userHandler.userSignedIn();
	},
	initializeDropdown : function() {
		userHandler.initializeUserDropdown();
	},
	show_notification_button : function() {
		return Session.get('show_notification_button');
	},
});

Template['mainNav'].events({
	'click .sign-out' : function() {
		userHandler.signUserOut();
	},
	'click .main-title' : function() {
		if(Session.get('details_shown')) {
			detailsHandler.hideDetails();
		}
	},
});

