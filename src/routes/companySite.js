const router = require('express').Router();
const Company = require('../models/Company');
const authorization = require('../middleware/auth-middleware');
const { ObjectId } = require('mongodb');
const CompanySite = require('../models/CompanySite.js');
const addressService = require('../services/address/addressService').addressService();
const companySiteService = require('../services/CompanySiteService.js').companySiteService();

const AWS = require('aws-sdk')

const s3sourceCredentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET,
});

const s3Client = new AWS.S3({
  endpoint: process.env.BUCKET_URL,
  credentials: s3sourceCredentials,
  sslEnabled: false,
  maxRetries: 0,
  httpOptions: { timeout: 0 },
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.AWS_REGION_KG
});

router.put('/:_idCompany/site-info', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
    console.log('PUT /:_idCompany/site-info', req.params._idCompany)
    const companyId = req.params._idCompany;
    req.body.arroba = req.body.arroba.toLowerCase();

    let _count = await CompanySite.count({ companyId: { $ne: ObjectId(companyId) }, arroba:  req.body.arroba });

    if(_count && _count > 0) {
        return res.status(422).json({message: 'Link não disponivel, por favor escolha um outro!'});        
    }

    let exists = await CompanySite.count({ companyId: ObjectId(companyId) });

    if(exists > 0) { 
          // Update
          companySiteService.updateInfos(companyId, req.body);
          console.log('CompanySite updated success!!!'); 
          return res.status(200).json({message: 'CompanySite updated success!!!'});    
    } else {
      // Novo
      const cmpn = await Company.findOne({ _id: ObjectId(companyId) })

      let companySite = companySiteService.getNewCompanySite(cmpn, ''); 
      companySite.facebook = req.body.facebook;
      companySite.instagram = req.body.instagram;
      companySite.whatsapp = req.body.whatsapp;
      companySite.arroba = req.body.arroba;

      const companySt = await new CompanySite(companySite).save();
      console.log('CompanySite saved success!!!');
      res.status(201).json(companySt);
    }
  } catch (error) {
    console.error('api-error:: company :: put site-info', error);
    res.status(500).send(error);
  }
});

router.patch('/:_idCompany/site-info/:_idSite', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
      console.log('PATCH /:_idCompany/site-info/:_idSite', req.params._idCompany, req.params._idSite)
      const companyId = req.params._idCompany;
      let companySite = req.body;
      companySite.arroba = companySite.arroba.toLowerCase(); // TODO ER Filtra sujeira --> centralizar

      if(companySiteService.isUsedArrobaByOtherCompany(companyId, companySite.arroba) === true) {
          return res.status(422).json({message: 'Link não disponivel, por favor escolha um outro!'});        
      }

      if(companySite.address && 
         companySite.address.street && 
         companySite.address.district && 
         companySite.address.city && 
         companySite.address.state
      ) { 
          companySite.address.description = `${companySite.address.street}, ${companySite.address.number} - ${companySite.address.district} - ${companySite.address.city} - ${companySite.address.state}`
      }
      // Update
      await companySiteService.updateInfos(companyId, companySite);
     
      // async
      await addressService.updateAddressLatitudeLongitude(req.params._idSite, companySite.address);

      console.log('CompanySite updated success!!!');
      return res.status(200).json(companySite);
  } catch (error) {
    console.error('api-error:: company :: put site-info', error);
    res.status(500).send(error);
  }
});

router.get('/:_idCompany/site-info', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
    console.log('GET /:_idCompany/site-info', req.params._idCompany)
    const companyId = req.params._idCompany;
    let site = await CompanySite.findOne({ companyId: ObjectId(companyId) });
    return res.status(200).json(site);
  } catch (error) {
    console.error('api-error:: company :: get site-info', error);
    return res.status(500).send(error);
  }
});

