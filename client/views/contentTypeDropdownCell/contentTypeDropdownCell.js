dropdownSet = false;
Template['contentTypeDropdownCell'].helpers({
	dropdown_options : function() {
		var networkType = contentBucketHandler.getValueForDraftVariable('network',this.draft_item_id, this.content_bucket_id);
		var bucket = this;
		var types = contentTypeBuilder.getContentTypes(networkType);
		return _.map(types, function(type){
			type['bucket'] = bucket;
			return type;
		});
	},
	initializeDropdown : function() {
		
		var contentType = contentBucketHandler.getValueForDraftVariable('content_type', this.bucket.draft_item_id, this.bucket.content_bucket_id);
		var selector = '.content-type-dropdown-cell.' + this.bucket.content_bucket_id;
		Meteor.defer(function(){
			if(contentType != null) {
				$(selector).dropdown('set selected', contentType);
			} else {
				$(selector).dropdown('restore default text');
			}
		});
	},
	style_class : function() {
		return this.params.style_class;
	},
});

Template['contentTypeDropdownCell'].events({
	'click .content-type-item' : function(event) {
		var context = UI.getData($(event.currentTarget).parent().parent()[0]);
		var value = $(event.currentTarget).attr('data-value');
		var selector = '.content-type-dropdown-cell.' + context.content_bucket_id;
		contentBucketHandler.setDraftVariableToUpdate(value, context.variable_id, context.content_bucket_id);
		$(selector).dropdown('hide').dropdown('set text', $(event.currentTarget).text());		
	},
});


