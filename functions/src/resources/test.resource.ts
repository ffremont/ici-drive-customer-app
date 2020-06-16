import { Request, Response } from 'express';
import context, { Context } from '../context';
import * as randomstring from 'randomstring';
import { Maker } from '../models/maker';
import { Product } from '../models/product';
import * as randomLocation from 'random-location';
import * as admin from 'firebase-admin';
import * as geohash from "ngeohash";
import { AppUtil } from '../apputil';
import * as moment from 'moment';

class TestResource {

    private static categories: any = ['viande', 'mer', 'fruit-leg'];
    private static placeNames: any = ['Place de la mairie', 'Parking du Super U', 'A notre ferme', 'Près de école A', 'Sous le pont B'];

    private static productImages: any = [
        'https://icidrive.b-cdn.net/soupe-de-poissons-coulis-de-homard-bouteille-50cl-produit-terroir-de-la-mer.jpg',
        'https://icidrive.b-cdn.net/produit_unite_Rillette_Saumon_90g.jpg',
        'https://icidrive.b-cdn.net/ob_b9d902_roumanie-2018-produit-du-terroir-froma.PNG',
        'https://icidrive.b-cdn.net/miel.jpg',
        'https://icidrive.b-cdn.net/large.jpg',
        'https://icidrive.b-cdn.net/choux_fleur.jpg',
        'https://icidrive.b-cdn.net/carotte.jpg',
        'https://icidrive.b-cdn.net/bread-2193537_640.jpg',
        'https://icidrive.b-cdn.net/aperitif-1246311_1280.jpg'
    ];

    private static placeImages: any = [
        'https://icidrive.b-cdn.net/femre_a.jpg',
        'https://icidrive.b-cdn.net/ferme_b.jpg',
        'https://icidrive.b-cdn.net/ferme_c.jpg',
        'https://icidrive.b-cdn.net/ferme_d.jpg',
        'https://icidrive.b-cdn.net/parking_a.jpg'
    ];

    private static products: any = [
        {
            label: 'Carotte',
            ref: 'R+' + randomstring.generate(5),
            description: 'Taille moyenne et grande',
            categoryId: 'fruit-leg',
            image: 'https://icidrive.b-cdn.net/carotte.jpg',
            maxInCart: 4,
            topOfList:true,
            available: true,
            price: 2.4
        },{
            label: 'Coulis de la mer',
            ref: 'R+' + randomstring.generate(5),
            description: 'Délieux !',
            categoryId: 'mer',
            image: 'https://icidrive.b-cdn.net/soupe-de-poissons-coulis-de-homard-bouteille-50cl-produit-terroir-de-la-mer.jpg',
            maxInCart: 4,
            volume:0.5,
            topOfList:true,
            available: true,
            price: 2.4
        },{
            label: 'Pain',
            ref: 'R+' + randomstring.generate(5),
            description: 'Croustillant, croustillant !',
            categoryId: 'epiceries',
            image: 'https://icidrive.b-cdn.net/bread-2193537_640.jpg',
            maxInCart: 4,
            weight:200,
            available: true,
            topOfList:false,
            price: 1.3
        }, {
            label: 'Miel liquide',
            ref: 'R+' + randomstring.generate(5),
            description: 'Très parfumé et délicieusement sucré',
            categoryId: 'epiceries',
            topOfList:false,
            image: 'https://icidrive.b-cdn.net/miel.jpg',
            maxInCart: 4, available: true, price: 4.1
        },{
            label: 'Rillette de saumon',
            ref: 'R+' + randomstring.generate(5),
            description: 'Très parfumé et délicieusement sucré',
            weight: 120,
            topOfList:true,
            categoryId: 'epiceries',
            image: 'https://icidrive.b-cdn.net/produit_unite_Rillette_Saumon_90g.jpg',
            maxInCart: 4, available: true, price: 3
        }, {
            label: 'Choux fleur',
            ref: 'R+' + randomstring.generate(5),
            description: 'Grosse taille',
            categoryId: 'fruit-leg',
            topOfList:false,
            image: 'https://icidrive.b-cdn.net/choux_fleur.jpg',
            maxInCart: 4, available: true, price: 3.1
        },{
            label: 'Fromage frais',
            ref: 'R+' + randomstring.generate(5),
            description: 'Ferme et fondant',
            weight: 160,
            topOfList:true,
            categoryId: 'laitiers',
            image: 'https://icidrive.b-cdn.net/ob_b9d902_roumanie-2018-produit-du-terroir-froma.PNG',
            maxInCart: 4, available: true, price: 5.1
        },{
            label: 'Jus de pomme fermier',
            ref: 'R+' + randomstring.generate(5),
            description: 'Sucré, doux, idéal pour les grands et les petits',
            volume: 0.75,
            topOfList:true,
            categoryId: 'boissons',
            image: 'https://icidrive.b-cdn.net/apple-cider-4676465_640.jpg',
            maxInCart: 4, available: true, price: 2.1
        }
    ]
    private static makerIds : any = [{
        image : 'https://icidrive.b-cdn.net/man-person-portrait-sunset-23876.jpg',
        description: 'Producteur de fruits et de légumes en deux sèvres depuis 1999',
        name: 'Mickael, GAEC terre noire'
    },{
        image: 'https://icidrive.b-cdn.net/photo-of-woman-planting-vegetables-1023397.jpg',
        description: 'Apicultrice et éleveuse de chèvres près de Niort',
        name: 'Alice, la lentille d\'o'
    },{
        image : 'https://icidrive.b-cdn.net/man-field-rice-colombia-50715.jpg',
        description: 'Maraîcher et aussi producteur laitier près d\'Aiffres ',
        name: 'Patrice, Céréalia79'
    }];

