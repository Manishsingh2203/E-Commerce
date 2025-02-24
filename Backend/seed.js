const mongoose = require('mongoose')

const Product = require('./models/product.js');

 
const products = [ 
   {
    name:'Iphone 15pro',
    img :"https://m.media-amazon.com/images/I/81CgtwSII3L._AC_UF1000,1000_QL80_.jpg",
    price: 180000,
    desc :"very costly , out of bought"
},
{
    name:'Mackbook m2 pro',
    img :"https://m.media-amazon.com/images/I/51dXLL5oW6L._AC_UF1000,1000_QL80_.jpg",
    price: 250000,
    desc :"very costly , out of bought"
},
{
    name:'Galaxy Watch 4' ,
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkmQlwIMI4cGzkZct4y5InFjEIVx9pBABrGg&s",
    price:14000,
    desc:"Affordable ,You can Buy"
},
{
    name:'Galaxy tab A9' ,
    img:"https://www.mundoconectado.com.br/wp-content/uploads/2023/10/Tab-A9-310x310.jpg",
    price:16000,
    desc :"Affordable , Your Choice"
},
{
    name:'Vivo v27',
    img:"https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/d/n/k/v27-5g-pd2269-v2246-vivo-original-imagpv82geyhzfze.jpeg?q=70&crop=false",
    price : 34000,
    desc:"Not much costly , Your choice"
}
]

async function seedDB(){
   await Product.insertMany(products)  //promise ke chaining se bachne ke liye async aur await ka use krte
    console.log("Data seeded successfully");
}
module.exports = seedDB;