import {Request,Response} from 'express';
import context, {Context} from '../context';

class TestResource{

    public async findAll(request:Request, response:Response){ 
        const snapshot = await context.db().collection(Context.MAKERS_COLLECTION).limit(1).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });
        response.send("findAll");
    }

    public async add(request:Request, response:Response){ 
        const myRef = await context.db().collection(Context.MAKERS_COLLECTION).doc('AB7');
        const result = await myRef.set({
            "email": "ff.fremont.florent@gmail.com",
            "id": "AB7",
            "name":"GAEC de terre noire",
            "webPage": "https://www.acheteralasource.com/producteur/77782",
            "description":"Producteur de fruits et de légume en deux-sèvres",
            "image" : "https://icidrive.b-cdn.net/20200421_062257_0000%20(1).png",
            "prefixOrderRef": "REF_GAEG79_",
            "phone": "0101010110",
            "place": {
                "label": "Parking de terre noire",
                "address" : "5 rue de la terre, 79000 Niort",
                "description": "Situé près de la rocade Sud de Niort, au calme.",
                "image":"https://icidrive.b-cdn.net/normandie-ferme-bio-grande-suardiere.jpg",
                "slotsDescription": "Ouvert habituellement la semaine et le week-end",
                "hebdoSlot": {
                    "lundi": {"openAt": "8:00", "closeAt": "12:00"},
                    "mardi": {"openAt": "8:00", "closeAt": "12:00"},
                    "mercredi": {"openAt": "8:00", "closeAt": "12:00"},
                    "jeudi": {"openAt": "8:00", "closeAt": "12:00"},
                    "vendredi": {"openAt": "8:00", "closeAt": "12:00"},
                    "samedi": {"openAt": "8:00", "closeAt": "12:00"},
                    "dimanche": {"openAt": "8:00", "closeAt": "18:00"}
                }
            },
            "categories": [
                { "label": "Boeuf / Veau", "id": "boeuf-veau"},
                { "label": "Volaille / Lapin", "id": "volaille-lapin"},
                { "label": "Agneau / Porc", "id": "agneau-porc"},
                { "label": "Charcuterie", "id": "charcuterie"},
                { "label": "Boisson / Vin", "id": "boisson-vin"},
                { "label": "Epicerie", "id": "epicerie"},
                { "label": "Fromage", "id": "fromage"},
                { "label": "Pâtes / Légumineuses", "id": "pates-leg"},
                { "label": "Glace", "id": "glace"},
                { "label": "Fruit / Légume", "id": "fruit-leg"},
                { "label": "Mer", "id": "mer"},
                { "label": "Miel", "id": "miel"},
                { "label": "Crèmerie", "id": "cremerie"}
            ]
        });
        console.log(result);

        /*const snapshot = await context.db().collection(Context.MAKERS_COLLECTION).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });*/
        response.send("Hello from Firebase!");
    }

}

export default new TestResource();