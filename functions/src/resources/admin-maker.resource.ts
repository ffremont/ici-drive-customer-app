import { Request, Response } from 'express';
import { AppUtil } from '../apputil';
import { MakerDao } from '../dao/maker.dao';
import bunnyCdnService from '../services/bunnycdn.service';
import { Product } from '../models/product';
import { Config } from '../config';
import * as uuid from 'uuid-random';
import notificationService from '../services/notif.service';


class AdminMakerResource {

    private makerDao = new MakerDao();

    /**
     * Supp du CDN l'URL de la ressource
     * @param imageUrl 
     */
    private async removeFileOnCdn(imageUrl: string) {
        if (imageUrl && (imageUrl !== `${Config.getDefaultImageUrl()}`)) {
            AppUtil.info(`removeFileOnCdn > suppression ancienne image : ${imageUrl}`);
            try {
                await bunnyCdnService.delete(`${bunnyCdnService.baseURL}/${Config.bunnyCdnStorageName}${imageUrl.replace(Config.bunnyCdnPullZoneBaseURl, '')}`);
            } catch (e) {
                AppUtil.info(`removeFileOnCdn >  suppression impossible de ${imageUrl}`, e);
            }
        }
    }

    /**
     * Supprime l'ancienne image pour en uploader une nouvelle version
     * @param product 
     * @param originalname 
     * @param buffer 
     */
    private async safeUploadFile(product: Product, originalname: string, buffer: any): Promise<Product> {
        const newProduct = { ...product };
        await this.removeFileOnCdn(newProduct.image);

        const targetFilename = `${uuid()}.${originalname.substr(originalname.lastIndexOf('.') + 1)}`;
        AppUtil.debug(`safeUploadFile > targetFilename : ${targetFilename}`)
        try {
            await bunnyCdnService.upload(`${bunnyCdnService.baseURL}${Config.getBunnycdnStorageApiPath(targetFilename)}`, buffer);
            newProduct.image = `${Config.bunnyCdnImageUrl(targetFilename)}`;
        } catch (e) {
            AppUtil.error(`safeUploadFile > upload impossible, erreur technique ${targetFilename}`, e)
            newProduct.image = Config.getDefaultImageUrl();
        }

        AppUtil.debug(`safeUploadFile > target image url : ${newProduct.image}`);

        return newProduct;
    }

    /**
     * Supp un produit
     * @param request 
     * @param response 
     */
    public async deleteProduct(request: Request, response: Response) {
        try {
            const productRef = request.params.ref;
            if (!productRef) { throw 'Référence invalide' }

            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const maker = await this.makerDao.getFullByEmail(currentMakerEmail) as any;
            AppUtil.info(`deleteProduct > ref:${productRef}`);
            if (maker) {
                const product = maker.products.find((p:Product) => p.ref === productRef);
                
                try {
                    if(!product) throw 'produit introuvable : '+productRef;

                    try{
                        if(product.image){
                            AppUtil.debug(`call removeFileOnCdn with ${product.image}`)
                            await this.removeFileOnCdn(product.image);
                        }
                    }catch(e){
                        AppUtil.error(`deleteProduct > removeFileOnCdn impossible pour ${product.image}`,e)
                    }

                    await this.makerDao.delProduct(maker?.id, productRef);

                    maker.products = maker.products.map( (p:Product) => p.ref === productRef ? null : p).filter((p:Product) => p!==null);
                    const cats = maker.products.map((p: Product) => p.categoryId);
                    maker.categories = cats.filter((c: string, i: number) => cats.indexOf(c) === i);
                    await this.makerDao.setMaker(maker.id, {
                        categories: maker.categories
                    });
                } catch (e) {
                    AppUtil.error(`deleteProduct > Suppression du produit impossible, car inexistant ${productRef}`, e);
                }
            }
            AppUtil.ok(response);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

    public async updateProduct(request: Request, response: Response) {
        try {
            const productRef = request.params.ref;
            if (!productRef) { throw 'Référence invalide' }

            const files = (request as any).files;
            const file = files && files.length ? files[0]:null;

            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            let productForm = JSON.parse(request.body.data) as any;
            let product:any = file ? await this.safeUploadFile(productForm, file.originalname, file.buffer) : productForm;

            const maker: any = await this.makerDao.getFullByEmail(currentMakerEmail);
            await this.makerDao.addOrUpdateProduct(maker.id, productRef, product);

            maker.products = maker.products.map( (p:Product) => p.ref === productRef ? product : p);
            const cats = maker.products.map((p: Product) => p.categoryId);
            maker.categories = cats.filter((c: string, i: number) => cats.indexOf(c) === i);
            await this.makerDao.setMaker(maker.id, {
                categories: maker.categories
            });

            await notificationService.notifyMaker('updateProduct', maker);
            AppUtil.ok(response);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

    public async addProduct(request: Request, response: Response) {
        try {
            const files = (request as any).files;
            if (!files || !files.length) {
                AppUtil.badRequest(response, 'Image requise');
            }
            const file = files[0];
            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const maker: any = await this.makerDao.getFullByEmail(currentMakerEmail);
            const product = await this.safeUploadFile(JSON.parse(request.body.data) as any, file.originalname, file.buffer);

            if (!maker.products) maker.products = [];
            maker.products?.push(product);
            const cats = maker.products.map((p: Product) => p.categoryId);
            maker.categories = cats.filter((c: string, i: number) => cats.indexOf(c) === i);

            await this.makerDao.addOrUpdateProduct(maker.id, product.ref, product);
            await this.makerDao.setMaker(maker.id, {
                categories: maker.categories
            });
           
            await notificationService.notifyMaker('addProduct', maker);

            AppUtil.ok(response);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

    /**
     * Retourne le profil du producteur s'il est connu
     * @param request 
     * @param response 
     */
    public async getSelf(request: Request, response: Response) {
        try {
            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const maker = await this.makerDao.getFullByEmail(currentMakerEmail);

            if (maker) {
                AppUtil.ok(response, maker);
            } else {
                AppUtil.notFound(response);
            }
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }
}

export default new AdminMakerResource();