     shuffle(a:any) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    public randomMaker(): Maker {
        const cats: any = {};

        const rPoint = randomLocation.randomCircumferencePoint({
            latitude: 46.311472,
            longitude: -0.523594
        }, 100 * 100);

        const makerId :any= this.shuffle(TestResource.makerIds)[0]
        const products : any = this.shuffle(TestResource.products);
        const realProducts = [];
        const nbProducts = Math.floor(Math.random() * products.length);
        for(let i = 0; i < nbProducts; i++){
            realProducts.push(products[i]);
            cats[products[i].categoryId] = 1;
        }

        return {
            id: randomstring.generate({ length: 13, readable: true, capitalization: 'uppercase' }),
            email: `${randomstring.generate({ length: 10, readable: true })}@gmail.com`,
            name: makerId.name,
            created: (new Date()).getTime(),
            webPage: `http://google.fr`,
            phone: randomstring.generate({ length: 10, charset: 'numeric' }),
            description: makerId.description,
            prefixOrderRef: 'REF_',
            image: makerId.image,
            categories: Object.keys(cats),
            payments: {
                acceptCoins: true,
                acceptCards: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }), 10) % 2 === 0,
                acceptBankCheck: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }), 10) % 3 === 0,
                acceptPaypal: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }), 10) % 2 === 0
            },
            place: {
                label: TestResource.placeNames[Math.floor(Math.random() * TestResource.placeNames.length)],
                address: `13 rue de la ${randomstring.generate(7)} ${randomstring.generate({ length: 5, charset: 'numeric' })} à ${randomstring.generate(6)}`,
                description: randomstring.generate(50),
                image: TestResource.placeImages[Math.floor(Math.random() * TestResource.placeImages.length)],
                slotsDescription: "Ouvert habituellement la semaine et le week-end",
                point: {
                    latitude: rPoint.latitude,
                    longitude: rPoint.longitude,
                    geohash: geohash.encode(rPoint.latitude, rPoint.longitude)
                },
                hebdoSlot: {
                    "lundi": { "openAt": "8:00", "closeAt": "12:00" },
                    "mardi": { "openAt": "11:00", "closeAt": "12:00" },
                    "mercredi": { "openAt": "8:00", "closeAt": "12:00" },
                    "vendredi": { "openAt": "8:00", "closeAt": "12:00" },
                    "samedi": { "openAt": "8:00", "closeAt": "12:00" }
                }
            }
        };
    }

    public randomProduct(): Product {
        return {
            label: randomstring.generate(15),
            ref: 'R+' + randomstring.generate(5),
            description: randomstring.generate(30),
            categoryId: TestResource.categories[Math.floor(Math.random() * TestResource.categories.length)],
            image: TestResource.productImages[Math.floor(Math.random() * TestResource.productImages.length)],
            maxInCart: 4,
            topOfList:true,
            available: true,
            price: parseInt(randomstring.generate({ length: 1, charset: 'numeric' }), 10),

        };
    }


    public async test(request: Request, response: Response) {
            AppUtil.ok(response, moment(1592640000000).format('ddd D MMM à HH:mm'))
    }

    public async findAll(request: Request, response: Response) {
        const snapshot = await context.db().collection(Context.MAKERS_COLLECTION).limit(1).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
        response.send("findAll");
    }

    public async testFcm(request: Request, response: Response){
        const r = await admin.messaging().send({
            token: request.body,
            data: {
                url : 'https://google.fr',
                title: 'hello',
                body:'florent',
                icon:'https://app.ici-drive.fr/default_image.jpg'
              }
        })
        console.log('Successfully sent message:', r);
        AppUtil.ok(response);
    }

    public async addAmaker(request: Request, response: Response){
        const aMaker = request.body as any;

        const myRef = await context.db().collection(Context.MAKERS_COLLECTION).doc(aMaker.id);
        await myRef.set(aMaker);

        response.send('created '+aMaker.id);
    }

    public async add(request: Request, response: Response) {
        const aMaker: Maker = this.randomMaker();

        const myRef = await context.db().collection(Context.MAKERS_COLLECTION).doc(aMaker.id);
        await myRef.set(aMaker);

        for (let i = 0; i < 4; i++) {
            const p = this.randomProduct();
            const refProd = await myRef.collection(Context.MAKERS_PRODUCTS_COLLECTION).doc(p.ref);
            await refProd.set(p);
        }

        response.send(JSON.stringify(aMaker));
    }

}

export default new TestResource();