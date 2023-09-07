`use strict`;

const firebase=require('../db');
const firestore =firebase.firestore();


// module.exports={
//     getAllBuses
// }

module.exports.getAllBuses=async(req,res)=>{
    console.log('checking from console')
    // res.send('checking')
    try{
        const buses=await firestore.collection('buses');
        const data=await buses.get();
        const busesArray=[];
        if(data.empty){
            res.status(404).send("No buses record found");
        }else{
            console.log('Data found')
            //send the found data
            data.forEach(doc=>{
                const bus={
                    id:doc.id,
                    data:doc.data()
                };
                busesArray.push(bus);
            }
            );
            res.send(busesArray);
            
        }
    }catch(error){
        res.status(400).send(error.message);
        };
}

// now to fetch the data of specific bus
module.exports.getBus=async(req,res)=>{
    try{
        const id=req.params.id;
        const bus=await firestore.collection('buses').doc(id);
        const data=await bus.get();
        if(!data.exists){
            res.status(404).send("Bus with the given ID not found");
        }else{
            res.send(data.data());
        }
    }catch(error){
        res.status(400).send(error.message);
    }
}

//now to fetch the sub collection of specific bus
module.exports.getBusStops=async(req,res)=>{
    // try{
        const id=req.params.id;
        const bus=await firestore.collection('buses').doc(id).collection('stops');
        // const data=await bus.get();
        // if(data.empty){
        //     res.status(404).send("Bus with the given ID not found");
        // }else{
        //     res.send(data.data());
        // }
        let stops=[]
        bus.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // Access data for each document in the subcollection
            const stopData = doc.data().distanceFromInitialStop;
            //access the document id
            const stopId=doc.id;
            console.log("Stop name:",stopId)
            console.log("Stop data:", stopData);
            //I want to send an object array of this data as a response
            // stops[stopId]=stopData;
            const temp=[stopId,stopData]
            stops.push(temp)
            });
            res.send(stops);
        })
        .catch((error) => {
            console.error("Error getting bus stops:", error);
        });
    // }catch(error){
    //     res.status(400).send(error.message);
    // }
}

//now to calculate the fare, need to take 2 stops and return the fare
module.exports.getFare=async(req,res)=>{
    try{
        //need to take 2 stops as input
        // const initial_stop=req.body.initial_stop;
        // const final_stop=req.body.final_stop;
        // const id=req.body.id;
        const{id,initial_stop,final_stop}=req.body;
        const bus=await firestore.collection('buses').doc(id).collection('stops');

        let stops=[]
        let stops2={}
        let d1,d2
        bus.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // Access data for each document in the subcollection
            const stopData = doc.data().distanceFromInitialStop;
            //access the document id
            const stopId=doc.id;
            if(stopId==initial_stop)
            {
                 d1=stopData;
            }
            else if(stopId==final_stop)
            {
                 d2=stopData;
            }
            console.log("Stop name:",stopId)
            console.log("Stop data:", stopData);
            //I want to send an object array of this data as a response
            // stops2[stopId]=stopData;
            // console.log(stops2)
            const temp={"stop":stopId,"distance":stopData}
            stops.push(temp)
            
            });
            //calculate the price according to the distance between initial and final stop
            const ceil_fare=Math.ceil(d2-d1)
            const fare=10+(ceil_fare*5)
            console.log(fare)
            // res.status(201).send(fare)
            const res_fare={
                            "Fare":fare,
                            "From":initial_stop,
                            "To":final_stop,
                            "Bus":id
                        };
            res.send(res_fare);
        })
        .catch((error) => {
            console.error("Error getting bus stops:", error);
        });
    }catch(error){
        res.status(400).send(error.message);
    }
}