const mongoose = require('mongoose')

const Product = require('./models/product.js');
const User = require('./models/user.js');
 
const products = [ 
   {
    name:'JUNEBERRY',
    img :"https://m.media-amazon.com/images/I/61Vn1fMPh7L._AC_UL480_FMwebp_QL65_.jpg",
    price: 399,
    desc :"Material Composition: 100% Cotton; Sleeve Type: Half Sleeve; Occasion"
}
,
{
    name:'saavana',
    img :"https://m.media-amazon.com/images/G/31/img24/Fashion/AF/BAU/Winterflip/Unrec/ClothingSBC/4._CB543856130_.png",
    price: 599,
    desc :"Pair this Top with your favourite jeans and sneakers for a comfortable casual outfit"
},
{
    name:'Galaxy Watch 4' ,
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkmQlwIMI4cGzkZct4y5InFjEIVx9pBABrGg&s",
    price:14000,
    desc:"Affordable ,You can Buy"
},
{
    name:'US.POLO' ,
    img:"https://m.media-amazon.com/images/G/31/img24/Fashion/AF/BAU/Winterflip/Unrec/ClothingSBC/6._SY530_QL85_FMpng_.png",
    price:899,
    desc :" Gentle machine wash- For detailed instructions, follow the wash-care label on the garment"
},
{
    name:'Allen Solly',
    img:"https://m.media-amazon.com/images/I/51Bub-47L1L._SY741_.jpg",
    price : 599,
    desc:" Men's Crew Neck T-Shirts-Fabric 100% Cotton"
}
    
]

async function seedDB(){
   await Product.insertMany(products)  //promise ke chaining se bachne ke liye async aur await ka use krte
    console.log("Data seeded successfully");
}
module.exports = seedDB;