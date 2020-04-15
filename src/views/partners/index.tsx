import React from 'react';
import './Partners.scss';
import { Subscription } from 'rxjs';
import partnerStore from '../../stores/partners';
import { Partner } from '../../models/partner';



//https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
class Partners extends React.Component<{}, {partners: Partner[]}>{
  state = { partners: []};
  sub: Subscription|null = null;

  componentDidUpdate(){
    this.sub = partnerStore.subscribe( (newPartners: Partner[]) => {
      console.log("new value partners : ");
      console.log(newPartners);
      this.setState({
        partners: newPartners
      })
    });
  }

  componentWillUnmount(){
      this.sub?.unsubscribe();
  }

  render() {
    return (
      <div>
        partners
      </div>
    );
  }
}

export default Partners;
