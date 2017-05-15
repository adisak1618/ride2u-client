//react feed app
var activitydata;
var feedInstance;
var ownfeedInstance;

var ActivityView = React.createClass({
  getInitialState: function() {
    var dataactivity = {};
    var id = localStorage.getItem('id');
    var items = this.props.data.join;
    var createbutton = React.createElement("a", {className:"joinevent button button-big color-green button-fill widthfull",onClick:this.joinEvent}, "Join Even");
    for(var item in items){
      if(id == items[item]._id){
        createbutton = React.createElement("a", {className:"disjoinevent button button-big color-red button-fill widthfull",onClick:this.disjoinEvent}, "Cancel Even");

      }
    }





    return {
      items: [],
      button: createbutton,
      data: this.props.data,
      joined_list: []
    };
  },
  componentWillMount: function() {
    var data_joins = this.state.data;
    var itemlist = [];
    var joined_lists = [];
    data_joins.join.map(function(item_pic, keyddd) {
      var that = this;
      console.log(item_pic._id);
      $.get( "http://localhost:3000/api/users/find/"+item_pic._id, function( data ) {
        console.log(data);
        console.log("DDDD");
        itemlist.push(data.image);
        console.log(data.image);
        joined_lists = that.state.joined_list;
        joined_lists.push(data.image);
        that.setState({joined_list: joined_lists});
      });

    }, this);
    // console.log(itemlist);
    // this.setState({joined_list: itemlist});

    console.log(this.state.joined_list);
    // console.log(base_url+"api/activity/"+this.props.data._id+"?token=" + localStorage.getItem('token'));
    // var data_act = {};
    // $$.ajax({
    //   url:base_url+"api/activity/"+this.props.data._id+"?token=" + localStorage.getItem('token'),
    //   method:'GET',
    //
    //   success:function(data, status, xhr){
    //     console.log(data);
    //     console.log('Success Get Activity');
    //     data_act = data;
    //
    //
    //   }
    // });
    //
    // this.setState({data: data_act});

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
    console.log(this.state.data);
    var joined_lists = this.state.joined_list;

    return (
      <div>
        <img src={base_url+"uploads/activity/"+this.state.data.image} width="100%"/>

        <div className="block paper-popup margintop40">
          <div className="box">
            <h2>{this.state.data.title}</h2>
            <p className="date">{(new Date(this.state.data.update_date)).toDateString()}</p>
          </div>
          <div className="box">
            <p>by adisakchaiyakul</p>
          </div>
          <div className="box">
            <div className="row">
              <div className="col-33">
                <div className="paper-label color1">
                  <h1 className="top">{this.state.data.distance}</h1>
                  <h1 className="bottom">KM</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color3">
                  <h1 className="top">{this.state.data.maxbiker}</h1>
                  <h1 className="bottom">Member</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color2">
                  <h1 className="top">{this.state.data.avgspeed}</h1>
                  <h1 className="bottom">Speed</h1>
                </div>
              </div>
            </div>
            <div>
              <div className="paper-label color4">
                <h1 className="top">{(new Date(this.state.data.date)).toDateString()}</h1>
                <h1 className="bottom">Day To Go</h1>
              </div>
            </div>
          </div>
          <div className="box">
            <p>{this.state.data.description}</p>
          </div>
          <div className="box">
            {this.state.button}
          </div>
          <div className="box">
            Joined
            {
              joined_lists.map(function(item,keydd) {
                console.log(item)
                return(
                  <div>
                    <div className="joined_list">
                      <img src={(item == "") ? "img/profile.jpg" : base_url+"uploads/profiles/profile/"+item} width="100%"/>
                    </div>
                  </div>
                );
              })
            }
          </div>

        </div>
      </div>
    );
  }
});

