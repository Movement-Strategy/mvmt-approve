
statusColorMap = {
	approved : 'green',
	rejected : 'red',
	submitted : 'grey',
	commented : 'orange',
};

Template['calendarDay'].helpers({
	updateReactiveVariables : function() {
		commentHandler.setCommentsFromDayContext(this);
	},
	day : function() {
		return calendarBuilder.getDayFromContext(this);
	},
});

Template['calendarDay'].events({
	'click .create-item-button' : function(event) {
			var creatingNew = true;
			detailsHandler.showDetails(this, creatingNew);
	},
});

