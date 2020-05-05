import { Request, Response } from 'express';
import context, { Context } from '../context';
import * as randomstring from 'randomstring';
import { Maker } from '../models/maker';
import { Product } from '../models/product';
import * as randomLocation from 'random-location';
import * as geohash from "ngeohash";

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
    private static makerImages: any = [
        'https://icidrive.b-cdn.net/2019-03-01.jpg',
        'https://icidrive.b-cdn.net/35913-bienvenue-ferme-carte-interactive-acheter-directement-chez-producteur.png',
        'https://icidrive.b-cdn.net/IMG_4136-1-854x641.jpg',
        'https://icidrive.b-cdn.net/unnamed.jpg',
        'https://icidrive.b-cdn.net/20200421_062257_0000%20(1).png'
    ];

    public randomMaker(): Maker {
        const cats: string[] = [];
        cats.push(TestResource.categories[Math.floor(Math.random() * TestResource.categories.length)]);
        cats.push(TestResource.categories[Math.floor(Math.random() * TestResource.categories.length)]);

        const rPoint = randomLocation.randomCircumferencePoint({
            latitude: 46.311472,
            longitude: -0.523594
        },100*100)

        return {
            id: randomstring.generate({ length: 13, readable: true, capitalization: 'uppercase' }),
            email: `${randomstring.generate({ length: 10, readable: true })}@gmail.com`,
            name: randomstring.generate({ length: 10, readable: true }),
            created: (new Date()).getTime(),
            webPage: `http://google.fr`,
            phone: randomstring.generate({ length: 10, charset: 'numeric' }),
            description: randomstring.generate(50),
            prefixOrderRef: 'REF_',
            image: TestResource.makerImages[Math.floor(Math.random() * TestResource.makerImages.length)],
            categories: cats,
            payments: {
                acceptCoins: true,
                acceptCards: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }),10) % 2 === 0,
                acceptBankCheck: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }),10) % 3 === 0,
                acceptPaypal: parseInt(randomstring.generate({ length: 5, charset: 'numeric' }),10) % 2 === 0
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
            available: true,
            price: parseInt(randomstring.generate({ length: 1, charset: 'numeric' }), 10),

        };
    }


    public async findAll(request: Request, response: Response) {
        const snapshot = await context.db().collection(Context.MAKERS_COLLECTION).limit(1).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
        response.send("findAll");
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