router.get('/site-info/discovery/origin/app', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  try {
    console.log('GET /site-info/discovery/origin/app', req.query.hostname)
    const hostname = req.query.hostname;
    let __site = null;

    if (
      String(hostname).includes('.kongbarber.com') || 
      String(hostname).includes('.ladyapp.com.br') || 
      String(hostname).includes('.kongapp.com.br')
    ) {
      let _arroba = hostname.replace('.kongbarber.com', '').replace('.ladyapp.com.br', '').replace('.kongapp.com.br', '');
      console.log('arroba ==> ', _arroba);
      __site = await CompanySite.findOne({ arroba: _arroba });
    }

    if(!__site) {
      __site = await CompanySite.findOne({ domain: hostname });
    }

    if(!__site && req.query.hostname === 'www.kongbarber.com') {
      __site = await CompanySite.findOne({ arroba: 'kong' });
    }

    console.log('__site ==> ', __site);
    if(__site) {
      return res.status(200).json(__site);
    } else {
      return res.status(404).json({message: `Site ${hostname} não Sincronizado, entre em contato com o Aplicativo`});    
    }
    
  } catch (error) {
    console.error('api-error:: company :: get /site-info/discovery/origin/app', error);
    return res.status(500).send(error);
  }
});

router.get('/:arroba/site-info/arroba', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  console.log('GET /:arroba/site-info/arroba', req.params.arroba)
  try {
    // if plan free ou plano vencido ---> devolve Site Default, flagVencido e message no responseBody
    let site = await CompanySite.findOne({ arroba: req.params.arroba });
    let company = await Company.findOne({ _id: ObjectId(site.companyId) });
    return res.status(200).json({ companySite: site, company: company });
  } catch (error) {
    console.error('api-error:: company :: get site-info-arroba', error);
    return res.status(500).send(error);
  }
});

router.patch('/site-info/:_siteId/upload-cover', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  console.log(`PATCH /site-info/${req.params._siteId}/upload-cover`)
  try {
      let siteId = req.params._siteId;
      let sitePhotoCover = req.body;

      const companySite = await CompanySite.findOne( { _id: siteId } );
      const photoName = await uploadS3(sitePhotoCover.photoCover, `${companySite.arroba}_${new Date().getTime()}_cover.jpg`);
      const urlImage = getUrlImage(photoName);
      await companySiteService.updatePhotoCover(companySite._id, urlImage);

      console.log('Upload Photo Cover - S3 success!!!');
      return res.status(200).json({urlImage: urlImage});  
  } catch (error) {
    console.error('api-error:: companySite :: patch Upload Photo S3', error);
    res.status(500).send(error);
  }
});

router.patch('/site-info/:_siteId/upload-photo-gallery/:_photoGalleryId', authorization(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  console.log(`PATCH /site-info/${req.params._siteId}/upload-photo-gallery/${req.params._photoGalleryId}`)
  try {
      const siteId = req.params._siteId;
      const photoGalleryId = req.params._photoGalleryId.trim();
      let sitePhotoGallery = req.body;

      const companySite = await CompanySite.findOne( { _id: siteId } );
      let photosGallery = companySite.photos;

      const photoName = await uploadS3(sitePhotoGallery.photoGallery, `${companySite.arroba}_${new Date().getTime()}_gallery.jpg`);

      for(let i in photosGallery) {
         if(photosGallery[i]._id == photoGalleryId) {
            console.log(`process.env.BUCKET_URL=${getUrlImage(photoName)}, photoName=${photoName}`);
            photosGallery[i].photo = getUrlImage(photoName);
         }
      }      
      await companySiteService.updatePhotosGallery(companySite._id, photosGallery);

      console.log('Upload Photo Gallery S3 success!!!');
      return res.status(200).json(photosGallery);
  } catch (error) {
    console.error('api-error:: companySite :: patch Upload Photo S3', error);
    res.status(500).send(error);
  }
});

function getUrlImage(photoName) {
  if(process.env.BUCKET_NAME === 'dev-konglify') { 
      return process.env.BUCKET_URL + process.env.BUCKET_NAME + '/' + photoName;
  }
  return process.env.BUCKET_URL + photoName;
}

async function uploadS3(photo, photoName) {
  console.log(`M=uploadS3, photo=${photo.substring(0,5)}(BASE64), photoName=${photoName}, region=${process.env.AWS_REGION_KG}, bucket=${process.env.BUCKET_NAME}`)
  return new Promise(function(resolve, reject) { 
    let buffer = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ""),'base64'); 

    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: photoName,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    }

    s3Client.putObject(params, function(err, data) {
      if(err) { 
        console.log(err);
        reject(err);
      }
      console.log('success')
      resolve(photoName);
    });
  });
}

module.exports = router;