const { ObjectId } = require("mongodb");
const CompanySite = require('../models/CompanySite.js');
 
module.exports.companySiteService = () => {
    return {        
        getNewCompanySite(company, phone_number) {
            return {
                companyId: company._id,
                title: company.name,
                description: "A Melhor Barbearia da Região !!!",
                whatsapp: phone_number,
                arroba: company.shortName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + '-' + Math.trunc((Math.random() * (999999 - 1) + 1)),
                photoCover: 'https://diaonline.ig.com.br/wp-content/uploads/2019/07/pexels-photo-2061820-e1562358681668.jpeg',
                photos: [
                    { photo: 'http://catalaocontabilidade.com.br/blog/wp-content/uploads/2019/07/como-montar-uma-barbearia.jpg' },
                    { photo: 'https://www.daquibh.com.br/wp-content/uploads/sites/34/2017/08/Fonte_Pixabay.jpg' },
                    { photo: 'https://diaonline.ig.com.br/wp-content/uploads/2019/07/barbearia-em-braslia_8.jpg', },
                    { photo: 'https://atendimento.sebrae-sc.com.br/wp-content/uploads/2020/12/sebrae_post227-1024x691.jpg', },
                    { photo: 'https://www.totalconstrucao.com.br/wp-content/uploads/2020/04/decoracao-de-barbearia-2.jpg', },
                    { photo: 'https://i.pinimg.com/originals/3e/ae/24/3eae24855b03862435f9430cd3f2e815.jpg', },
                    { photo: 'https://www.naadv.com.br/wp-content/uploads/2019/08/aumentar-lucro-barbearia.jpg', },
                    { photo: 'https://i0.wp.com/4maos.com.br/wp-content/uploads/2021/06/nomes-para-barbearia-4-maos.jpg', },
                    { photo: 'http://hinova.com.br/wp-content/uploads/2017/07/Barbearia.jpg',},
                ],
                OpenAt: {
                    sunday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    monday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    tuesday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    wednesday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    thursday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    friday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                    saturday: { isOpen: true, timeStartAt: "07:00", timeEndAt: "22:00", },
                },
                address: {
                    lat: -14.1738762,
                    lng: -49.5344501,
                    description: 'Brasil'
                }
            }
        },             
        async isUsedArrobaByOtherCompany(myCompanyId, arroba) {
            let _count = await CompanySite.countDocuments({ companyId: { $ne: ObjectId(myCompanyId) }, arroba:  arroba });
            if(_count > 0) {
                return true;      
            }
            return false;
        },   
        async updateInfos(companyId, companySite) {
            console.log(`class=CompanySiteService, M=updateInfos, companyId=${companyId}`)
            await CompanySite 
            .updateOne({
                companyId: ObjectId(companyId) 
              }, { 
                facebook: companySite.facebook,
                instagram: companySite.instagram,
                whatsapp: companySite.whatsapp, 
                arroba: companySite.arroba,
                title: companySite.title,
                description: companySite.description,
                address: companySite.address,
                openAt: companySite.openAt,
              }
            );
        },     
        async updatePhotoCover(companySiteId, photoCoverUrl) {
            console.log(`class=CompanySiteService, M=updatePhotoCover, companySiteId=${companySiteId}, photoCoverUrl=${photoCoverUrl}`)
            await CompanySite.updateOne({ _id: ObjectId(companySiteId) }, { photoCover: photoCoverUrl,});            
        },
        async updatePhotosGallery(companySiteId, photosGallery) {
            console.log(`class=CompanySiteService, M=updatePhotosGallery, companySiteId=${companySiteId}, photosGallery.length=${photosGallery.length}`)
            await CompanySite.updateOne({ _id: ObjectId(companySiteId) }, { photos: photosGallery,});            
        }                      
    } 
}