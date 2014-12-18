contentBucketModalHandler = {
	modalSelector : '.content-bucket-modal',
	handleModal : function(params) {
		var that = this;
		Meteor.defer(function(){
			$(that.modalSelector).modal(params);
		});
	},
	isShown : false,
	showModal : function(context, creatingNew) {
		this.isShown = true;
		this.setSessionVariablesOnShow(context, creatingNew);
		this.handleModal('show');
	},
	hideModal : function() {
		this.isShown = false;
		this.handleModal('hide');
	},
	initializeRepeatsToggle : function() {
		var bucket = Session.get('current_content_bucket');
		
		if(bucket) {
			var isRepeating = bucket['repeats'];
			var onStart = isRepeating ? 'enable' : 'disable';
			Meteor.defer(function(){
				var onEnable = function() {
					Session.set('bucket_is_repeating', true);	
				};
				var onDisable = function() {
					Session.set('bucket_is_repeating', false);	
				};
				
				$('.ui.checkbox.repeats-toggle').checkbox(onStart).checkbox('setting', {onEnable : onEnable, onDisable : onDisable});
			});
		}
	},
	initializeRequiredToggle : function() {
		var bucket = Session.get('current_content_bucket');
		
		if(bucket) {
			var isRequired = _.has(bucket, 'required') ? bucket['required'] : false;
			var onStart = isRequired ? 'enable' : 'disable';
			Meteor.defer(function(){
				var onEnable = function() {
					Session.set('bucket_is_required', true);	
				};
				var onDisable = function() {
					Session.set('bucket_is_required', false);	
				};
				
				$('.ui.checkbox.required-toggle').checkbox(onStart).checkbox('setting', {onEnable : onEnable, onDisable : onDisable});
			});
		}
	},
	setSessionVariablesOnShow : function(context, creatingNew) {
		Session.set('creating_new_bucket', creatingNew);
		if(!creatingNew) {
			var bucket = contentBucketHandler.getBucketByID(context['content_bucket_id']);
			Session.set('current_content_bucket', bucket);
		} else {
			Session.set('current_content_bucket', {});
			$('.description-input').val('');
		}
	},
	handleEnter : function() {
		if(Session.get('creating_new_bucket')) {
			this.onCreateContentBucket();
		} else {
			this.onEditContentBucket();
		}
	},
	onEditContentBucket : function() {
		var variablesFromModal = this.getVariablesFromModal();
		var query = {
			$set : variablesFromModal,
		};
		Meteor.call('updateContentBucket', Session.get('current_content_bucket')['_id'], query, function(error, result){
			warningMessageHandler.showMessage("Bucket Updated", "success");
		});
		this.hideModal();
	},
	onCreateContentBucket : function() {
		var bucket = this.buildNewBucket();
		Meteor.call('insertContentBucket', bucket, function(error, result){
			warningMessageHandler.showMessage("Bucket Created", "success");
		});
		this.hideModal();
	},
	buildNewBucket : function(event) {
		var bucket = this.getVariablesFromModal();	
		bucket['client_id'] = Session.get('selected_client_id');
		bucket['draft_variables'] = {};
		bucket['week'] = timeHandler.getWeekForSelectedTime();
		return bucket;
	},
	getVariablesFromModal : function() {
		var description = $('.description-input').val();
		var repeats = Session.get('bucket_is_repeating');
		var required = Session.get('bucket_is_required');
		return {
			description : description,
			repeats : repeats,
			required : required,
		};
	}
};