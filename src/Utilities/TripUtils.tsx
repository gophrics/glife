
import { months, Page } from '../Modals/ApplicationEnums';
import { TripModal } from '../Modals/TripModal';
import { ImageDataModal } from '../Modals/ImageDataModal';
import { ClusterModal } from '../Modals/ClusterModal';
import { StepModal } from '../Modals/StepModal';
import { MapPhotoPageModal } from '../Modals/MapPhotoPageModal';
import * as PhotoLibraryProcessor from './PhotoLibraryProcessor';
import { ClusterProcessor } from './ClusterProcessor';
import { BlobSaveAndLoad } from './BlobSaveAndLoad';

const ServerURLWithoutEndingSlash = 'http://beerwithai.com'

export class TripUtils {

    static GenerateTripId = () : number => {
        return Math.random()*10000000
    }

    static GenerateHomeData = async(homeInfo: any) : Promise<number> => {

        var homes: Array<{latitude: number, longitude: number, timestamp: number}> = [];
        var homesDataForClustering: Array<unknown> = [];

        for(var element of homeInfo) {
            var res = await TripUtils.getCoordinatesFromLocation(element.name)
            res = res[0];
            homes.push({
                latitude: Number.parseFloat(res.lat),
                longitude: Number.parseFloat(res.lon),
                timestamp: (element.timestamp as number)
            })
            i++;
        }

        var endTimestamp = Math.ceil((new Date()).getTime()/8.64e7);
        homes.sort((a, b) => {
            return b.timestamp - a.timestamp;
        })

        for(var data of homes) {
            while(endTimestamp >= Math.floor(data.timestamp/8.64e7) && endTimestamp >= 0) {
                homesDataForClustering[endTimestamp] = data as ClusterModal;
                endTimestamp--;
            }
        }

        BlobSaveAndLoad.Instance.setBlobValue(Page[Page.NEWTRIP], { data: homesDataForClustering, endTimestamp: endTimestamp} );
    }

    static GenerateTripFromPhotos = async(imageData: ImageDataModal[]) : Promise<TripModal[]> => {
        var homesDataForClustering = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP]).data
        var endTimestamp = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP]).endTimestamp

        var clusterData: Array<ClusterModal> = PhotoLibraryProcessor.convertImageToCluster(imageData, endTimestamp)
        var trips = ClusterProcessor.RunMasterClustering(clusterData, homesDataForClustering);

        var tripResult: TripModal[] = [];

        if(trips.length == 0) throw "Not enough photos"

        var asynci = 0;
        for(var i = 0; i < trips.length; i++){

            try {
                var trip = trips[i]

                trip.sort((a: ClusterModal, b: ClusterModal) => {
                    return a.timestamp-b.timestamp
                });
                
                var _steps: StepModal[] = ClusterProcessor.RunStepClustering(trip);
                var _trip: TripModal = await TripUtils.PopulateTripModalData(_steps, TripUtils.GenerateTripId());
                tripResult.push(_trip)

                asynci++;

                if(asynci == trips.length) {
                    tripResult.sort((a, b) => {
                        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                    })
                }
            } catch(err) {
                i--;
            }
        }

        return tripResult;
    }

    
    static UpdateProfileDataWithTrip (profileData: MapPhotoPageModal, trip: TripModal) : MapPhotoPageModal {

        profileData.countriesVisited.push.apply(profileData.countriesVisited, trip.countryCode)
        let x = (countries: string[]) => countries.filter((v,i) => countries.indexOf(v) === i)
        profileData.countriesVisited = x(profileData.countriesVisited); // Removing duplicates
        profileData.percentageWorldTravelled = Math.floor(profileData.countriesVisited.length*100/186)

        var trips: TripModal[] = []
        for(var _trip of profileData.trips) {
            if(_trip.tripId == trip.tripId){ trips.push(trip); continue; }
            trips.push(_trip)
        }

        profileData.trips = trips

        return profileData
    }

    static async PopulateTripModalData (steps: StepModal[], tripId: number) {
        var tripResult : TripModal = new TripModal();
        var homesDataForClustering = BlobSaveAndLoad.Instance.getBlobValue(Page[Page.NEWTRIP]).data

        var homeStep = homesDataForClustering[Math.floor(steps[0].startTimestamp/8.64e7)-1]
        homeStep.timestamp = Math.floor(steps[0].startTimestamp - 8.64e7)

        var _stepModal: StepModal = ClusterProcessor.convertClusterToStep([homeStep])
        _stepModal.location = "Home";
        _stepModal.id = 0;
        tripResult.tripAsSteps.push(_stepModal)
        
        var i = 0;
        var countries: string[] = []
        var places: string[] = []

        for(var step of steps) {
            step.distanceTravelled = Math.floor(tripResult.tripAsSteps[i].distanceTravelled + 
                ClusterProcessor.EarthDistance({latitude: step.meanLatitude, longitude: step.meanLongitude} as ClusterModal,
                {latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal))
            tripResult.tripAsSteps.push(step);
            i++;
        }

        var homeStep2 = homesDataForClustering[Math.floor(steps[steps.length-1].endTimestamp/8.64e7)+1]
        homeStep2.timestamp = Math.floor(steps[steps.length-1].endTimestamp + 8.64e7)

        var _stepModal2: StepModal = ClusterProcessor.convertClusterToStep([homeStep2])
        _stepModal2.location = "Home";
        _stepModal2.distanceTravelled = Math.floor(tripResult.tripAsSteps[i].distanceTravelled + 
            ClusterProcessor.EarthDistance({latitude: _stepModal.meanLatitude, longitude: _stepModal.meanLongitude} as ClusterModal,
            {latitude: tripResult.tripAsSteps[i].meanLatitude, longitude: tripResult.tripAsSteps[i].meanLongitude} as ClusterModal))
        _stepModal2.id = 10000

        tripResult.tripAsSteps.push(_stepModal2)

        // Load locations
        for(var step of steps) {
            var result = await TripUtils.getLocationFromCoordinates(step.meanLatitude, step.meanLongitude)
            
            if(result && result.address && (result.address.county || result.address.state_district)) {
                step.location = result.address.county || result.address.state_district
                
                if(countries.indexOf(result.address.country) == -1) {
                    countries.push(result.address.country)
                }
                if(places.indexOf(step.location) == -1) {
                    places.push(step.location)
                }
                tripResult.countryCode.push((result.address.country_code as string).toLocaleUpperCase())
            }

            // Showing current weather now
            result = await TripUtils.getWeatherFromCoordinates(step.meanLatitude, step.meanLongitude)
            if(result && result.main) {
                if(step.location == "" ) {
                    step.location = result.name
                    places.push(step.location)
                }
                step.temperature = Math.floor(Number.parseFloat(result.main.temp)-273.15) + "ºC"
            }
        }

        tripResult.tripId = tripId;
        tripResult.populateAll();
        tripResult.populateTitle(countries, places);

        return  tripResult
    }     

    static getWeatherFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchweatherbylocation', {
            method: 'POST',
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            return res
        })
    }

    static getLocationFromCoordinates(latitude: number, longitude: number): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchcoordinates', {
            method: 'POST',
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        })
        .then((res) => {
            return res.json()
        }).then((res) => {
            return res
        })
    }

    static getCoordinatesFromLocation(location: string): Promise<any> {
        return fetch(ServerURLWithoutEndingSlash + '/api/v1/travel/searchlocation', {
            method: 'POST',
            body: JSON.stringify({
                location: location
            })
        })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            return res
        })
    }   

    static getDateFromTimestamp(timestamp: number): string {
        var date = new Date(timestamp)
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    }

}