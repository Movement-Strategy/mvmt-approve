Template['contentCalendar'].helpers({
	is_in_house : function() {
		return clientHandler.selectedClientIsInHouse();
	},
	calendar_days : function() {
		// maps a status to the color that's going to be displayed
		return calendarBuilder.getCalendarDays();
	},
	details_shown : function() {
		return detailsHandler.detailsShown();
	},
	is_not_client : function() {
		return !userHandler.userIsType('client');
	},
	is_not_art_director : function() {
		return !userHandler.userIsType('art_director');	
	},
	can_see_private_row : function() {
		return userHandler.userIsType('social_media_manager') || userHandler.userIsType('art_director');
	},
	show_class : function() {
		return detailsHandler.detailsShown() ? 'hidden' : '';
	},
	initializeDroppables : function() {
		Meteor.defer(function(){
			$('.forward.arrow.column').droppable({
				over : function() {
					calendarBuilder.onDragOverArrowColumn(event, 'forward');
					calendarBuilder.intervalHandler = Meteor.setInterval(function(){
						calendarBuilder.onDragOverArrowColumn(event, 'forward');
					}, 750);
				},
				out : function() {
					calendarBuilder.stopChangingDates();
				}
			});
			$('.back.arrow.column').droppable({
				over : function() {
					calendarBuilder.onDragOverArrowColumn(event, 'back');
					calendarBuilder.intervalHandler = Meteor.setInterval(function(){
						calendarBuilder.onDragOverArrowColumn(event, 'back');
					}, 750);
				},
				out : function() {
					calendarBuilder.stopChangingDates();
				}
			});	
		});
	},
});

Template['contentCalendar'].events({
	'click .right.arrow' : function(event) {
		timeHandler.changeToNextWeek();
	},
	'click .left.arrow' : function(event) {
		timeHandler.changeToLastWeek();
	},	
});

