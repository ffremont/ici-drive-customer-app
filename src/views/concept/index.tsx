import React from 'react';
import './Concept.scss';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import historyService from '../../services/history.service';

class Concept extends React.Component<{ history: any, match: any }, {}>{


  componentWillUnmount() {
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
  }

  render() {

    return (<div className="how">
      <MenuApp mode="light" history={this.props.history} />

      <Typography variant="h5">Concept</Typography>
      <p>
        app.ici-drive.fr est une application GRATUITE, OUVERTE à tous les producteurs et consommateurs souhaitant vendre et acheter local.
        La logistique est supportée par chaque producteur.
</p><p>

        <strong>En tant que consommateur</strong>, vous avez accès à tous les produits locaux en accès drive.
        <br/>
        <strong>En tant que producteur</strong>, vous permettez aux consommateurs de réserver en ligne et de venir récupérer les produits dans votre lieu de retrait.
</p><p>
        Cette plateforme de drive est une initiative citoyenne. Pour consommer localement il faut un prix juste et aussi une logistique.
        Car nous avons tous des vies remplies, le drive est une solution concrète pour récuperer simplement les produits.
      </p>
      
    </div>);
  }
}


export default Concept;
