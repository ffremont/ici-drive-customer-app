import React from 'react';
import './Partner.scss';
import MenuApp from '../../components/menu-app';
import { Subscription } from 'rxjs';
import productStore from '../../stores/products';
import partnerStore from '../../stores/partners';
import { Product } from '../../models/product';
import * as P from '../../models/partner';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Discover from '../../components/discover';
import { Item } from '../../models/item';
import conf from '../../confs';

interface GraphicProduct extends Product {
  category?: Item
}

class Partner extends React.Component<{ history: any, match: any }, { products: GraphicProduct[], partner: P.Partner | null, activeIndex: number }>{

  state = { products: [], activeIndex: 0, partner: null };
  subProducts: Subscription | null = null;
  subPartners: Subscription | null = null;

  componentWillUnmount() {
    this.subProducts?.unsubscribe();
    this.subPartners?.unsubscribe();
  }

  componentDidMount() {
    const partnerId = this.props.match.params.id;

    this.subProducts = productStore.subscribe((products: Product[]) => {
      this.setState({
        products: products.map((p: GraphicProduct) => {
          p.category = conf.categories.find(c => c.id === p.categoryId);
          return p;
        })
      });
    });

    this.subPartners = partnerStore.subscribe((partners: P.Partner[]) => {
      const partner = partners.find((p: P.Partner) => p.id === partnerId) || null;
      if (!partner) {
        this.props.history.push('/');
      }

      this.setState({
        partner
      })
    })

    productStore.refresh(partnerId);
  }

  render() {
    const myPart: any = this.state.partner;

    return (
      <div className="partner">
        <MenuApp mode="catalog" history={this.props.history} />

        {this.state.partner && (<Grid container alignContent="center" alignItems="center" justify="center">
          <Grid item>
            <Discover image={myPart.image} height={140} description={myPart.description} title={myPart.name} learnMore={myPart.webPage} />
          </Grid>
        </Grid>)}


        <Grid container alignContent="center" alignItems="center" justify="center">
          {this.state.products.map((p: GraphicProduct, i: number) => (
            <Card className="partner-card" key={i}>
              <CardHeader
                title={p.label}
                subheader={p.category?.label}
              />
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                className="partner-media"
                image={p.image}
                title={p.label}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  This impressive paella is a perfect party dish and a fun meal to cook together with your
                  guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  className={(this.state.activeIndex === i ? 'expandOpen' : 'expanded')}
                  onClick={() => this.setState({activeIndex: i})}
                  aria-expanded={this.state.activeIndex === i}
                  aria-label="voir plus"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={this.state.activeIndex === i} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Method:</Typography>
                  <Typography paragraph>
                    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                    minutes.
          </Typography>
                  <Typography paragraph>
                    Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                    heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                    browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                    and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                    pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                    saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
                </CardContent>
              </Collapse>
            </Card>

          ))}


        </Grid>



      </div>
    );
  }
}

export default Partner;

