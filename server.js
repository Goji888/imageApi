const express=require("express")
const axios=require("axios")
const sharp=require("sharp")

const app=express()
const PORT=3000

app.get("/image-to-rgb",async(req,res)=>{
  try{
    const imageUrl=req.query.url
    const size=parseInt(req.query.size)||100
    if(!imageUrl)return res.status(400).json({error:"No image URL provided."})
    const response=await axios({url:imageUrl,responseType:"arraybuffer"})
    const resizedImage=await sharp(response.data)
      .resize(size,size,{fit:"cover"})
      .toBuffer()
    const {data,info}=await sharp(resizedImage).raw().toBuffer({resolveWithObject:true})
    const pixels=[]
    for(let i=0;i<data.length;i+=3){
      pixels.push([data[i],data[i+1],data[i+2]])
    }
    res.json({width:info.width,height:info.height,pixels})
  }catch(err){
    console.error("Error processing image:",err)
    res.status(500).json({error:"Failed to process image."})
  }
})

app.listen(PORT,()=>console.log(`✅ API running on http://localhost:${PORT}`))
