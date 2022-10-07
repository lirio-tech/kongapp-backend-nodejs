const axios = require('axios');
const { ObjectId } = require('mongodb');
const CompanySite = require('../../models/CompanySite.js');
const googleMapsClient = require('@google/maps').createClient({key: process.env.GOOGLE_MAPS_API_KEY});

const POSITION_STACK_API = 'http://api.positionstack.com/v1/forward?access_key=e8b98ba624e7ea8e16d7dab077dd88b1&query='
const ADDRESS_HOST_API = 'https://viacep.com.br'

module.exports.addressService = () => {
    return {             
        async getLatLngPositionStackByDescription(description) {
            console.log(`class=AddressService, M=getLatLngPositionStackByDescription, description=${description}`)
            try { 
                let url = POSITION_STACK_API+`${description}`;
                const response = await axios.get(url);
                return response.data;
            } catch(e) {
                console.log('Erro -> url='+url, e);
            }
        },
        async getAddressByLatLng(lat, lng) {
            let url = POSITION_STACK_API+`${lat},${lng}`;
            const response = await axios.get(url);
            console.log(response.data);
            return response.data;
        },
        async getAddressByCep(cep) {
            console.log(`class=AddressService, M=getAddressByCep, cep=${cep}`)
            let url = ADDRESS_HOST_API+`/ws/${cep.replace(/[^0-9]/g, "")}/json/`;
            const response = await axios.get(url);
            let address = {
                street: response.data.logradouro,
                district: response.data.bairro,
                city: response.data.localidade,
                state: response.data.uf,
                postalCode: response.data.cep,
            }    
            return address;      
        },
        async googleClientLocationByDescription(description, callback) {
            console.log(`class=AddressService, M=googleClientLocationByDescription, description=${description}`)
            return googleMapsClient.geocode({ address: description }, callback);
        },           
        async updateAddressLatitudeLongitude(siteId, address) {
            console.log(`class=AddressService, M=updateAddressLatitudeLongitude, siteId=${siteId}, address.description=${address.description}`)
            this.googleClientLocationByDescription(address.description, function(sts, results) {
                    if(results && results.status === 200 && results.json.results.length > 0) {
                        const lat = results.json.results[0].geometry.location.lat;
                        const lng = results.json.results[0].geometry.location.lng;
                        CompanySite.updateOne( { _id: ObjectId(siteId) }, { 'address.lat': lat, 'address.lng': lng }, it => console.log(it) );
                    }
                });
        }
    } 
}