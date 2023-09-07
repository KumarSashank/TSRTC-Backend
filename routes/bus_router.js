const {Router}=require("express");
const router=Router()

const {getAllBuses,getBus,getBusStops,getFare}=require('../controllers/bus-controller');
// router.get('/buses',getAllBuses);
router.get('/buses',getAllBuses);
router.get('/buses/:id',getBus);
router.get('/buses/:id/stops',getBusStops);
router.get('/getFare',getFare);

module.exports=router;