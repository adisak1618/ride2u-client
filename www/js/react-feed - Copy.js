//react feed app
var createFragment = require('react-addons-create-fragment');
var activitydata;
var feedInstance;
var ownfeedInstance;
var ActivityView = React.createClass({
  getInitialState: function() {
    var id = localStorage.getItem('id');
    var items = this.props.data.join;
    var createbutton = React.createElement("a", {className:"joinevent button button-big color-green button-fill widthfull",onClick:this.joinEvent}, "Join Even");
    for(var item in items){
      if(id == items[item]._id){
        createbutton = React.createElement("a", {className:"disjoinevent button button-big color-red button-fill widthfull",onClick:this.disjoinEvent}, "Cancle Even");

      }
    }

    return {
      items: [],
      button:createbutton
    };
  },
  disjoinButton: function(){
    console.log('disjoinButton');
    this.setState({button:React.createElement("a", {className:"disjoinevent button button-big color-red button-fill widthfull",onClick:this.disjoinEvent}, "Cancle Even")});
  },
  joinButton: function(){
    console.log('joinButton');
    this.setState({button:React.createElement("a", {className:"joinevent button button-big color-green button-fill widthfull",onClick:this.joinEvent}, "Join Even")});
  },
  joinEvent:function(){
    var that = this;

    $$.ajax({
      url:base_url+"api/join/"+this.props.data._id+"?token=" + localStorage.getItem('token'),
      method:'POST',
      dataType:'json',
      success:function(data, status, xhr){
        console.log(data);
        // reactthis.setState({
        //       items: data
        //     });
        console.log('success');

        that.disjoinButton();
      }
    });
  },
  disjoinEvent:function(){
    var that = this;
    $$.ajax({
      url:base_url+"api/disjoin/"+this.props.data._id+"?token=" + localStorage.getItem('token'),
      method:'POST',
      dataType:'json',
      success:function(data, status, xhr){
        console.log(data);
        // reactthis.setState({
        //       items: data
        //     });
        console.log('success');

        that.joinButton();
      }
    });
  },
  render: function() {
    factory.isLogin();
    console.log("Render Html");


    return (
      <div>
        <img src={base_url+"uploads/activity/"+this.props.data.image} width="100%"/>

        <div className="block paper-popup">
          <div className="box">
            <h2>{this.props.data.title}</h2>
            <p className="date">{(new Date(this.props.data.update_date)).toDateString()}</p>
          </div>
          <div className="box">
            <p>by adisakchaiyakul</p>
          </div>
          <div className="box">
            <div className="row">
              <div className="col-33">
                <div className="paper-label color1">
                  <h1 className="top">{this.props.data.distance}</h1>
                  <h1 className="bottom">KM</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color3">
                  <h1 className="top">{this.props.data.maxbiker}</h1>
                  <h1 className="bottom">Member</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color2">
                  <h1 className="top">{this.props.data.avgspeed}</h1>
                  <h1 className="bottom">Speed</h1>
                </div>
              </div>
            </div>
            <div>
              <div className="paper-label color4">
                <h1 className="top">{(new Date(this.props.data.date)).toDateString()}</h1>
                <h1 className="bottom">Day To Go</h1>
              </div>
            </div>
          </div>
          <div className="box">
            <p>{this.props.data.description}</p>
          </div>
          <div className="box">
            {this.state.button}
          </div>

        </div>
      </div>
    );
  }
});

var Feed = React.createClass({
  getInitialState: function() {
    return {
      items: []
    };
  },

  componentDidMount: function() {

    var user_id = this.props.userid ? "/"+this.props.userid : "";
    var url = this.props.source+user_id+"?token="+localStorage.getItem('token');
    console.log(url);
    var reactthis = this;
    $$.ajax({
      url:url,
      method:'GET',
      dataType:'json',
      success:function(data, status, xhr){
        console.log(data);
        reactthis.setState({
              items: data
            });
            console.log('success');

      }
    });
  },
  handleClick: function(item) {

    activitydata = item;
    //ReactDOM.render(<ActivityView data={item}/>,document.getElementById('activity'));
    console.log(activitydata);
  },
  render: function() {
    return (
      <div>
        {
          this.state.items.map(function(object,key) {
            return (
              <div className="card facebook-card" obj={object} key={key}>
                <div className="card-header">
                  <div className="facebook-avatar"><img src="img/avatar.png"/></div>
                  <div className="facebook-name">Adisak Chaiyakul</div>
                  <div className="facebook-date">{(new Date(object.update_date)).toDateString()}</div>

                </div>

                <div className="card-content">
                  <div className="card-content-inner">
                    <img src={base_url+"uploads/activity/"+object.image} width="100%" />
                    <div className="title">{object.title}</div>
                    <div className="distance">{object.distance+" KM "}</div>

                    <div className="content"><p>{object.description}</p></div>
                  </div>
                </div>
                <div className="card-footer">
                      <a href="#" className="button  color-gray">ชอบ</a>
                      <a href="activity.html" onClick={this.handleClick.bind(this, object)} className="button  color-gray">รายละเอียด</a>
                </div>
              </div>
            );
          },this)
        }

      </div>

    );
  }
});

