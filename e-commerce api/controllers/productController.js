const Product = require("../models/Product");
const createProduct = async (req,res,next)=>{
    try{
        const { name,description,price,category,stock} = req.body;
        const product = new Product({name,description,price,category,stock});
        await product.save();
        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    }
    catch(error){
        next(error);
    }
};
const getAllProducts = async (req,res,next)=>{
    try{
        const { category,minPrice,maxPrice,page = 1,limit = 10,search } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: "i" } },{ description: { $regex: search, $options: "i" } }];
        }
        if(category){
            filter.category = category;
        }
        if(minPrice || maxPrice){
            filter.price = {};
            if(minPrice){
                filter.price.$gte = Number(minPrice);//gte = greater than or equal to
            }
            if(maxPrice){
                filter.price.$lte = Number(maxPrice);//lte = less than or equal to
            }
        }
        let query = Product.find(filter);
        if(req.query.sort === "price"){
            query = query.sort({price: 1});
        }
        if(req.query.sort === "-price"){
            query = query.sort({price: -1});
        }
        const skip = (Number(page) - 1)*Number(limit);
        query = query.skip(skip).limit(Number(limit));
        const products = await query;
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts/Number(limit));
        return res.status(200).json({
            page: Number(page),
            limit: Number(limit),
            totalProducts,
            totalPages,
            products
        });
    }catch(error){
        next(error);
    }
}
const updateProduct = async(req,res,next)=>{
    try{
        const { id } = req.params;
        const product =  await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        return res.status(200).json({
            message: "Product updated successfully",
            product
        });
    }catch(error){
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            product
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {createProduct,getAllProducts,updateProduct,deleteProduct};