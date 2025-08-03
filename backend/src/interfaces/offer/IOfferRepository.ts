import { IOffer } from "../../models/offerModel";
import { BikeData } from "../BikeInterface";

export interface IOfferRepository {
    saveOffer(newOffer: IOffer): Promise<IOffer>
    viewOffer(userId: string): Promise<IOffer[]>
    deleteOffer(offerId: string): Promise<IOffer>
    updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null>;
    findOffer(offerId: string): Promise<IOffer | null>
    findBike(bikeId: string): Promise<BikeData | null>
    updateBike(bikeId: string, updateData: Partial<BikeData>): Promise<BikeData | null>

}