var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: []
    };
  },
  componentDidMount: function(){
    var profileurl = base_url+"api/users/find/"+localStorage.getItem('id');
    var that = this;
    $$.ajax({
      url:profileurl,
      method:'GET',
      dataType:'json',
      success:function(data, status, xhr){
        console.log(data);
        console.log("profile data");
        that.setState({
              profile: data
            });


      }
    });
  },
  render: function(){
    return (
      <div>

        <img src={(this.state.profile.cover == "") ? "img/cover.jpg" : base_url+"uploads/profiles/cover/"+this.state.profile.cover} width="100%"/>
        <div className="block paper-popup">
          <div className="profile-picture">
            <img src={(this.state.profile.image == "") ? "img/avatar.png" : base_url+"uploads/profiles/profile/"+this.state.profile.image} />
          </div>
          <div className="detail">
            <ul>
              <li>
                <h4>13</h4>
                <p>Post</p>
              </li>
              <li>
                <h4>125</h4>
                <p>Distance</p>
              </li>
              <li>
                <h4>125</h4>
                <p>Join</p>
              </li>
            </ul>
            <a className="button  color-gray">แก้ไขข้อมูลส่วนตัว</a>
          </div>
        </div>


      </div>
    );
  }
});



var Record = React.createClass({
  getInitialState: function() {
    return {
      gps: [],
      max_speed: 0,
      start_record: null,
      stop_record: null,
      distance: 0,
      count: 0,
      watchID: null,
      gpsevent: null
    };
  },
  recordBox: function(){
    var that = this;
    var loop = setInterval(function(){ that.setState({count: that.state.count+1}); console.log(that.state.count); }, 1000);
  },
  recordGps: function(){
    alert("start record");
    this.setState({start_record:(new Date()).getTime()});
    var that = this;
    var gpsEvent = navigator.geolocation.watchPosition(
    function(position){
      var newdata = that.state.gps.slice();
      newdata.push({lat: position.coords.latitude, lng: position.coords.longitude });
      if(position.coords.speed  > that.state.max_speed){
        that.setState({max_speed:position.coords.speed});
      }

      that.setState({gps:newdata})
      console.log(that.state.gps);
      console.log(typeof that.state.gps);
      console.log(position.coords.latitude);
    },
    function(error){
      console.log(error);
    });

    //Set WatchPosition Event to variable
    this.setState({gpsevent:gpsEvent});
  },
  stopGps: function(){
      navigator.geolocation.clearWatch(this.state.gpsevent)
      this.setState({stop_record:(new Date()).getTime()});

      console.log("stop gps");
  },
  render: function(){

    return (
      <div>
          adisak: {this.state.count}<br/>
          gps: {this.state.gps}
          start: {this.state.start_record}
          stop: {this.state.stop_record}
          max speed: {this.state.max_speed}
          <div onClick={this.recordBox}>click</div>

          <div onClick={this.recordGps}><h1>START GPS</h1></div>
          <div onClick={this.stopGps}><h1>START GPS</h1></div>
      </div>
    );
  }
});



$$('.login-screen').on('closed',function(){
  renderFeed();
});

$$('#add-content').on('closed',function(){
  setTimeout(function(){ renderFeed(); }, 3000);
});


//Create Element when user view single activity
$$(document).on('pageAfterAnimation', '.page[data-page="activity"]', function (e) {
    ReactDOM.render(<ActivityView data={activitydata}/>,document.getElementById('activity'));

    console.log("Activity Page");
});








function renderFeed(){
  console.log(myApp.activeStateElemets);
  var url = base_url+"api/activity";
  var userid = localStorage.getItem('id');
  feedInstance = ReactDOM.render(<Feed source={url} />, document.getElementById('feed'));
  ownfeedInstance = ReactDOM.render(<Feed source={url}  userid="admin"/>, document.getElementById('own-activity'));
  ReactDOM.render(
    <Profile/>,
    document.getElementById('profile')
  );

  ReactDOM.render(
    <Record/>,
    document.getElementById('countid')
  );


}

//Ajax respone
$$('#add_form.ajax-submit').on('submitted', function (e) {
  var url = base_url+"api/activity";
  var xhr = e.detail.xhr; // actual XHR object
  ReactDOM.render(<Feed source={url} />, document.getElementById('feed'));
  var data = e.detail.data; // Ajax repsonse from action file
  console.log(e.detail.data);

  myApp.closeModal('.popup-add');
  document.getElementById("add_form").reset();
  // do something with response data
});