var Feed = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      FeedList:[]
    };
  },

  componentDidMount: function() {

    var user_id = this.props.userid ? "/"+this.props.userid : "";
    var url = this.props.source+user_id+"?token="+localStorage.getItem('token');
    console.log(url);
    var reactthis = this;
    var activity, rec_activity;
    $$.ajax({
      url:url,
      method:'GET',
      dataType:'json',
      success:function(data, status, xhr){
        reactthis.setState({
              items: data
            });
        if(data instanceof Array){
          activity = data.map(function(item,index){
            return {type:0,data:item};
          });
          reactthis.genFeedData(activity, rec_activity);
        }
        console.log(activity);


            console.log('success');

      }
    });

    $$.ajax({
      url: base_url+'api/rec_activity/all',
      method:'GET',
      dataType:'json',
      success:function(data, status, xhr){
        if(data instanceof Array){
          rec_activity = data.map(function(item,index){
            return {type:1,data:item,index:index};
          });
          reactthis.genFeedData(activity, rec_activity);
        }
        console.log(rec_activity);


            console.log('success');

      }
    });



  },
  genFeedData: function(activity,rec_activity){

    if(activity != null && rec_activity != null && activity instanceof Array && rec_activity instanceof Array){
      var feeddata = activity.concat(rec_activity);
      console.log('FEEED DATA');
      console.log(feeddata);
      this.setState({
            FeedList: feeddata
          });
    }

  },
  handleClick: function(item) {

    activitydata = item;
    //ReactDOM.render(<ActivityView data={item}/>,document.getElementById('activity'));
    console.log(activitydata);
  },
  handleClick_rec: function(item) {

    activitydata = item;
    //ReactDOM.render(<Rec_activity data={item}/>,document.getElementById('rec_activity'));
    console.log(activitydata);
  },
  render: function() {
    return (
      <div>
        {
          this.state.FeedList.map(function(object,key) {
            if(object.type == 0){

              return (
                <div className="card facebook-card" obj={object.data} key={key}>
                  <div className="card-header">
                    <div className="facebook-avatar"><img src={base_url+"uploads/profiles/profile/"+object.data.user_id.image}/></div>
                    <div className="facebook-name">{object.data.user_id.name}</div>
                    <div className="facebook-date">{(new Date(object.data.update_date)).toDateString()}</div>

                  </div>

                  <div className="card-content">
                    <div className="card-content-inner">
                      <img src={base_url+"uploads/activity/"+object.data.image} width="100%" />
                      <div className="title">{object.data.title}</div>
                      <div className="distance">{object.data.distance+" KM "}</div>

                      <div className="content"><p>{object.data.description}</p></div>
                    </div>
                  </div>
                  <div className="card-footer">

                        <a href="activity.html" onClick={this.handleClick.bind(this, object.data)} className="button  color-gray">รายละเอียด</a>
                  </div>
                </div>
              );
            }else{

              return (
                <div className="card facebook-card" obj={object.data} key={key}>
                  <div className="card-header">
                    <div className="facebook-avatar"><img src={base_url+"uploads/profiles/profile/"+object.data.user_id.image}/></div>
                    <div className="facebook-name">{object.data.user_id.name}</div>
                    <div className="facebook-date">{(new Date(object.data.date)).toDateString()}</div>

                  </div>

                  <div className="card-content">
                    <div className="card-content-inner">

                      <Rendermap maptracking={object.data.gps}/>
                      <div className="row">
                        <p>{object.data.message}</p>
                      </div>
                      <div className="row">
                        <div className="row widthfull">
                          <div className="col-33">
                            <b>Distance: </b>{Math.round(object.data.distance*100)/100}
                          </div>
                          <div className="col-33">
                            <b>Average: </b>{Math.round(object.data.avg*100)/100}
                          </div>
                          <div className="col-33">
                            <b>Max: </b>{object.data.max}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                        <a href="#" className="button  color-gray">ชอบ</a>
                        <a href="rec_activity.html" onClick={this.handleClick_rec.bind(this, object.data)} className="button  color-gray">รายละเอียด</a>
                  </div>
                </div>
              )

            }


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
  handleClick: function(event) {

    console.log("edit profile");
    var dataeditpage = this.state.profile;
    setTimeout(function(){
        ReactDOM.render(<Edit_profile data={dataeditpage}/>,document.getElementById('edit-profile'));
    },1500);


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
                <h4>{this.state.profile.distance}</h4>
                <p>Distance</p>
              </li>
              <li>
                <h4>{this.state.profile.join}</h4>
                <p>Join</p>
              </li>
            </ul>

            <a href="edit-profile.html" data-view=".view-profile" onClick={this.handleClick} className="button  color-gray">แก้ไขข้อมูลส่วนตัว</a>
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
      speed: 0,
      start_record: 0,
      stop_record: 0,
      distance: 0,
      count: 0,
      avg:0,
      watchID: null,
      gpsevent: null,
      isStart: false,
      maplist:[]
    };
  },
  componentDidMount: function(){
    $$("#stop_activity").hide();
  },
  recordBox: function(){
    var that = this;
    this.setState({count: 0});
    this.interval = setInterval(function(){ that.setState({count: that.state.count+1}); }, 1000);

  },
  recordGps: function(){
    this.setState({gps:[]});
    this.recordBox();
    console.log("start record");
    $$("#start_activity").hide();
    $$("#stop_activity").show();

    this.setState({isStart:true});

       this.setState({start_record:(new Date())});

    var that = this;

    var gpsEvent = navigator.geolocation.watchPosition(
    function(position){
      //var newdata = that.state.gps.slice();
      //newdata.push(position.coords.latitude);
      console.log(position.coords);
      if(position.coords.speed  > that.state.max_speed){
        that.setState({max_speed: position.coords.speed});
        console.log("max speed: "+position.coords.speed);
      }
      if(position.coords.speed != null){
        that.setState({speed: position.coords.speed});
      }
        //recordmap.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
        that.setState({maplist:'4'});


        console.log("correct polyline");

        console.log("check polyline");


        var gpsobject = {latitude:position.coords.latitude,longitude:position.coords.longitude};
      that.setState((state) => { gps: state.gps.push(gpsobject) });
      console.log(JSON.stringify(that.state.gps));
      console.log(typeof that.state.gps);
      console.log(position.coords.latitude);
      console.log(position.coords.speed);
    },
    function(error){
      console.log(error);
    });

    // tracking to google map

    //Set WatchPosition Event to variable
    this.setState({gpsevent:gpsEvent});
  },
  stopGps: function(){
    myApp.popup('.complete-activity');
      //navigator.geolocation.clearWatch(this.state.gpsevent);
      this.setState({stop_record:(new Date()).getTime()});
      clearInterval(this.interval);
      console.log("stop gps");
      $$("#stop_activity").hide();
      $$("#start_activity").show();
      console.log("when stop ");
      console.log(this.state.gps);
      navigator.geolocation.clearWatch(this.state.gpsevent);

      var data = {};
      var  distancebetween = google.maps.geometry.spherical.computeDistanceBetween;
      data.start_gps = this.state.gps[0];
      data.stop_gps = this.state.gps[this.state.gps.length - 1];
      data.start = this.state.start_record;
      data.stop = new Date();
      data.gps = this.state.gps;
      data.user_id = localStorage.getItem('id');
      data.max = this.state.max_speed;
      data.date = new Date();

      var distance = 0;
      if(data.gps instanceof Array){
        data.gps.map(function(item,index){
          console.log("gps");
          console.log(item);
          if(index > 0){
            var between = distancebetween(
              new google.maps.LatLng({lat:item.latitude, lng: item.longitude}),
              new google.maps.LatLng({lat:data.gps[index-1].latitude, lng: data.gps[index-1].longitude})
            );
            distance += between;
          }

          console.log(between);
          console.log(distance/1000);
        });
        data.distance = distance/1000;
        data.avg = data.distance/((new Date(data.stop) - new Date(data.start))/(1000*60*60));

      }
      console.log(data);

      //this.setState({adisak:<Rendermap maptracking={this.state.gps} random={Math.random()}/>});
      //ReactDOM.render(<complete_activity data={data}/>,document.getElementById('complete-activity'));
      ReactDOM.render(<Complete_activity data={data} />,document.getElementById('complete-activity'));
  },
  render: function(){
    var hours = Math.floor(this.state.count/(60*60));
    var minutes = Math.floor((this.state.count%(60*60))/60)
    var secord = this.state.count%(60);



    return (
      <div>
        <div className="block recordTrip">
          <div className="text-center"><h1> {this.state.speed} </h1><h2>KM/HR</h2></div>

          <div className="row">

            <div className="col-50">
              <div className="box text-center">
                <h2>{this.state.max_speed}</h2>
                <h3>Max Speed</h3>
              </div>

            </div>
            <div className="col-50">
              <div className="box text-center">
                <h2>{hours+":"+minutes+":"+secord}</h2>
                <h3>Time</h3>
              </div>

            </div>
          </div>
          <a onClick={this.recordGps} className="button button-big color-green button-fill widthfull" id="start_activity">START</a>
          <a onClick={this.stopGps} className="button button-big color-red button-fill widthfull" id="stop_activity">STOP</a>

        </div>

        {this.state.adisak}







      </div>
    );
  }
});






var Rendermap = React.createClass({
  getInitialState: function(){

    return {
      hi:0
    };
  },
  componentDidMount: function(){
    console.log('REFFFFFFFFFFFFFFFFFFFFFFFFFF');
    console.log(ReactDOM.findDOMNode(this.refs.maptracking));
    console.log(this.refs.myInput);
    var mapelement = React.createElement("a", {className:"maptracking"}, "Join Even");
    this.map = new google.maps.Map(this.refs.maptracking, {
      center: {lat: 0.647502, lng: 10.494857},
      zoom: 17
    });
    console.log("maptracking");
    console.log(this.props.maptracking);
    console.log("maptracking");

    //this.flight2 = this.props.maptracking.map(function(object,key){ var data = object.split(","); return {lat:Number(data[0]),lng:Number(data[1])}; });
    this.flight7 = this.props.maptracking.map(function(object,key){ return {lat:Number(object.latitude),lng:Number(object.longitude)}; });
    //this.flight = this.props.maptracking;
    console.log('asdf');
    console.log(this.props.maptracking);
    console.log(this.flight2);
    var flight3 = ["13.650143,100.489524","13.649723,100.490435","13.649778,100.490706","13.650049,100.491008","13.647502,100.494857"];
    var flight4 = flight3.map(function(object,key){ var data = object.split(","); return {lat:Number(data[0]),lng:Number(data[1])}; });
    var flight = [
      {lat: 13.650143, lng: 100.489524},
      {lat: 13.649723, lng: 100.490435},
      {lat: 13.649778, lng: 100.490706},
      {lat: 13.650049, lng: 100.491008},
      {lat: 0.647502, lng: 10.494857}
    ];
    var flightPath = new google.maps.Polyline({
      path: this.flight7,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeWeight: 5
    });
    flightPath.setMap(this.map);
    console.log("this map");
    console.log(this.props.maptracking);
    this.map.setCenter(new google.maps.LatLng(this.props.maptracking[0].latitude, this.props.maptracking[0].longitude));

  },
  componentDidUpdate: function(){
    this.componentDidMount();
  },
  render: function() {
    return (
      <div>


        <div className="maptracking" ref="maptracking"></div>
      </div>
    );
  }
});

var Rendermapbyid = React.createClass({
  getInitialState: function(){

    return {
      hi:0
    };
  },
  componentDidMount: function(){
    var mapelement = React.createElement("a", {className:"maptracking"}, "Join Even");
    this.map = new google.maps.Map(document.getElementById('maptracking'), {
      center: {lat: 0.647502, lng: 10.494857},
      zoom: 17
    });
    console.log("maptracking");


    console.log(this.props.maptracking);
    console.log("maptracking");

    //this.flight2 = this.props.maptracking.map(function(object,key){ var data = object.split(","); return {lat:Number(data[0]),lng:Number(data[1])}; });
    this.flight7 = this.props.maptracking.map(function(object,key){ return {lat:Number(object.latitude),lng:Number(object.longitude)}; });
    //this.flight = this.props.maptracking;
    console.log('asdf');
    console.log(this.props.maptracking);
    console.log(this.flight2);
    var flight3 = ["13.650143,100.489524","13.649723,100.490435","13.649778,100.490706","13.650049,100.491008","13.647502,100.494857"];
    var flight4 = flight3.map(function(object,key){ var data = object.split(","); return {lat:Number(data[0]),lng:Number(data[1])}; });
    var flight = [
      {lat: 13.650143, lng: 100.489524},
      {lat: 13.649723, lng: 100.490435},
      {lat: 13.649778, lng: 100.490706},
      {lat: 13.650049, lng: 100.491008},
      {lat: 0.647502, lng: 10.494857}
    ];
    var flightPath = new google.maps.Polyline({
      path: this.flight7,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.7,
      strokeWeight: 5
    });
    flightPath.setMap(this.map);
    console.log("this map");
    console.log(this.props.maptracking);
    this.map.setCenter(new google.maps.LatLng(this.props.maptracking[0].latitude, this.props.maptracking[0].longitude));

  },
  componentDidUpdate: function(){
    this.componentDidMount();
  },
  render: function() {
    return (
      <div>


        <div id="maptracking" ref="maptracking"></div>
      </div>
    );
  }
});

var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

var Complete_activity = React.createClass({
  getInitialState: function(){
    console.log(this.props.data);
    return {
      hi:0
    };
  },
  submit: function(){
    console.log(this.props.data);
    var data_complete = this.props.data;
    data_complete.message = $('textarea[name="complete_record"]').val();

    var token = "?token="+localStorage.getItem('token');
    // $$.ajax({
    //   url:base_url+"api/rec_activity/rec"+token,
    //   method:'POST',
    //   dataType:'json',
    //   data:data_complete,
    //   success:function(data, status, xhr){
    //     console.log(data);
    //     console.log(status);
    //     alert('hi');
    //   }
    // });
    if(typeof data_complete.gps != "string"){
      data_complete.gps = JSON.stringify(data_complete.gps);
    }
    if(typeof data_complete.start_gps != "string"){
      data_complete.start_gps = JSON.stringify(data_complete.start_gps);
    }
    if(typeof data_complete.stop_gps != "string"){
      data_complete.stop_gps = JSON.stringify(data_complete.stop_gps);
    }
    data_complete.adisak = 12.5;
    console.log(data_complete);
    console.log(data_complete.avg);
    $.ajax({
      type: "POST",
      url: base_url+"api/rec_activity/rec"+token,
      data: data_complete,
      dataType: "json",
      crossDomain: true,
      success: function(data){
        console.log(data);
        myApp.closeModal('.complete-activity')
      }
    });


  },
  render: function() {
    return (
      <div>

        <div className="block paper-popup">
          <div className="item-input">
            <textarea rows="5" name="complete_record" className="textarea"  placeholder="พูดบางอย่างเกี่ยวกับกิจกรรมนี้"></textarea>
          </div>
        </div>
        <div className="block paper-popup">
          <div className="box">
            <div className="row">
              <div className="col-33">
                <div className="paper-label color1">
                  <h1 className="top">{Math.round(this.props.data.distance*100)/100}</h1>
                  <h1 className="bottom">KM</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color3">
                  <h1 className="top">{this.props.data.avg}{Math.round(this.props.data.distance*100)/100}</h1>
                  <h1 className="bottom">AVG</h1>
                </div>
              </div>
              <div className="col-33">
                <div className="paper-label color2">
                  <h1 className="top">{this.props.data.max}</h1>
                  <h1 className="bottom">Max</h1>
                </div>
              </div>
            </div>
            <div>
              <div className="paper-label color4">
                <h1 className="top">{(new Date(this.props.data.stop)).toDateString()}</h1>
                <h1 className="bottom">Day</h1>
              </div>
            </div>
          </div>
        </div>
        <Rendermap maptracking={this.props.data.gps} />
        <br/>
        <a className="button button-big color-green button-fill widthfull" onClick={this.submit}>บันทึก</a>
      </div>
    );
  }
});


var Rec_activity = React.createClass({
  getInitialState: function(){
    console.log(this.props.data);
    var data = this.props.data;
    return {
      hi:0
    };
  },
  distanceFormat: function(data){
    if(typeof data == "number" && data < 1){
      return Math.floor(data*1000)+"m";
    }else{
      return parseFloat(data).toFixed(2)+"km";
    }
  }
  ,
  render: function() {
    return (
      <div>
      <br/><br/>
        <div className="card facebook-card" obj={this.data}>
          <div className="card-header">
            <div className="facebook-avatar"><img src={base_url+"uploads/profiles/profile/"+this.props.data.user_id.image}/></div>
            <div className="facebook-name">{this.props.data.user_id.name}</div>
            <div className="facebook-date">{(new Date(this.props.data.date)).toDateString()}</div>

          </div>

          <div className="card-content">
            <div className="card-content-inner">

              <Rendermap maptracking={this.props.data.gps}/>
              <div className="row widthfull">
                <div className="col-33">
                  <b>Distance: </b>{this.distanceFormat(this.props.data.distance)}
                </div>
                <div className="col-33">
                  <b>Average: </b>{parseFloat(this.props.data.avg).toFixed(2)}
                </div>
                <div className="col-33">
                  <b>Max: </b>{this.props.data.max}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

var Edit_profile = React.createClass({
  getInitialState: function(){

    var data = this.props.data;
    return {
      hi:0
    };
  },
  componentDidMount: function(){
    $('#profiles_edit').attr('src', base_url+"uploads/profiles/profile/"+this.props.data.image);
    $('#cover_edit').attr('src', base_url+"uploads/profiles/cover/"+this.props.data.cover);
    console.log("Prop data ->");
    console.log(this.props.data);
  },
  get_pic: function(){


  },
  cover_changes: function(){
    var user_id = this.props.data._id;
    navigator.camera.getPicture(
        function(imageData){
          console.log("on success");
          //console.log(imageData);
          //$('#sellected_image').attr('src',imageData);


          //var data_img = "data:image/jpeg;base64,"+imageData;
          try {
            $('#cover_edit').attr('src', "data:image/jpeg;base64,"+imageData);
            var formData = new FormData();
            var blob = dataURLtoBlob("data:image/jpeg;base64,"+imageData);
            formData.append("image", blob, 'image.png');
            var request = new XMLHttpRequest();
            request.open("POST", base_url+"api/users/cover/"+user_id,true);
            request.send(formData);
          }
          catch(err) {
            console.log("err");
            console.log(err);
          }


        },
        function(){
          console.log("on error");

      },
      { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    });
  },
  profile_click: function(){
    var user_id = this.props.data._id;
    navigator.camera.getPicture(
        function(imageData){
          console.log("on success");
          //console.log(imageData);
          //$('#sellected_image').attr('src',imageData);
          //var data_img = "data:image/jpeg;base64,"+imageData;
          try {
            $('#profiles_edit').attr('src', "data:image/jpeg;base64,"+imageData);
            var formData = new FormData();
            var blob = dataURLtoBlob("data:image/jpeg;base64,"+imageData);
            formData.append("image", blob, 'image.png');
            var request = new XMLHttpRequest();
            request.open("POST", base_url+"api/users/profile/"+user_id,true);
            request.send(formData);

          } catch (e) {
            console.log("err");
            console.log(err);
          }


        },
        function(){
          console.log("on error");

      },
      { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    });
  },
  render: function() {
    return (

      <div>
        <div className="card facebook-card">
          <div className="card-content-inner">
            <div className="input-box">

              <div>
                <h2>Profile Picture</h2>
                <img src="" id="profiles_edit" width="100%" onClick={this.profile_click}/>
              </div>
              <div>
                <h2>Cover Picture</h2>
                <img src="" id="cover_edit" width="100%" onClick={this.cover_changes}/>
              </div>
              <button class="button button-big color-green button-fill widthfull" type="submit">SAVE</button>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>

            </div>

          </div>
        </div>
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

$$(document).on('pageAfterAnimation', '.page[data-page="rec_activity"]', function (e) {
    ReactDOM.render(<Rec_activity data={activitydata}/>,document.getElementById('rec_activity'));

    console.log("rec_activity Page");
});







function renderFeed(){
  console.log(myApp.activeStateElemets);
  var url = base_url+"api/activity";
  var userid = localStorage.getItem('id');
  feedInstance = ReactDOM.render(<Feed source={url} />, document.getElementById('feed'));
  ownfeedInstance = ReactDOM.render(<Feed source={url} />, document.getElementById('own-activity'));
  ReactDOM.render(
    <Profile/>,
    document.getElementById('profile')
  );

  ReactDOM.render(
    <Record/>,
    document.getElementById('countid')
  );




}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

$("#add_form").submit(function( event){
  event.preventDefault();
  var token = localStorage.getItem('token');
  var allinput = true;
  var formData = new FormData();
  var blob = null;
  console.log($('#sellected_image').attr('src'));

  formData.append("user_id",localStorage.getItem('id'));

  if($('#sellected_image').attr('src') != ""){
    blob = dataURLtoBlob($('#sellected_image').attr('src'));
    formData.append("image", blob, 'image.jpg');
  }else{
    allinput = false;
    $("#add-content .alertmsg").html("Input Image is missing!");
    $("#add-content .alertmsg").slideDown().delay(3000).slideUp();
  }


  $.each($(this).serializeArray(), function (i, field) {
    console.log(field.name);
    console.log(field.value);
    console.log(allinput);
    if(field.value == "" || field.value == null){
      if(allinput){
        $("#add-content .alertmsg").html("Input " + field.name + " is missing!");
        $("#add-content .alertmsg").slideDown().delay(3000).slideUp();
      }
      allinput = false;
    }
    formData.append(field.name, field.value);

  });


  if(allinput){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        myApp.closeModal('.popup-add');
      }else if(request.readyState == 4 && request.status != 200){
        $("#add-content .alertmsg").html("Error to add new activity!");
        $("#add-content .alertmsg").slideDown().delay(3000).slideUp(function(){
          myApp.closeModal('.popup-add');
        });
      }
    };

  	request.open("POST", "http://128.199.151.123:8080/api/activity?token="+token,true);
  	request.send(formData);
  }

  // var listdata = $( this ).serializeArray();
  // $.each();
  console.log(formData);

});

$("#FeedView .refreshbutton").click(function(){
  rerender();
});

var ptrContent = $$('#FeedView .pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
   rerender();
   setTimeout(function () {
     myApp.pullToRefreshDone();
   },2000);
});

var profileContent = $$('#ProfileView .pull-to-refresh-content');
profileContent.on('refresh', function (e) {
  React.unmountComponentAtNode(document.getElementById('profile'));
  ReactDOM.render(
    <Profile/>,
    document.getElementById('profile')
  );
   setTimeout(function () {
     myApp.pullToRefreshDone();
   },2000);
});
function rerender(){
  console.log("refresh");
  var url = base_url+"api/activity";
  React.unmountComponentAtNode(document.getElementById('feed'));
  ReactDOM.render(<Feed source={url} />, document.getElementById('feed'));
}

function distanceFormat(data){
  if(typeof data == "number" && data < 1){
    return Math.floor(data*1000)+"m";
  }else{
    return parseFloat(data).toFixed(2)+"km";
  }
}
// var formdata = new FormData();
// formdata.append('data','123');
// console.log(formdata);
// console.log(formdata.get('data'));
// $.ajax({
//   method: "POST",
//   url: "http://192.168.1.5:8080/test",
//   dataType: "json",
//   data: formdata
// });
//Ajax respone
// $$('#add_form.ajax-submit').on('submitted', function (e) {
//   console.log("ACTIVITY SEND!!!!!!!!!!!!!!!!!!!!!!!!!");
//   console.log(e.detail.data);
//   console.log('add activity');
//   var url = base_url+"api/activity";
//   var xhr = e.detail.xhr; // actual XHR object
//   ReactDOM.render(<Feed source={url} />, document.getElementById('feed'));
//   var data = e.detail.data; // Ajax repsonse from action file
//
//
//   myApp.closeModal('.popup-add');
//   document.getElementById("add_form").reset();
//   // do something with response data
// });


$('#sellect_image').click(function(){
  navigator.camera.getPicture(
    function(imageData){
      console.log("on success");
      console.log(imageData);
      //$('#sellected_image').attr('src',imageData);
      $('#sellected_image').attr('src', "data:image/jpeg;base64,"+imageData);




    },
    function(){
      console.log("on error");
  },
  { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType : Camera.PictureSourceType.PHOTOLIBRARY
});
});


// $( "#add_form" ).on( "submit", function(event) {
//   event.preventDefault();
//   console.log("Form Submited!!!!");
//   console.log( JSON.stringify($( this ).serializeArray()));
// });
