draftItemHandler = {
	autoRunHandler : null,
	handleDraftItems : function() {
		if(this.autoRunHandler != null) {
			this.autoRunHandler.stop();
		}
		this.autoRunHandler = Tracker.autorun(function(){
			draftItemHandler.initializeDraftItems();
		});	
	},
	goToDraftWeek : function(clientID, weekID) {
		Router.go('/client/' + clientID + '/week/' + weekID + '/draft');	
	},
	initializeVariableDropdown : function(context) {
		var selector = '.' + context.params.style_class + '.' + context.content_bucket_id;
		var draftValue = contentBucketHandler.getValueForDraftVariable(context.variable_id, context.draft_item_id, context.content_bucket_id);
		Meteor.defer(function(){
			if(draftValue != null) {
				$(selector).dropdown('set selected', draftValue).dropdown('setting', {onChange : function(value, text){
					contentBucketHandler.onDropdownChange(value, text, this);
				}});
			} else {
				$(selector).dropdown({onChange : function(value, text){
					contentBucketHandler.onDropdownChange(value, text, this);
				}});
			}
		});	
	},
	initializeDraftItems : function() {
		var query = this.getDraftItemQuery();
		var draftItems = DraftItem.find(query).fetch();
		var draftItemsByBucketID = {};
		_.map(draftItems, function(item){
			draftItemsByBucketID[item['content_bucket_id']] = item;
		});
		Session.set('draft_items_by_bucket_id', draftItemsByBucketID);
	},
	updateDraftItemForContentBucket : function(bucket, bucketID) {
		var draftItemID = contentBucketHandler.getDraftItemIDForContentBucket(bucketID);
		if(draftItemID == null) {
			draftItemHandler.insertDraftItem(bucket, draftItemID, bucketID);
		} else {
			draftItemHandler.updateDraftItem(bucket, draftItemID, bucketID);
		}
	},
	updateDraftItem : function(bucket, draftItemID, bucketID) {
		if(_.has(bucket, 'draft_variables')) {
			var variablesForBucket = bucket['draft_variables'];
			var query = this.convertIndexedArrayIntoUpdateQuery(variablesForBucket);
			Meteor.call('updateDraftItem', draftItemID, bucketID, query);
		}
	},
	convertIndexedArrayIntoUpdateQuery : function(array) {
		var query = {
			$set : {},
		};
		_.map(array, function(value, key){
			if(value == 'unset') {
				value = null;
			}
			var setKey = 'draft_variables.' + key;
			query['$set'][setKey] = value; 
		});
		return query;
	},
	insertDraftItem : function(bucket, draftItemID, bucketID) {
		var draftItem = {};
		draftVariables = _.has(bucket, 'draft_variables') ? bucket['draft_variables'] : {};
		draftVariables = draftItemHandler.handleUnsetOnCreate(draftVariables);
		draftItem['draft_variables'] = draftVariables;
		draftItem['content_bucket_id'] = bucketID;
		draftItem['week'] = timeHandler.timestampToDateString(timeHandler.getTimestampForCurrentDate()),
		draftItem['client_id'] = Session.get('selected_client_id');
		draftItem['created_by'] = Meteor.userId();
		Meteor.call('insertDraftItem', draftItem);
	},
	handleUnsetOnCreate : function(draftVariables) {
		var updatedVariables = {};
		_.map(draftVariables, function(value, key){
			if(value != 'unset') {
				updatedVariables[key] = value;
			}
		});
		return updatedVariables;	
	},
	getDraftItemQuery : function() {
		return {
			week : timeHandler.timestampToDateString(timeHandler.getTimestampForCurrentDate()),
			client_id : Session.get('selected_client_id'),
		};
	},
};