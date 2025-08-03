import { IOfferService } from "../interfaces/offer/IOfferService";
import { IOfferRepository } from "../interfaces/offer/IOfferRepository";
import { IOffer } from "../models/offerModel";
import mongoose from "mongoose";
import { BikeData } from "../interfaces/BikeInterface";



class offerServices implements IOfferService {
    constructor(private offerRepository: IOfferRepository) { }

    async saveOffer(newOffer: IOffer): Promise<IOffer> {
        try {
            const save = await this.offerRepository.saveOffer(newOffer)
            return save
        } catch (error) {
            throw error
        }
    }

    async viewOffer(userId: string): Promise<IOffer[]> {
        try {
            return await this.offerRepository.viewOffer(userId)
        } catch (error) {
            throw error
        }
    }

    async deleteOffer(offerId: string): Promise<IOffer> {
        try {
            return await this.offerRepository.deleteOffer(offerId)
        } catch (error) {
            throw error
        }
    }

    async updateOffer(offerId: string, updatedData: Partial<IOffer>): Promise<IOffer | null> {
        try {
            return this.offerRepository.updateOffer(offerId, updatedData);
        } catch (error) {
            throw error
        }
    }

    async findBikeAndOffer(bikeId: string, offerId: string): Promise<any> {
        try {
            const bike = await this.offerRepository.findBike(bikeId)
            console.log(11, bike)
            const offer = await this.offerRepository.findOffer(offerId)
            console.log(22, offer);

            if (!bike || !offer) {
                throw new Error("Bike or Offer not found");
            }

            const offerPrice = bike.rentAmount - (bike.rentAmount * (offer.discount / 100));
            console.log(333, offerPrice)

            const updatedBike = await this.offerRepository.updateBike(bikeId, {
                offerApplied: true,
                offer: new mongoose.Types.ObjectId(offerId),
                offerPrice: offerPrice
            });

            console.log("Bike updated successfully:", updatedBike);
            return updatedBike;

        } catch (error) {
            throw error
        }
    }

    async removeOffer(bikeId: string): Promise<any> {
        try {
            const updatedBike = await this.offerRepository.updateBike(bikeId, {
                offerApplied: false,
                offer: undefined,
                offerPrice: 0
            });
            return updatedBike;
        } catch (error) {
            throw error
        }
    }



}

export default offerServices;