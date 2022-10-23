const addressService = require('../services/address/addressService').addressService();
const router = require('express').Router();

router.get('/cep/:cep', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const address = await addressService.getAddressByCep(req.params.cep);
      res.status(200).json(address); 
    } catch (error) {
      console.error(`api-error:: /address/cep/:cep :: get ${req.params.cep}`, error);
      res.status(500).send(error);
    }    
});

router.get('/search', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const data = await addressService.getLatLng(req.query.q)
      res.status(200).json(data); 
    } catch (error) {
      console.error(`api-error:: /address/search :: get ${req.params.cep}`, error); 
      res.status(500).send(error);
    }    
});

router.get('/lat-lng/:lat/:lng', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  
  try {
      const data = await addressService.getAddressByLatLng(req.params.lat, req.params.lng);
      res.status(200).json(data); 
    } catch (error) {
      console.error(`api-error:: /address/lat-lng/:lat/:lng :: get ${req.params.cep}`, error);
      res.status(500).send(error);
    }    
});

module.exports = router;
