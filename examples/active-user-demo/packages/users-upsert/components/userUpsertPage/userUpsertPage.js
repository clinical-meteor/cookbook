Session.setDefault( 'userReadOnly', true );


Router.map( function () {
  this.route( 'newRecordRoute', {
    path: '/insert/user',
    template: 'userUpsertPage',
    onAfterAction: function () {
      Session.set( 'userReadOnly', false );
    }
  } );

} );
Router.route( '/upsert/user/:id', {
  name: 'upsertRecordRoute',
  template: 'userUpsertPage',
  data: function () {
    return Meteor.users.findOne( this.params.id );
  },
  onAfterAction: function () {
    Session.set( 'userReadOnly', false );
  }
} );
Router.route( '/view/user/:id', {
  name: 'viewRecordRoute',
  template: 'userUpsertPage',
  data: function () {
    return Meteor.users.findOne( this.params.id );
  },
  onAfterAction: function () {
    Session.set( 'userReadOnly', true );
  }
} );


//-------------------------------------------------------------


Template.userUpsertPage.rendered = function () {
  Template.appLayout.layout();
};


Template.userUpsertPage.helpers( {
  getEmailAddress: function () {
    if ( this.emails && this.emails[ 0 ] && this.emails[ 0 ].address ) {
      return this.emails[ 0 ].address;
    } else {
      return '';
    }
  },
  isNewRecord: function () {
    if ( this._id ) {
      return false;
    } else {
      return true;
    }
  },
  getLockIcon: function () {
    if ( Session.get( 'userReadOnly' ) ) {
      return 'fa-lock';
    } else {
      return 'fa-unlock';
    }
  },
  isReadOnly: function () {
    if ( Session.get( 'userReadOnly' ) ) {
      return 'readonly';
    }
  },
  getRecordId: function () {
    if ( this._id ) {
      return this._id;
    } else {
      return '---';
    }
  }
} );

Template.userUpsertPage.events( {
  'click #removeUserButton': function () {
    Meteor.users.remove( this._id, function ( error, result ) {
      if ( error ) { console.log("error", error); };
      if ( result ) {
        Router.go( '/list/users' );
      }
    } );
  },
  'click #saveUserButton': function () {
    console.log( 'this', this );

    Template.userUpsertPage.saveRecord( this );
    Session.set( 'userReadOnly', true );
  },
  'click .barcode': function () {
    // TODO:  refactor to Session.toggle('userReadOnly')
    if ( Session.equals( 'userReadOnly', true ) ) {
      Session.set( 'userReadOnly', false );
    } else {
      Session.set( 'userReadOnly', true );
      console.log( 'Locking the user...' );
      Template.userUpsertPage.saveRecord( this );
    }
  },
  'click #lockRecordButton': function () {
    console.log( 'click #lockRecordButton' );

    if ( Session.equals( 'userReadOnly', true ) ) {
      Session.set( 'userReadOnly', false );
    } else {
      Session.set( 'userReadOnly', true );
    }
  },
  'click #userListButton': function ( event, template ) {
    Router.go( '/list/users' );
  },
  'click .imageGridButton': function ( event, template ) {
    Router.go( '/grid/users' );
  },
  'click .tableButton': function ( event, template ) {
    Router.go( '/table/users' );
  },
  'click #previewRecordButton': function () {
    Router.go( '/customer/' + this._id );
  },
  'click #upsertRecordButton': function () {
    console.log( 'creating new Meteor.users...' );
    Template.userUpsertPage.saveRecord( this );
  }
} );


Template.userUpsertPage.saveRecord = function ( user ) {
  // TODO:  add validation functions

  if ( user._id ) {
    var userOptions = {
      username: $( '#usernameInput' )
        .val(),
      emails: [ {
        address: $( '#userEmailInput' )
          .val()
      } ],
      profile: {
        fullName: $( '#userFullNameInput' )
          .val(),
        avatar: $( '#userAvatarInput' )
          .val(),
        description: $( '#userDescriptionInput' )
          .val()
      }
    };

    Meteor.users.update( {
      _id: user._id
    }, {
      $set: userOptions
    }, function ( error, result ) {
      if ( error ) console.log( error );
      Router.go( '/view/user/' + user._id );
    } );

    if ( user.emails[ 0 ].address !== $( '#userEmailInput' )
      .val() ) {
      var options = {
        userId: user._id,
        email: $( '#userEmailInput' )
          .val()
      };
      Meteor.call( 'updateEmail', options );
    }


  } else {
    var userOptions = {
      username: $( '#usernameInput' )
        .val(),
      email: $( '#userEmailInput' )
        .val(),
      profile: {
        fullName: $( '#userFullNameInput' )
          .val(),
        avatar: $( '#userAvatarInput' )
          .val(),
        description: $( '#userDescriptionInput' )
          .val()
      }
    };
    console.log( 'userOptions', userOptions );

    userOptions.password = $( '#usernameInput' )
      .val();
    Meteor.call( 'addUser', userOptions, function ( error, result ) {
      if ( error ) {
        console.log( 'error', error );
      }
      if ( result ) {
        console.log( 'result', result );
        Router.go( '/view/user/' + result );
      }
    } );

  }
};
