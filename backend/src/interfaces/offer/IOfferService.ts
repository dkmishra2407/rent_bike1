import { IOffer } from "../../models/offerModel";
import { BikeData } from "../BikeInterface";

export interface IOfferService{
    saveOffer(newOffer:IOffer):Promise<IOffer>
    viewOffer(userId:string):Promise<IOffer[]>
    deleteOffer(offerId:string):Promise<IOffer>
    updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null>;
    findBikeAndOffer(bikeId:string,offerId:string):Promise<any>;
    removeOffer(bikeId:string):Promise<any>
}
