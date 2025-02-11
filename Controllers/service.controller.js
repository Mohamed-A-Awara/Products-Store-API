import Service from "../Models/Services.model.js";
import ApiError from "../Utils/ApiError.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createService = async (req , res , next )=>{
    let data = req.body
    try {
        if (req.file) {
            data.imageSrc = `/uploads/${req.file.filename}`;
        }
        data.createdAt = new Date().toISOString()
        let newData = new Service(data)
        await newData.save()
        res.status(201).json({status : "Success" , data : newData})

    } catch (error) {
        next( new ApiError(`Error From Create Home Content` , 500))
    }
}

const getAllServices = async (req , res , next )=>{
    try {
        let allData = await Service.find()
        if (! allData)
            return res.status(404).json({status : "Fail" , data : `No Data For Home`})

        res.status(200).json({status : "success" , data : allData})
    } catch (error) {
        next( new ApiError(`Error From Get All Home Content` , 500))
        
    }
}


const getServiceById = async (req , res , next )=>{
    let {id} = req.params 
    try {
        let item = await Service.findById(id)
        if (! item)
            return res.status(404).json({status : "Fail" , data : `No Content For This ${id} ID`})

        res.status(200).json({status : "success" , data : item})
    } catch (error) {
        next( new ApiError(`Error From Get Home Item Content` , 500))
        
    }
}

const deleteServiceById = async (req, res , next)=>{
    let {id} = req.params
    try {
        let item = await Service.findByIdAndDelete(id)
        if (!item)
            return res.status(404).json({status : "Fail" , data : `No Content For This ${id} ID`})

        if (item.imageSrc) {
            const imagePath =  item.imageSrc;
                fs.unlinkSync(`.${imagePath}`);
        }
        res.status(200).json({status : "success" , data : item})

    } catch (error) {
        next( new ApiError(`Error From Delete Home Content` , 500))
        
    }
}

const updateServiceById = async (req , res , next )=>{
    let newData = req.body;
    let { id } = req.params;

    try {
        let oldData = await Service.findById(id);
        if (!oldData)
        return res
            .status(404)
            .json({ status: "Fail", data: `No Data For This Id : ${id}` });

        if (req.file) {
            if (oldData.imageSrc) {
                const oldImagePath =  oldData.imageSrc;
                console.log(oldImagePath);
                fs.unlinkSync(`.${oldImagePath}`)
            }
        }
        let data = await Service.findByIdAndUpdate(
            id,
            { ...newData },
            { new: true }
        );
        res.status(200).json({ status: "Success", data: data });
    } catch (error) {
        next(new ApiError(`Error From Update Data`, 500));
    }
}
export {
    createService , getAllServices , getServiceById , updateServiceById , deleteServiceById
}