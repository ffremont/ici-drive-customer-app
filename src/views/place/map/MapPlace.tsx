import React from 'react';
import './MapPlace.scss';
import { Subscription } from 'rxjs';
import MenuApp from '../../../components/menu-app';
import historyService from '../../../services/history.service';

class MapPlace extends React.Component<{ history: any, match: any, location:any }, { }>{

  state = { maker: null };

  subMakers: Subscription | null = null;

  componentWillUnmount() {
    this.subMakers?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    const query = new URLSearchParams(this.props.location.search);
    const name = query.get('name'), address = query.get('address'), lat = parseFloat(query.get('lat')||'0'), lng = parseFloat(query.get('lng')||'0');

    const el = document.getElementById("map");
    const maps :any = (window as any).google ? (window as any).google.maps : null;
    if(el && maps){
        var myLatLng = {lat, lng};
    
        const map = new maps.Map(document.getElementById("map"), {
            center:myLatLng,
            zoom: 8
        }); 
        var infowindow = new maps.InfoWindow({
          content: `<h2>${name}</h2>
          <p>${address}</p>`
        });
        const marker = new maps.Marker({
            position: myLatLng,
            map: map,
            animation: maps.Animation.DROP,
            title: name
            });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        
    }
    
  }

  render() {
    return (<div className="place">
      <MenuApp mode="light" history={this.props.history} />

      <div id="map" className="gg-map-container"></div>
    </div>);
  }
}


export default MapPlace;
