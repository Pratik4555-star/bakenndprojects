const asynchandler = (requetsHandler)=>{
(req,res,next)=>{
    Promise.resolve(requetsHandler(req,res,nexr)).catch((err)=>next(err))
}

}

export default asynchandler



// const asynchandler = (fn)=> async(req,res,next)=>{
//     try{
//         await fn(res,res,next)

//     }
//     catch(error){
//         res.status(err.code || 500).json({
//             success:false,
//             message: err.message
//         })
//     }
// }